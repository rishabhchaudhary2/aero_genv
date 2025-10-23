from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import connect_to_mongo, close_mongo_connection
from routes import auth, forms, members, leaderboard
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Aero Club API",
    description="Backend API for Aero Club NIT Kurukshetra",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(forms.router, prefix="/api", tags=["Forms"])
app.include_router(members.router, prefix="/api", tags=["Members"])
app.include_router(leaderboard.router, prefix="/api", tags=["Leaderboard"])

@app.get("/")
async def root():
    return {"message": "Welcome to Aero Club API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", port = 8000)