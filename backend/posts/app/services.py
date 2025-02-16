import requests
import os
from fastapi import HTTPException, Header
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL","http://users_service:8001/users")   # URL del microservicio de users

class AuthenticatedUser(BaseModel):
    id: int
    name: str
    email: str

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    response = requests.get(f"{USERS_SERVICE_URL}/getToken", headers={"Authorization": authorization})
    
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Token inválido")

    user_data = response.json()
    return AuthenticatedUser(**user_data)  # 🔹 Convierte el diccionario en un objeto