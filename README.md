# 🧶 Arigumi — Frontend Ecommerce (Rama: `arigumi-main`)

¡Bienvenido al repositorio del Frontend de Arigumi! 

> **IMPORTANTE:** Todo el código actualizado y funcional de este frontend se encuentra exclusivamente en la rama **`arigumi-main`**. Asegúrate de estar posicionado en esta rama al clonar el repositorio.

## ¿Qué hace este proyecto?
Esta es la interfaz visual (Cliente) desarrollada con **Nuxt 3** y **Vue.js**. Es la plataforma web donde los usuarios finales navegan, diseñada específicamente para conectar a artesanos adultos mayores con compradores. 

**Características del Frontend:**
- Landing page y catálogo de productos.
- Integración de carrito de compras y proceso de checkout.
- Panel administrativo para la gestión de productos y categorías.
- Interfaz de Chat en tiempo real para negociaciones C2C (Client-to-Client).
- Sistema de diseño accesible y amigable.

## Arquitectura y Comunicación con el Backend
Este proyecto **NO** tiene base de datos propia ni lógica de negocio profunda. Toda esa responsabilidad recae en los microservicios construidos en Spring Boot (Java).

**¿Cómo se comunica?**
El frontend nunca llama a los microservicios (usuarios, catálogo, chat) de manera individual. En su lugar, todas las peticiones HTTP y conexiones WebSocket (STOMP) apuntan hacia un único lugar: **El API Gateway**.
- **URL Base de conexión:** `http://localhost:8080/`
- El API Gateway se encarga internamente de enrutar la petición (ej. `/api/auth` al User Service, o `/ws-chat` al Chat Service).

## ⚙️ Configuración Local para Desarrolladores

Por medidas de seguridad, el archivo de variables de entorno (`.env`) ha sido excluido de este repositorio (`.gitignore`). **Si acabas de clonar este proyecto, debes configurarlo antes de ejecutarlo:**

1. Solicita el archivo `.env` original al administrador del proyecto (Gino).
2. Crea un archivo llamado **exactamente** `.env` en la raíz de este proyecto (al mismo nivel que el `package.json`).
3. Pega el contenido proporcionado. Las variables clave incluyen la conexión al API Gateway (`NUXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`), el JWT Secret, y las credenciales de AWS S3.
4. Instala las dependencias necesarias. **Nota:** Debido a conflictos de versiones heredados, debes usar este comando exacto:
   ```bash
   npm install --legacy-peer-deps
   ```
5. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. El proyecto estará disponible en `http://localhost:3000`. Asegúrate de tener corriendo tu backend (Eureka, Gateway y Microservicios) para que la data cargue correctamente.
