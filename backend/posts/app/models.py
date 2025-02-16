from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True)
    content = Column(String)
    image_url = Column(String, nullable=True)  # 🆕 Nueva columna para almacenar la URL de la imagen
    user_id = Column(Integer, index=True)