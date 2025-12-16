import redis.asyncio as redis
import json
from src.config import settings

redis_client = redis.from_url(settings.REDIS_DB_URL, decode_responses=True)

async def publisher(channel: str, message: dict):
    await redis_client.publish(channel, json.dumps(message))