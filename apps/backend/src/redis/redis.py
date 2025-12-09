import redis.asyncio as redis
import json
redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

async def publisher(channel: str, message: dict):
    await redis_client.publish(channel, json.dumps(message))