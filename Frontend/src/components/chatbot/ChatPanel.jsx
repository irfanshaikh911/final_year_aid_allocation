import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Activity } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { formatTime } from '../../utils/formatters';
import { humanClusters, resources, drones } from '../map/puneData';

const SUGGESTED = [
  'Which zones need urgent aid?',
  'Show low-stock warehouses',
  'Suggest nearest dispatch route',
  'Which drone detected highest crowd?',
  'List pending AI recommendations',
];

function ChatMessage({ msg }) {
  const isAI = msg.role === 'assistant';
  return (
    <div className={`flex gap-3 animate-fade-in ${isAI ? 'items-start' : 'items-end flex-row-reverse'}`}>
      {isAI ? (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy to-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-navy/20">
          <Bot className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron to-amber-600 flex items-center justify-center flex-shrink-0 mb-0.5 shadow-md shadow-saffron/20">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
          ${isAI 
            ? 'bg-white border border-surface-200 text-gray-800 rounded-tl-sm' 
            : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-br-sm'}`}>
          <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-medium">{msg.time}</p>
      </div>
    </div>
  );
}

export default function ChatPanel() {
  const { chatMessages, addChatMessage, inventory, stats, dispatchedClusters } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const time = formatTime();
    addChatMessage({ role: 'user', text: text.trim(), time });
    setInput('');
    setLoading(true);

    try {
      const systemState = {
        inventory,
        stats,
        dispatchedClusters,
        humanClusters: humanClusters.filter(c => c.people > 0).map(c => ({ zone: c.zone, stranded: c.people, severity: c.severity })),
        rescueTeams: resources.map(r => ({ name: r.name, status: r.status, route: r.route })),
        drones: drones.map(d => ({ name: d.name, status: d.status, battery: d.battery }))
      };

      const history = chatMessages.slice(-5).map(m => ({ role: m.role, content: m.text }));
      history.push({ role: 'user', content: text.trim() });

      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system_state: systemState })
      });
      
      const data = await res.json();
      if (data.reply) {
        addChatMessage({ role: 'assistant', text: data.reply, time: formatTime() });
      } else {
        addChatMessage({ role: 'assistant', text: 'Error: ' + JSON.stringify(data.error), time: formatTime() });
      }
    } catch (e) {
      console.error(e);
      addChatMessage({ role: 'assistant', text: 'Connection to AI server failed.', time: formatTime() });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-[#0a192f] px-4 py-3.5 flex-shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-saffron" />
          </div>
          <div>
            <p className="text-white text-xs font-bold font-heading tracking-wide">DAVI Intelligence</p>
            <p className="text-blue-300/80 text-[10px] font-medium">AI Operations Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-black/20 px-2 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
            <span className="text-[9px] font-bold text-blue-100 tracking-widest">LIVE RAG</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto custom-scroll px-4 py-5 space-y-6 min-h-0 bg-surface-50">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3 items-end animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy to-blue-900 flex items-center justify-center flex-shrink-0 mb-0.5 shadow-md shadow-navy/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-surface-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested queries */}
      <div className="px-4 py-3 bg-white border-t border-surface-200 flex-shrink-0 z-10 relative shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3 text-saffron" /> Recommended Intel
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[10px] font-medium px-3 py-1.5 bg-surface-100 hover:bg-navy hover:text-white text-gray-700 rounded-full border border-surface-200 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-white border-t border-surface-100 flex-shrink-0 z-10">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Query live operational data..."
            className="flex-1 text-sm px-4 py-3 pr-12 border border-surface-300 rounded-full bg-surface-50 
                       focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy focus:bg-white placeholder-gray-400 transition-all shadow-inner"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="absolute right-1 top-1 w-10 h-10 bg-gradient-to-r from-blue-600 to-navy hover:from-blue-500 hover:to-navy-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full 
                       flex items-center justify-center transition-all shadow-md shadow-navy/20 hover:scale-105 hover:shadow-lg"
            aria-label="Send"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
