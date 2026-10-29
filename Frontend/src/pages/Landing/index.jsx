import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import irfanImg from '../../assets/Irfan.png';
import bgImage from '../../assets/bg image.png';
import logo from '../../assets/logo.png';
import NarendraModiVideo from '../../assets/Narendra Modi.mp4';
import EknathShindeVideo from '../../assets/Eknath Shinde.mp4';
import ajitPawarVideo from '../../assets/ajit_pawar.mp4';
import DevendraFadnavisVideo from '../../assets/Devendra Fadnavis.mp4';
import IrfanShaikh from '../../assets/Irfan Shaikh.mp4'
import UtkarshPingale from '../../assets/Utkarsh Pingale.mp4'
import AtharvaNawale from '../../assets/Atharva Nawle.mp4'
import eknathShindeImg from '../../assets/Eknath_Shinde.jpg';
import devendraFadnavisImg from '../../assets/Devendra_Fadnavis.jpg';
import ajitPawarImg from '../../assets/Ajit_Pawar.jpg';
import { motion, AnimatePresence } from 'framer-motion';


import {
  Map,
  Zap,
  Radio,
  Users,
  Package,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  CheckCircle,
  Bell,
  X,
} from 'lucide-react';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';


const features = [
  {
    icon: Map,
    title: 'Live Disaster Mapping',
    desc: 'Real-time GIS mapping of disaster zones across Pune district with severity classification and crowd density analysis.',
    accent: 'saffron',
  },
  {
    icon: Zap,
    title: 'AI Resource Allocation',
    desc: 'Machine learning algorithms analyze need, stock levels, and logistics to recommend optimal aid dispatch.',
    accent: 'navy',
  },
  {
    icon: Radio,
    title: 'Drone Monitoring',
    desc: 'Integrated aerial surveillance network providing live feed analysis and terrain assessment for rescue teams.',
    accent: 'india-green',
  },
  {
    icon: Users,
    title: 'Human Detection',
    desc: 'Computer vision identifies stranded civilians from drone imagery and flags high-density zones for priority rescue.',
    accent: 'saffron',
  },
  {
    icon: Package,
    title: 'Real-time Inventory',
    desc: 'District warehouse management system with live stock levels, transit tracking, and automated shortage alerts.',
    accent: 'navy',
  },
  {
    icon: MessageSquare,
    title: 'Emergency Decision Support',
    desc: 'AI assistant provides operational commanders with instant situational analysis and evidence-based recommendations.',
    accent: 'india-green',
  },
];

const accentBg = {
  saffron: 'bg-orange-100 text-orange-600',
  navy: 'bg-blue-100 text-blue-700',
  'india-green': 'bg-green-100 text-green-700',
};

const partners = ['NDMA', 'NDRF', 'DDMA PUNE'];

const leaders = [
  {
    name: 'Narendra Modi',
    role: 'Prime Minister of India',
    image:
      'https://www.thestatesman.com/wp-content/uploads/2022/09/03_Merged.jpg',
    video: NarendraModiVideo,
    msg: "Championing a resilient, self-reliant India by integrating cutting-edge AI, geospatial intelligence, and real-time operational data to establish world-class disaster management systems capable of safeguarding millions during extreme climate events."
  },
  {
    name: 'Eknath Shinde',
    role: 'Chief Minister, Maharashtra',
    image: eknathShindeImg,
    video: EknathShindeVideo,
    msg: "Driving Maharashtra's technological advancement in disaster preparedness. Committed to ensuring the absolute safety of citizens through rapid response networks, AI-driven resource allocation, and robust infrastructure development across the state."
  },
  {
    name: 'Devendra Fadnavis',
    role: 'Deputy Chief Minister',
    image: devendraFadnavisImg,
    video: DevendraFadnavisVideo,
    msg: "Spearheading modern governance through digital innovation. Focused on empowering the State Disaster Management Authority with deep data analytics, real-time drone surveillance, and inter-agency coordination for crisis mitigation."
  },
  {
    name: 'Ajit Pawar',
    role: 'Deputy Chief Minister',
    image: ajitPawarImg,
    video: ajitPawarVideo,
    msg: "Ensuring efficient financial and operational allocation for humanitarian operations. Dedicated to empowering grassroots response teams, optimizing disaster logistics, and rapidly deploying life-saving aid to vulnerable districts."
  },
];

