from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.sqlite3')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

from pydantic import BaseModel

class InventoryItem(BaseModel):
    resource: str
    warehouse: str
    available: int = 0
    inTransit: int = 0
    unit: str
    critical: bool = False

@app.get("/api/inventory")
def get_inventory():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM inventory')
    rows = cursor.fetchall()
    conn.close()
    
    inventory = []
    for row in rows:
        inventory.append({
            "id": row["id"],
            "resource": row["resource"],
            "warehouse": row["warehouse"],
            "available": row["available"],
            "inTransit": row["in_transit"],
            "unit": row["unit"],
            "critical": bool(row["critical"])
        })
    return inventory

@app.post("/api/inventory")
def add_inventory(item: InventoryItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, available, in_transit FROM inventory WHERE resource = ? AND warehouse = ?', 
                   (item.resource, item.warehouse))
    existing = cursor.fetchone()
    
    if existing:
        new_avail = existing['available'] + item.available
        new_transit = existing['in_transit'] + item.inTransit
        cursor.execute('''
            UPDATE inventory SET available = ?, in_transit = ?, critical = ?
            WHERE id = ?
        ''', (new_avail, new_transit, int(item.critical), existing['id']))
        new_id = existing['id']
        final_item = {
            "id": new_id,
            "resource": item.resource,
            "warehouse": item.warehouse,
            "available": new_avail,
            "inTransit": new_transit,
            "unit": item.unit,
            "critical": item.critical
        }
    else:
        cursor.execute('''
            INSERT INTO inventory (resource, warehouse, available, in_transit, unit, critical)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (item.resource, item.warehouse, item.available, item.inTransit, item.unit, int(item.critical)))
        new_id = cursor.lastrowid
        final_item = {"id": new_id, **item.dict()}
        
    conn.commit()
    conn.close()
    return final_item


class RecommendRequest(BaseModel):
    zone: str
    lat: float
    lng: float
    humans: int
    severity: str
    all_clusters: list = []

import requests
import json
import math

def load_env():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)
    env_paths = [
        os.path.join(backend_dir, '.env'),
        os.path.join(project_root, '.env'),
    ]
    env_vars = {}
    for env_path in env_paths:
        if not os.path.exists(env_path):
            continue
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip().lstrip('\ufeff')
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip().strip('"').strip("'")
        if env_vars:
            break
    return env_vars

GROQ_MODEL = "openai/gpt-oss-20b"

WAREHOUSE_LOCATIONS = {
    'Wagholi Central Safe-Hub': {'lat': 18.5700, 'lng': 73.9800},
    'Katraj Hill Depot': {'lat': 18.4500, 'lng': 73.8500},
    'Kothrud Medical Reserve': {'lat': 18.5000, 'lng': 73.8000},
}

def calculate_distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

@app.post("/api/recommend")
def get_recommendation(req: RecommendRequest):
    env_vars = load_env()
    groq_api_key = env_vars.get("gorq_api")
    if not groq_api_key:
        return {"error": "Groq API key not found in .env"}

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM inventory WHERE available > 0')
    rows = cursor.fetchall()
    conn.close()

    inventory_data = []
    for r in rows:
        w_name = r['warehouse']
        w_loc = WAREHOUSE_LOCATIONS.get(w_name, {'lat': 0, 'lng': 0})
        dist = calculate_distance(req.lat, req.lng, w_loc['lat'], w_loc['lng'])
        inventory_data.append({
            "warehouse": w_name,
            "resource": r['resource'],
            "available": r['available'],
            "distance_deg": round(dist, 4)
        })

    prompt = f"""
Target Disaster Zone: {req.zone}
Location: Lat {req.lat}, Lng {req.lng}
Humans stranded: {req.humans}
Severity: {req.severity}

Other Active Clusters in the Region:
{json.dumps(req.all_clusters, indent=2)}

Available Inventory:
{json.dumps(inventory_data, indent=2)}

You are an emergency response AI. Based on the stranded humans at the Target Disaster Zone, calculate the necessary aid.
Assume each person needs 1 unit of Food Packets and 1 unit of Drinking Water. Medical Kits are needed if severity is High or Critical (1 kit per 10 people).
Choose the closest warehouse with sufficient inventory.

Compare this Target Zone against the Other Active Clusters. Should we allocate resources here immediately, or hold them for a more critical cluster? 
Return ONLY a valid JSON object in this exact format:
{{
  "recommendations": [
    {{"warehouse": "Warehouse Name", "resource": "Food Packets", "quantity": 100}}
  ],
  "reasoning": "Brief explanation of the choice based on distance and inventory.",
  "comparison_analysis": "Brief analysis comparing this zone's urgency with the other active clusters.",
  "suggestion": "APPROVE or REJECT"
}}
"""
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {groq_api_key}", "Content-Type": "application/json"},
            json={
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}
            },
            timeout=10
        )
        data = resp.json()
        if 'error' in data:
            return {"error": data['error']}
        
        content = data['choices'][0]['message']['content']
        import re
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
            
        return json.loads(content)
    except Exception as e:
        return {"error": str(e), "raw": data if 'data' in locals() else None}

class AcceptRecommendationRequest(BaseModel):
    recommendations: list

class ChatRequest(BaseModel):
    messages: list
    system_state: dict

@app.post("/api/chat")
def chat_assistant(req: ChatRequest):
    env_vars = load_env()
    groq_api_key = env_vars.get("gorq_api")
    if not groq_api_key:
        return {"error": "Groq API key not found in .env"}

    # Construct the System Prompt with Live RAG Context
    system_prompt = f"""
You are DAVI Intelligence, an elite AI Operations Assistant for the District Disaster Management Authority.
You must analyze the following LIVE system state to answer the commander's queries accurately.

LIVE SYSTEM STATE:
{json.dumps(req.system_state, indent=2)}

Guidelines:
1. Answer concisely and professionally like a military/emergency dispatcher.
2. If asked about inventory, check the provided LIVE SYSTEM STATE.
3. If asked about human clusters or rescue teams, use the LIVE SYSTEM STATE.
4. If you don't know something, state that sensor data is currently unavailable.
"""

    messages = [{"role": "system", "content": system_prompt}] + req.messages

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {groq_api_key}", "Content-Type": "application/json"},
            json={
                "model": GROQ_MODEL,
                "messages": messages
            },
            timeout=15
        )
        data = resp.json()
        if 'error' in data:
            return {"error": data['error']}
        
        reply = data['choices'][0]['message']['content']
        return {"reply": reply}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/accept_recommendation")
def accept_recommendation(req: AcceptRecommendationRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    for rec in req.recommendations:
        cursor.execute(
            'UPDATE inventory SET available = available - ? WHERE warehouse = ? AND resource = ? AND available >= ?',
            (rec['quantity'], rec['warehouse'], rec['resource'], rec['quantity'])
        )
    
    conn.commit()
    conn.close()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
