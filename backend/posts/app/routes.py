from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from .models import Post  # Asegúrate de importar tu modelo
from .database import get_db
from .services import get_current_user
import shutil
import os
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")  # 📌 Usa la variable de entorno o "uploads"


# 📌 Crear post con imagen
@router.post("/createpost", status_code=201)  # ✅ Código 201 para crear recursos
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    image: UploadFile = File(None),  # ✅ Imagen opcional
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    image_url = None

    if image:
        # 📌 Asegurar que el directorio de imágenes existe
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Guardar imagen
        image_filename = f"{uuid4()}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"/static/uploads/{image_filename}"  # ✅ URL corregida

    new_post = Post(
        title=title,
        content=content,
        image_url=image_url,  # ✅ Puede ser `None` si no hay imagen
        user_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {"message": "Publicación creada", "post": new_post}
# 📌 Obtener posts
@router.get("/getposts")
def get_my_posts(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    posts = db.query(Post).filter(Post.user_id == current_user.id).all()
    return posts


# 📌 Actualizar post (incluyendo imagen opcional)
@router.put("/update/{post_id}")
def update_post(
    post_id: int,
    title: str = Form(None),
    content: str = Form(None),
    image: UploadFile = File(None),  # Opcional
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado o no autorizado")

    if title:
        post.title = title
    if content:
        post.content = content

    if image:
        # Guardar nueva imagen
        image_filename = f"{uuid4()}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)
        
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        post.image_url = f"/static/uploads/{image_filename}"  # Nueva URL de la imagen

    db.commit()
    db.refresh(post)
    return {"message": "Post actualizado exitosamente", "post": post}


# 📌 Eliminar post
@router.delete("/delete/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado o no autorizado")

    # Eliminar imagen asociada
    if post.image_url:
        image_path = post.image_url.replace("/static/", UPLOAD_DIR)
        if os.path.exists(image_path):
            os.remove(image_path)

    db.delete(post)
    db.commit()
    return {"message": "Post eliminado exitosamente"}
