from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import sqlite3
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

app = FastAPI(title="SQL Runner API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration: point to project-root sqlite file when running locally
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.path.normpath(os.path.join(BASE_DIR, "..", "sql_runner.db"))

# Security
security = HTTPBearer()

# In-memory storage for demo purposes (in production, use a proper database)
query_history = []
users_db = {
    "admin": {
        "username": "admin",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # secret
    }
}

def initialize_database() -> None:
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS DemoEmployees (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              role TEXT NOT NULL,
              hired_on DATE DEFAULT CURRENT_DATE
            );
            """
        )
        cur.executemany(
            "INSERT OR IGNORE INTO DemoEmployees (id, name, role) VALUES (?, ?, ?)",
            [
                (1, "Ava Patel", "Engineer"),
                (2, "Liam Chen", "Designer"),
                (3, "Maya Singh", "Product"),
            ],
        )
        conn.commit()
    finally:
        close_db_connection(conn)

@app.on_event("startup")
def _startup_seed() -> None:
    initialize_database()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    success: bool
    data: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None

class TableInfo(BaseModel):
    name: str
    columns: List[Dict[str, str]]
    sample_data: List[Dict[str, Any]]

class LoginRequest(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

def close_db_connection(conn):
    """Close database connection"""
    if conn:
        conn.close()

def execute_query(query: str) -> Dict[str, Any]:
    """Execute SQL query and return results"""
    conn = get_db_connection()
    cursor = conn.cursor()
    start_time = datetime.now()
    
    try:
        cursor.execute(query)
        
        # Check if it's a SELECT query
        if query.strip().upper().startswith('SELECT'):
            results = cursor.fetchall()
            data = [dict(row) for row in results]
        else:
            # For INSERT, UPDATE, DELETE queries
            conn.commit()
            data = [{"message": f"Query executed successfully. Rows affected: {cursor.rowcount}"}]
        
        end_time = datetime.now()
        execution_time = (end_time - start_time).total_seconds()
        
        return {
            "success": True,
            "data": data,
            "execution_time": execution_time
        }
        
    except sqlite3.Error as e:
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        close_db_connection(conn)

def get_table_names() -> List[str]:
    """Get list of available tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [row[0] for row in cursor.fetchall()]
        return tables
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db_connection(conn)

def get_table_info(table_name: str) -> Dict[str, Any]:
    """Get table schema and sample data"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get column information
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = [{"name": row[1], "type": row[2]} for row in cursor.fetchall()]
        
        # Get sample data (first 5 rows)
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
        sample_data = [dict(row) for row in cursor.fetchall()]
        
        return {
            "name": table_name,
            "columns": columns,
            "sample_data": sample_data
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db_connection(conn)

# Authentication functions
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    # For demo purposes, we'll use a simple token
    if credentials.credentials != "demo-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SQL Runner API is running"}

@app.post("/api/execute", response_model=QueryResponse)
async def execute_sql_query(request: QueryRequest, token: str = Depends(verify_token)):
    """Execute SQL query"""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = execute_query(request.query)
    
    # Store query in history
    query_history.append({
        "query": request.query,
        "timestamp": datetime.now().isoformat(),
        "success": result["success"],
        "execution_time": result.get("execution_time")
    })
    
    return QueryResponse(**result)

@app.get("/api/tables")
async def get_tables(token: str = Depends(verify_token)):
    """Get list of available tables"""
    tables = get_table_names()
    return {"tables": tables}

@app.get("/api/tables/{table_name}", response_model=TableInfo)
async def get_table_details(table_name: str, token: str = Depends(verify_token)):
    """Get table schema and sample data"""
    try:
        table_info = get_table_info(table_name)
        return TableInfo(**table_info)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_query_history(token: str = Depends(verify_token)):
    """Get query execution history"""
    return {"history": query_history[-20:]}  # Return last 20 queries

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    # For demo purposes, we'll use simple authentication
    if request.username == "admin" and request.password == "secret":
        return AuthResponse(
            access_token="demo-token",
            token_type="bearer"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
