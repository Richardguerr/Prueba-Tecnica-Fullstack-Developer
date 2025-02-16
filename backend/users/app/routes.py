from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from .database import get_db
from .models import User
from .auth import hash_password, verify_password, create_access_token, get_current_user
import jwt
import os
from datetime import datetime, timedelta
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key") 
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
FRONT_END_URL = os.getenv("FRONT_END_URL", "http://localhost:3000")


# Esquema de entrada para registro
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str

# Esquema de entrada para login
class LoginUser(BaseModel):
    email: EmailStr
    password: str

    # Esquema para actualizar datos del usuario
class UpdateUser(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    current_password: str | None = None
    new_password: str | None = None

@router.post("/register")
def register(user: RegisterUser, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    new_user = User(name=user.name, email=user.email, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    return {"message": "Usuario registrado"}

@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
   # Incluir el user_id en el token
    token_data = {"sub": existing_user.email, "user_id": existing_user.id}
    token = create_access_token(token_data)

    return {"access_token": token}

@router.get("/getToken")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}


@router.put("/updateuser")
def update_user(user_update: UpdateUser, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_update.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
        current_user.email = user_update.email
    
    if user_update.name:
        current_user.name = user_update.name
    
    if user_update.new_password:
        if not user_update.current_password or not verify_password(user_update.current_password, current_user.password):
            raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")
        current_user.password = hash_password(user_update.new_password)
    
    db.commit()
    db.refresh(current_user)
    return {"message": "Usuario actualizado exitosamente", "user": {"id": current_user.id, "name": current_user.name, "email": current_user.email}}

@router.delete("/deleteuser")
def delete_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.delete(current_user)
    db.commit()
    return {"message": "Usuario eliminado exitosamente"}

# Configuración de FastMail (Usando SMTP de Gmail como ejemplo)
MAIL_CONFIG = ConnectionConfig(
    MAIL_USERNAME="oscarguerr0205@gmail.com",  
    MAIL_PASSWORD="vkzu ldms gwyf pqdm",  # Usa una contraseña de aplicación si es Gmail
    MAIL_FROM="oscarguerr0205@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,  # 🟢 Reemplazo correcto
    MAIL_SSL_TLS=False,  # 🟢 Reemplazo correcto
    USE_CREDENTIALS=True
)

# Esquema para solicitud de recuperación de contraseña
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# Esquema para restablecer la contraseña
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# 🟢 Ruta para solicitar recuperación de contraseña
@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="No existe usuario con ese correo")

    # Generar token con vencimiento de 1 hora
    expiration = datetime.utcnow() + timedelta(hours=1)
    token_data = {"sub": user.email, "exp": expiration}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    reset_link = f"{FRONT_END_URL}/reset-password/{token}"  # Enlace al frontend

    # Configurar y enviar el correo
    message = MessageSchema(
        subject="Recuperación de contraseña",
        recipients=[user.email],  
        body=f"Hola {user.name},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n{reset_link}\n\nEste enlace es válido por 1 hora.",
        subtype="plain",
    )

    fm = FastMail(MAIL_CONFIG)
    await fm.send_message(message)

    return {"message": "Se ha enviado un enlace de recuperación a tu correo"}

# 🟢 Ruta para restablecer la contraseña
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="El token ha expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Token inválido")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    user.password = hash_password(request.new_password)
    db.commit()

    return {"message": "Contraseña restablecida exitosamente"}
