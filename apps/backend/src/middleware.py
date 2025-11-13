from fastapi import Request
from fastapi.responses import JSONResponse
from src.auth.utils import decode_access_token

PUBLIC_PATHS = [
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/check-email",
]

def cors_response(content, status_code=200):
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Credentials": "true",
    }
    return JSONResponse(content=content, status_code=status_code, headers=headers)


async def jwt_middleware(request: Request, call_next):
    print(request.method);
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        return cors_response(
            status_code=401,
            content={"detail": "Authorization header missing or invalid"},
        )

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)

    print("PAYLOAD", payload)
    if payload is None:
        return cors_response(
            status_code=401,
            content={"detail": "Invalid or expired token"},
        )

    request.state.user = payload
    print(request.state.user)

    return await call_next(request)