const floodData = [
  { time: '10:00', level: 1.2 },
  { time: '11:00', level: 1.8 },
  { time: '12:00', level: 2.1 },
  { time: '13:00', level: 2.8 },
  { time: '14:00', level: 3.2 },
  { time: '14:32', level: 3.8 },
];

const districtData = [
  { district: 'Sangamwadi', risk: 92 },
  { district: 'Deccan', risk: 84 },
  { district: 'ShivajiN.', risk: 95 },
  { district: 'Kharadi', risk: 88 },
  { district: 'Aundh', risk: 79 },
];

const reliefData = [
  { name: 'Food Packs', value: 4970 },
  { name: 'Water (L)', value: 13800 },
  { name: 'Medical Kits', value: 838 },
];

const students = [
  {
    name: 'Irfan Shaikh',
    role: '• AI & Full Stack Developer',
    image: irfanImg,
    msg: 'Led the complete development of DAVI Vision as a final year B.Tech engineering project with a primary focus on AI integration, full stack system architecture, real-time disaster monitoring, emergency response coordination, intelligent humanitarian aid distribution and operational dashboard management. Worked extensively on backend APIs, AI-powered analytics, database integration, live monitoring systems and deployment workflows to create a scalable government-style disaster management platform.',
    video: IrfanShaikh,
  },

  {
    name: 'Utkarsh Pingale',
    role: '• Frontend Developer',
    image: 'https://i1.rgstatic.net/ii/profile.image/11431281515011992-1750847858507_Q512/Utkarsh-Pingale-2.jpg',
    msg: 'Designed and developed the frontend architecture and user interface of DAVI Vision inspired by real Maharashtra government portals. Contributed towards responsive layouts, analytics dashboard integration, visualization modules, government-style UI components, user experience improvements and real-time operational displays to ensure accessibility, clarity and production-grade presentation of the platform.',
    video: UtkarshPingale,
  },

  {
    name: 'Atharva Nawale',
    role: '• Research & Documentation',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQG1ahKUWR8FTA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719483178495?e=1780531200&v=beta&t=M3YFQBUoCbPm6zkdcxC41_vgb5ff8HDSgDDNqmA5yrY',
    msg: 'Handled project research, system documentation, workflow analysis, disaster management study and technical report preparation during the development of DAVI Vision. Contributed towards requirement gathering, government process understanding, operational planning documentation, feature structuring and research-based improvements for creating a comprehensive AI-powered disaster response platform.',
    video: AtharvaNawale,
  },
];


