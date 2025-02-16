# main.py - Archivo generado autom�ticamente
import os
from fastapi import FastAPI
from app.routes import router  # Importamos el router de publicaciones
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Crear las tablas en la base de datos si no existen


Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.getenv("UPLOAD_DIR")  # 📌 Usa la variable de entorno o "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # ✅ Asegura que exista dentro del contenedor

app = FastAPI(title="Posts Service")

# Incluir las rutas de publicaciones
app.include_router(router, prefix="/posts")

app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Permitir peticiones desde el frontend
origins = [
    "http://localhost:3000"  # Agrega el dominio de producción si lo tienes
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)
@app.get("/")
def root():
    return {"message": "Microservicio de Publicaciones funcionando"}
