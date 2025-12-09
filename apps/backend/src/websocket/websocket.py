from typing import Dict
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    BUFFER = {}
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, key: str):
        await websocket.accept()
        self.active_connections[key] = websocket

    def disconnect(self, key: str):
        if key in self.active_connections:
            del self.active_connections[key]

    async def send_personal_message(self, key: str, message: dict):
        ws = self.active_connections.get(key)
        if ws:
            try:
                await ws.send_json(message)
            except (RuntimeError, WebSocketDisconnect):
                if key in self.active_connections:
                    del self.active_connections[key]
    async def broadcast_type(self, prefix: str, message: dict):
        for key, ws in self.active_connections.items():
            if key.startswith(prefix):
                try:
                    await ws.send_json(message)
                except (RuntimeError, WebSocketDisconnect):
                    if key in self.active_connections:
                        del self.active_connections[key]                    
    async def is_exists(self, key):
        ws = self.active_connections.get(key)
        if ws:
            try:
                await ws.send_text("")
                return True
            except RuntimeError:
                del self.active_connections[key]
                return False
        return False
    async def remove_websocket(self, key: str):
        if key in self.active_connections:
            del self.active_connections[key]

manager = ConnectionManager()
