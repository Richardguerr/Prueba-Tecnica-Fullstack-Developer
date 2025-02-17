# PRUEBA TÉCNICA - FULLSTACK DEVELOPER

## Descripción

Esta aplicación permite a los usuarios gestionar su perfil y sus publicaciones. Está dividida en:

- **Frontend**: Desarrollado en ReactJS, permite a los usuarios registrarse, autenticarse, gestionar su perfil y crear, listar y eliminar publicaciones.
- **Backend**: Compuesto por dos microservicios en Python utilizando FastApi:
  - **Microservicio de Usuarios**: Maneja el registro, autenticación (con JWT) y actualización de perfiles.
  - **Microservicio de Publicaciones**: Permite crear, listar y eliminar publicaciones asociadas a un usuario autenticado.

Ambos microservicios están contenedorizados usando Docker y Docker Compose.

---

## Requerimientos previos

- **Docker**: [Instalación de Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Instalación de Docker Compose](https://docs.docker.com/compose/install/)

---

## Estructura del Proyecto

```
.
├── backend
│   ├── users
│   │   ├── Dockerfile
│   │   └── main.py
│   └── posts
│       ├── Dockerfile
│       └── main.py
├── frontend
│   ├── Dockerfile
│   └── src
├── docker-compose.yml
└── .env
```

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Richardguerr/Pueba-Tecnica-Fullstack-Developer.git
cd Prueba-Tecnica-Fullstack-Developer
```


### 2. Construir y levantar los servicios

```bash
docker-compose up --build
```

### 3. Acceder a la aplicación

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Microservicio de Usuarios**: [http://localhost:8001/docs](http://localhost:8001/users) 
- **Microservicio de Publicaciones**: [http://localhost:8002/docs](http://localhost:8002/posts)

---

## Comunicación entre Microservicios

- **Autenticación**: El microservicio de Publicaciones valida el JWT enviado en las peticiones consultando al microservicio de Usuarios.
- **Dependencias**: El servicio de Publicaciones depende del de Usuarios y ambos dependen de la base de datos PostgreSQL.

---

## Endpoints Principales

### Microservicio de Usuarios (Puerto http://localhost/8001/users)

- **POST** `/register/` - Registrar un nuevo usuario
- **POST** `/login/` - Autenticar usuario (retorna un JWT)
- **GET** `/geToken/` - Retorna el ususario autenticado pasandole como parametro el token.
- **PUT** `/updateuser/` - Permite actualizar la información del usuario.
- **DELETE** `/deleteuser/` - Permite eliminar el usuario.
- **PUT** `/forgot-password/` - Permite recuperar la contraseña del usuario.





### Microservicio de Publicaciones (Puerto http:/localhost/8002/posts)

- **POST** `/createpost/` - Crear una nueva publicación (requiere autenticación)
- **GET** `/getposts/` - Listar todas las publicaciones del usuario autenticado
- **PUT** `/update/{id}/` - Actualizar una publicación específica
- **DELETE** `/posts/{id}/` - Eliminar una publicación específica

---


## Apagar los Servicios

```bash
docker-compose down
```

---

## Notas

- Asegúrate de que Docker y Docker Compose estén instalados y funcionando correctamente.
- Puedes inspeccionar los logs usando:

```bash
docker-compose logs -f
```

- Para reconstruir los contenedores después de realizar cambios:

```bash
docker-compose up --build
```

- El token tiene una duración de 5 minutos. Para agilizar la validación de la autenticación del usuario con los microservicios, puedes eliminarlo manualmente del LocalStorage.