const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (selectedLeader || selectedStudent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedLeader, selectedStudent]);

  return (
    <div className="min-h-screen flex flex-col bg-[#071425] font-sans scroll-smooth relative">

      {/* Top Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/60 text-[11px] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
          <div className="flex gap-3 text-gray-700">
            <span>Government of Maharashtra</span>
            <span>|</span>
            <span>Disaster Management Department</span>
          </div>

          <div className="flex gap-4 text-gray-600">
            <span>A+</span>
            <span>A-</span>
            <span>मराठी</span>
          </div>
        </div>
      </div>

      {/* Tricolor Strip */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Navbar */}
      <nav className="bg-[#0B1F3A]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B1F3A]/70 shadow-lg shadow-[#03101f]/30 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">

          <div className="flex items-center gap-4 group">

            <div className="relative">
              <motion.div
                className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-500/30 via-white/10 to-green-500/30 blur-md opacity-0 group-hover:opacity-100"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <img
                src={logo}
                alt="DAVI Logo"
                className="relative h-14 w-auto object-contain rounded-xl border border-white/15 bg-white/95 p-1 shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div>
              <h1 className="text-white text-2xl font-extrabold tracking-tight drop-shadow-sm">
                DAVI VISION
              </h1>

              <p className="text-blue-200 text-[11px] tracking-[3px] uppercase">
                Disaster Aid Vision Intelligence
              </p>
            </div>

          </div>
          <div className="hidden md:flex items-center gap-6 ml-8">
            {['Features', 'Mission', 'Analytics', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-blue-100 hover:text-white text-sm"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="ml-auto">
            <Link
              to="/dashboard"
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Dashboard
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Alert Bar */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white text-sm py-2 shadow-[0_8px_25px_rgba(185,28,28,0.25)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bell className="w-4 h-4" />
          </motion.div>

          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)] animate-pulse" />
            Live
          </span>

          <marquee>
            CRITICAL ALERT: Rising water levels (3.8m) detected at Mula-Mutha river confluences in Pune. Rescue Team Alpha deployed to Sangamwadi. Drone feeds live across Shivajinagar and Kharadi zones.
          </marquee>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#0B1F3A] overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, 18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-0">

          <img
            src={bgImage}
            className="w-full h-full object-cover scale-105"
            alt=""
          />

          {/* Soft Blue Overlay */}
          <div className="absolute inset-0 bg-[#0B1F3A]/10" />

          {/* Smooth Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/75 via-[#0B1F3A]/45 to-[#0B1F3A]/25" />

        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1 mb-6 shadow-lg shadow-black/10">
              <Shield className="w-4 h-4 text-orange-300" />

              <span className="text-orange-200 text-xs font-semibold">
                Maharashtra State Disaster Management Authority
              </span>
            </div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-bold text-white leading-tight mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]"
            >
              Maharashtra Integrated AI Disaster Monitoring &
              Humanitarian Response Platform
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl"
            >
              An initiative by Maharashtra State Disaster Management Authority
              for real-time flood monitoring, rescue coordination,
              AI-powered humanitarian aid distribution,
              and emergency response operations across Pune District.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex gap-4 flex-wrap">
              <Link
                to="/dashboard"
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/50 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Access Command Center
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="group border border-white/25 bg-white/5 backdrop-blur-md text-white px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-orange-300/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
              >
                Learn More
              </a>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-3 gap-6 mt-12 border-t border-white/15 pt-8"
            >
              {[
                { value: 'Pune', label: 'Active Region Monitored' },
                { value: '595', label: 'Stranded Citizens Tracked' },
                { value: '3', label: 'Central Warehouses Active' },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-4 shadow-lg shadow-black/10 hover:border-orange-300/40 transition-all duration-300"
                >
                  <p className="text-3xl font-bold text-orange-300">
                    {s.value}
                  </p>

                  <p className="text-blue-200 text-sm mt-1">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Leaders Section */}
      <motion.section
        className="bg-white/95 py-14 border-b border-white/70"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4">

          <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center text-[#0B1F3A] mb-10">
            Government Leadership
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {leaders.map((leader) => (
              <motion.div
                key={leader.name}
                variants={fadeInUp}
                className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-orange-300/60 transition-all duration-300"
                onClick={() => setSelectedLeader(leader)}
              >
                <div className="overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-semibold text-[#0B1F3A]">
                    {leader.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {leader.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Partners */}
      <motion.div
        className="bg-gradient-to-r from-slate-100 via-white to-slate-100 border-y border-slate-200/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-10">
          {partners.map((p) => (
            <motion.span
              key={p}
              variants={fadeInUp}
              className="text-sm font-semibold text-gray-600 uppercase tracking-wider hover:text-[#0B1F3A] transition-colors"
            >
              {p}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.section
        id="features"
        className="py-20 bg-white/95 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-4">

          <motion.div variants={fadeInUp} className="text-center mb-14 relative">
            <h2 className="text-3xl font-bold text-[#0B1F3A] mb-4">
              Integrated Disaster Management
            </h2>

            <p className="text-gray-500 max-w-3xl mx-auto">
              DAVI Vision brings together AI, geospatial intelligence,
              drone monitoring, live alerts and relief coordination into a
              single unified disaster response platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {features.map(({ icon: Icon, title, desc, accent }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-6 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-300/60"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />

                <div
                  className={`relative w-14 h-14 rounded-2xl ${accentBg[accent]} flex items-center justify-center mb-5 shadow-lg transition-transform duration-500 group-hover:scale-110`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-semibold text-[#0B1F3A] text-lg mb-3">
                  {title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics */}
      <motion.section
        className="py-16 bg-[#f3f7fb] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <motion.div
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl"
          animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ['7', 'Active Disaster Zones'],
              ['4', 'Active Rescue Teams'],
              ['3', 'Drone Feeds Live'],
              ['595', 'Stranded Citizens Tracked'],
            ].map((item) => (
              <motion.div
                key={item[1]}
                variants={fadeInUp}
                className="group rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 text-center shadow-lg shadow-slate-200/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/60"
              >
                <motion.h3
                  className="text-3xl font-bold text-red-600"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {item[0]}
                </motion.h3>

                <p className="text-sm text-gray-500 mt-2">
                  {item[1]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section
        id="mission"
        className="py-20 bg-[#0B1F3A] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <motion.div
          className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-4xl mx-auto px-4 text-center">

          <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6">
            Our Mission
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-blue-100 leading-relaxed mb-10">
            DAVI Vision empowers disaster response agencies with
            AI-driven operational intelligence for faster rescue,
            smarter aid distribution and efficient humanitarian operations.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, label: 'Real-time Monitoring' },
              { icon: Shield, label: 'NDMA Compliant' },
              { icon: Zap, label: 'AI-Powered' },
              { icon: Globe, label: 'Pune District Coverage' },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={fadeInUp} className="text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-3 shadow-lg shadow-black/10 transition-all duration-300 group-hover:border-orange-300/60 group-hover:shadow-orange-500/20">
                  <Icon className="w-5 h-5 text-orange-300" />
                </div>

                <p className="text-sm text-blue-100">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Analytics */}
      <motion.section
        id="analytics"
        className="py-20 bg-white/95 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.08),transparent_25%)]" />
        <div className="max-w-7xl mx-auto px-4">

          <motion.div variants={fadeInUp} className="text-center mb-12 relative">
            <h2 className="text-3xl font-bold text-[#0B1F3A]">
              Pune District Operational Analytics
            </h2>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-3 gap-8"
          >

            {/* Line Chart */}
            <motion.div variants={fadeInUp} className="group bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/60">
              <h3 className="font-semibold mb-4">
                Hourly Water Level Trend (Meters)
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={floodData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#2563eb"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div variants={fadeInUp} className="group bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-300/60">
              <h3 className="font-semibold mb-4">
                Available Inventory (Total Units)
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={reliefData}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    {reliefData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          ['#2563eb', '#dc2626', '#16a34a', '#f59e0b'][index]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar Chart */}
            <motion.div variants={fadeInUp} className="group bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-300/60">
              <h3 className="font-semibold mb-4">
                Zone Severity Score (AI Rated)
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="risk"
                    fill="#1e3a8a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Student Feedback */}
      <motion.section
        className="py-20 bg-[#f3f7fb] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={staggerContainer}
      >
        <motion.div
          className="absolute right-0 top-24 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-7xl mx-auto px-4">

          <motion.div variants={fadeInUp} className="text-center mb-12 relative">
            <h2 className="text-4xl font-bold text-[#0B1F3A]">
              Project Development Team
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Final Year B.Tech Engineering Students Behind DAVI Vision Platform Development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {students.map((student) => (
              <motion.div
                key={student.name}
                variants={fadeInUp}
                className="group cursor-pointer bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/60 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-orange-300/60"
                onClick={() => setSelectedStudent(student)}
              >

                <div className="overflow-hidden">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-6">

                  <h3 className="font-bold text-2xl text-[#0B1F3A] mb-2">
                    {student.name}
                  </h3>

                  <p className="text-orange-600 font-semibold text-sm mb-4 leading-relaxed">
                    {student.role}
                  </p>

                  <p className="text-gray-600 leading-8 text-[15px]">
                    {student.msg}
                  </p>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-16 bg-white/95 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_45%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-[#0B1F3A] mb-4">
            Ready to Activate Command Center?
          </h2>

          <p className="text-gray-500 mb-7">
            Access real-time disaster data, AI recommendations,
            drone feeds and inventory management from one unified platform.
          </p>

          <Link
            to="/dashboard"
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 shadow-xl shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/50 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            Launch Dashboard
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0B1F3A] text-white relative overflow-hidden">

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.10),transparent_25%)]"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />

        <div className="relative max-w-7xl mx-auto px-4 py-14">

          <div className="grid md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img src={logo} alt="DAVI Logo" className="w-10 h-10 object-contain border border-orange-300/70 bg-white p-1 rounded-md shadow-lg shadow-orange-500/10" />

                <div>
                  <p className="font-bold text-lg">
                    DAVI VISION
                  </p>

                  <p className="text-blue-200 text-xs">
                    DISASTER AID VISION INTELLIGENCE
                  </p>
                </div>
              </div>

              <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                AI-powered humanitarian coordination platform for Pune District disaster response,
                flood monitoring and relief operations.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="font-semibold mb-4 text-orange-300">
                Quick Links
              </p>

              <ul className="space-y-3 text-sm text-blue-100">
                <li>Dashboard</li>
                <li>Live Map</li>
                <li>Drone Feed</li>
                <li>Inventory</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold mb-4 text-orange-300">
                Project Contact
              </p>

              <ul className="space-y-3 text-sm text-blue-100">

                <li className="flex items-center gap-2">
                  <Map className="w-4 h-4 flex-shrink-0" />
                  AISSMS Institute of Information Technology, Pune
                </li>

                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  irfan.shaikh@aissmsioit.org
                </li>

                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  utkarsh.pingale@aissmsioit.org
                </li>

                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  atharva.nawale@aissmsioit.org
                </li>

              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex justify-between flex-wrap gap-4 text-sm text-blue-200">
            <p>
              © 2026 DAVI VISION · Final Year B.Tech Project, AISSMS IOIT
            </p>

            <div className="flex gap-5">
              <span>Privacy Policy</span>
              <span>RTI</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Cinematic Leader Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Blurry Backdrop */}
            <div
              className="absolute inset-0 bg-[#071120]/80 backdrop-blur-xl"
              onClick={() => setSelectedLeader(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="relative w-full max-w-5xl bg-[#0B1F3A]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Background Looping Video */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-transparent to-[#0B1F3A]" />
              </div>

              {/* Ambient Lights */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedLeader(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Leader Image / Video */}
              <div className="relative z-10 w-full md:w-2/5 h-64 md:h-auto overflow-hidden border-r border-white/10 bg-black/50">
                {selectedLeader.video ? (
                  <video
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover object-top"
                  >
                    <source src={selectedLeader.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    className="w-full h-full object-cover object-top"
                  />
                )}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent opacity-80 md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B1F3A] hidden md:block" /> */}
              </div>

              {/* Content Details */}
              <div className="relative z-10 w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">

                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Command Center Authorized</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedLeader.name}
                </h3>

                <p className="text-orange-400 text-lg md:text-xl font-medium mb-6">
                  {selectedLeader.role}
                </p>

                <div className="h-px w-24 bg-gradient-to-r from-orange-500 to-transparent mb-6" />

                <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-8">
                  {selectedLeader.msg}
                </p>

                <div className="flex flex-wrap gap-4 mt-auto">
                  <Link
                    to="/dashboard"
                    onClick={() => setSelectedLeader(null)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    Enter Operations Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedLeader(null)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md"
                  >
                    Return to Portal
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Student Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Blurry Backdrop */}
            <div
              className="absolute inset-0 bg-[#071120]/80 backdrop-blur-xl"
              onClick={() => setSelectedStudent(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="relative w-full max-w-5xl bg-[#0B1F3A]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Background Looping Video */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-transparent to-[#0B1F3A]" />
              </div>

              {/* Ambient Lights */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Student Image / Video */}
              <div className="relative z-10 w-full md:w-2/5 h-64 md:h-auto overflow-hidden border-r border-white/10 bg-black/50">
                {selectedStudent.video ? (
                  <video
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover object-top"
                  >
                    <source src={selectedStudent.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={selectedStudent.image}
                    alt={selectedStudent.name}
                    className="w-full h-full object-cover object-top"
                  />
                )}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent opacity-80 md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B1F3A] hidden md:block" /> */}
              </div>

              {/* Content Details */}
              <div className="relative z-10 w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">

                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Project Development Team</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedStudent.name}
                </h3>

                <p className="text-orange-400 text-lg md:text-xl font-medium mb-6">
                  {selectedStudent.role}
                </p>

                <div className="h-px w-24 bg-gradient-to-r from-orange-500 to-transparent mb-6" />

                <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-8">
                  {selectedStudent.msg}
                </p>

                <div className="flex flex-wrap gap-4 mt-auto">
                  <Link
                    to="/dashboard"
                    onClick={() => setSelectedStudent(null)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
                  >
                    Enter Operations Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md"
                  >
                    Return to Portal
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}