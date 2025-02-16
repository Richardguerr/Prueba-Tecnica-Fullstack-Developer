from fastapi import FastAPI
from app.routes import router  # Importamos el router de usuarios
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Users Service")

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

# Incluir las rutas de usuarios con el prefijo "/users"
app.include_router(router, prefix="/users")
@app.get("/")
def root():
    return {"message": "Microservicio de Usuarios funcionando"}
