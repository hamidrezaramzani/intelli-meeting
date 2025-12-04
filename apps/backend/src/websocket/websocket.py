from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        try:
            await websocket.accept()
            self.active_connections[user_id] = websocket
        except:
            print("ERROR")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, user_id: str, message: dict):
       try:
            ws = self.active_connections[str(user_id)]
            if ws:
                await ws.send_json(message)
       except Exception as e:
           print(e, self.active_connections)

    async def broadcast(self, message: dict):
        for ws in self.active_connections.values():
            await ws.send_json(message)

manager = ConnectionManager()
