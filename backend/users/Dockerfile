# Usa una imagen base de Python
FROM python:3.11

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del servicio al contenedor
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Expone el puerto en el que corre FastAPI
EXPOSE 8001

# Comando para ejecutar el servicio
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
