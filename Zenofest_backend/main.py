from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import events, registrations, payments, lookup, invoices, contact
from app.config import settings
from app.database import engine
from app.models import Base

app = FastAPI(
    title="ZenoFest 2k26 Backend",
    description="Backend API for ZenoFest 2k26 - College Technical Festival",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(events.router, prefix="/api", tags=["events"])
app.include_router(registrations.router, prefix="/api", tags=["registrations"])
app.include_router(payments.router, prefix="/api", tags=["payments"])
app.include_router(lookup.router, prefix="/api", tags=["lookup"])
app.include_router(invoices.router, prefix="/api", tags=["invoices"])
app.include_router(contact.router, prefix="/api", tags=["contact"])

@app.get("/")
def root():
    return {"message": "ZenoFest 2k26 Backend API", "version": "2.0.0"}
