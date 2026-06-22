# CelParts

Plataforma ecommerce desarrollada con Nuxt 3 para CelParts. El proyecto combina una landing page pública, catálogo y flujo de compra, además de un panel administrativo para gestionar productos, categorías, pedidos, banners, pagos y el libro de reclamaciones.

## Qué tipo de proyecto es

Es una aplicación web full-stack con SSR, pensada para vender repuestos y accesorios para teléfonos móviles y administrar el negocio desde el mismo código base. Incluye:

- Landing page institucional y secciones de marketing.
- Ecommerce con catálogo organizado por categorías (pantallas, baterías, cases, cargadores, protectores, entre otros) y filtros por marca de celular, carrito, checkout y seguimiento de pedidos.
- Panel admin para operaciones internas con roles diferenciados entre superadmin y admin.
- Persistencia en MySQL con Drizzle ORM.

## Tecnologías

- Nuxt 3
- Vue 3
- TypeScript
- MySQL
- Drizzle ORM y Drizzle Kit
- Pinia
- Nuxt UI
- Tailwind CSS v4
- Nuxt Image, Nuxt Icon y Nuxt Sitemap
- nuxt-auth-utils para autenticación y sesión
- nodemailer para correos
- AWS S3 SDK para almacenamiento de archivos e imágenes
- bcryptjs para hashing de contraseñas
- zod para validación
- Google reCAPTCHA para protección de formularios contra bots
- PM2 para gestión de procesos en producción
- NGINX como servidor web y proxy inverso

## Requisitos

- Node.js 20
- npm
- MySQL 8 o superior
- Opcional: Git Bash o WSL en Windows para ejecutar `reset-db.sh`

Verifica tu versión de Node:

```bash
nvm use 20
node -v
```

## 🐳 Despliegue y CI/CD (Docker)

El proyecto cuenta con una arquitectura de despliegue automatizada (CI/CD) impulsada por **Docker** y **GitHub Actions**.

- **CI/CD Automático:** Al hacer `git push` a la rama `celparts-main`, GitHub Actions se encarga de hacer el build de la aplicación y enviar la imagen final a Docker Hub (`ganbito/celparts-ef3:latest`).
- **Producción:** En el servidor solo requieres los archivos `docker-compose-celpartsEF3.prod.yml` y `.env`. No es necesario instalar Node ni compilar código en vivo.
- **Desarrollo Local:** Tienes la opción de levantar MySQL o la app completa con `docker-compose-celpartsEF3.yml`.

📚 **Guías de Arquitectura:**
- 👉 [Ciclo de vida y Desarrollo (Workflow)](README-WORKFLOW.md)
- 👉 [Guía de Despliegue en Servidor](README-DEPLOY.md)

---

## 🚀 Guía Rápida de Inicio (Quickstart Manual)

Sigue estos pasos en orden para levantar el proyecto desde cero de manera tradicional.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/celparts-main.git
cd celparts-main
```

### 2. Instalar dependencias
Asegúrate de usar **Node.js 20**.
```bash
nvm use 20
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto. Puedes copiar un archivo de ejemplo si existe o crear uno nuevo con las credenciales locales:
```env
# Base de datos MySQL local
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=celparts

# Sesión / auth
NUXT_SESSION_PASSWORD=una_clave_secreta_de_al_menos_32_caracteres_de_largo

# Google reCAPTCHA (Dejar vacío en desarrollo si no hay validación estricta)
G_RECAPTCHA_SITE_KEY=
G_RECAPTCHA_SECRET_KEY=
```
*(Revisa la sección "Variables de entorno completas" más abajo para ver configuraciones de SMTP y S3).*

### 4. Crear la Base de Datos
Debes tener MySQL corriendo. Entra a tu cliente MySQL (por terminal o usando herramientas como XAMPP, DBeaver, etc.) y ejecuta:
```sql
CREATE DATABASE celparts CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 5. Inicializar Tablas y Datos (Migraciones y Seed)
Una vez creada la base de datos vacía, Drizzle ORM se encarga del resto. Tienes dos opciones eficaces:

**Opción A (Recomendada si usas Bash):**
Ejecuta el script de reinicio rápido que limpia la BD, aplica esquemas e inserta datos iniciales:
```bash
./reset-db.sh
```

**Opción B (Manual):**
Si estás en Windows PowerShell o prefieres el control manual, ejecuta:
```bash
npm run db:generate   # Genera los archivos SQL del esquema
npm run db:migrate    # Aplica las tablas a la base de datos
npm run db:seed       # Inserta usuarios admin, productos y configuraciones por defecto
```

### 6. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```
🎉 ¡Listo! La plataforma está corriendo en `http://localhost:3000`. 
*(Puedes acceder al admin en `http://localhost:3000/admin` usando las credenciales del seed).*

---

## Variables de entorno completas

El proyecto usa configuración de entorno para la base de datos, correo, reCAPTCHA, sesión y S3.

```env
# Base de datos MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=celparts_user
DB_PASSWORD=tu_password
DB_NAME=celparts

# Sesión / auth
NUXT_SESSION_PASSWORD=una_clave_larga_y_segura

# App pública
NUXT_PUBLIC_APP_NAME=CelParts
NUXT_PUBLIC_COMPANY_NAME=CelParts
NUXT_PUBLIC_SITE_NAME=CelParts
NUXT_PUBLIC_SITE_URL=https://celparts.pe
NUXT_PUBLIC_WHATSAPP=+51900000000

# Google reCAPTCHA
G_RECAPTCHA_SECRET_KEY=tu_secret_key
G_RECAPTCHA_SITE_KEY=tu_site_key

# SMTP (Envío de correos de pedidos)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASSWORD=tu_app_password
SMTP_FROM="CelParts <info@celparts.pe>"
SMTP_SECURE=false

# S3 (Upload de imágenes)
S3_BUCKET=mi-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=tu_key
S3_SECRET_ACCESS_KEY=tu_secret
S3_ROOT_PREFIX=celparts

# Watson Assistant (Chatbot de Inteligencia Artificial)
WATSON_INTEGRATION_ID=tu_integration_id
WATSON_REGION=us-south
WATSON_SERVICE_INSTANCE_ID=tu_service_instance_id
```

## Configurar S3 en AWS

El proyecto sube archivos desde el backend usando `@aws-sdk/client-s3` en estos flujos:

- `server/api/upload/image.post.ts` para imágenes del sistema.
- `server/api/(landing)/reclamaciones.post.ts` para adjuntos del libro de reclamaciones.

Para que funcione en AWS necesitas:

1. Crear un bucket S3 en la región que vayas a usar en `S3_REGION`.
2. Crear un IAM user o credenciales de acceso para la app.
3. Dar permisos mínimos de escritura al bucket, por ejemplo `s3:PutObject` y `s3:PutObjectAcl`.
4. Asegurar lectura pública de los archivos si vas a consumir las URLs directas.
5. Los archivos se guardarán organizados por año, mes y día (ej. `products/YYYY/MM/DD/`).

Notas importantes:
- El formulario de reclamaciones tiene fallback local a `public/uploads/complaints` solo cuando S3 no está configurado.

## Base de datos (Esquema completo)

La aplicación usa MySQL con Drizzle ORM. El esquema está definido en `server/db/schema.ts`.

### Tablas de la base de datos

El esquema actual crea 13 tablas:

- `business_config`: configuración general del negocio, nombre, ruc, logo, WhatsApp, dirección y flags del sistema.
- `users`: usuarios del sistema con roles diferenciados (superadmin y admin).
- `categories`: categorías principales del catálogo (pantallas, baterías, cases, cargadores, protectores, entre otros).
- `subcategories`: subcategorías relacionadas a una categoría.
- `products`: productos del ecommerce con filtros por marca de celular.
- `product_images`: imágenes asociadas a productos.
- `payment_methods`: medios de pago disponibles como Yape, Plin o transferencia bancaria.
- `orders`: pedidos realizados por clientes.
- `order_items`: detalle de productos dentro de cada pedido.
- `order_status_logs`: historial de cambios de estado de pedidos.
- `inventory_movements`: historial y registro de movimientos de inventario por compras o ajustes manuales.
- `banners`: banners promocionales o de homepage.
- `complaints`: registros del libro de reclamaciones.

### Datos de ejemplo

El seed carga información de prueba para trabajar en local:

- Usuarios administrativos.
- Categorías y subcategorías.
- Productos de ejemplo.
- Métodos de pago.

## Ejecutar el proyecto

### Desarrollo

```bash
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

### Build de producción

```bash
npm run build
```

Genera la carpeta `.output/` lista para despliegue.

### Previsualizar el build

```bash
npm run preview
```

### Ejecutar el build generado

```bash
npm run start
```

## Comandos útiles

```bash
npm run dev
npm run build
npm run preview
npm run start
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Estructura general

```text
app.vue                  Layout raíz
nuxt.config.ts           Configuración de Nuxt
pages/                   Rutas públicas, ecommerce y admin
components/              Componentes reutilizables
layouts/                 Layouts de la aplicación
composables/             Lógica reutilizable
stores/                  Stores de Pinia
server/api/              Endpoints backend
server/db/               Esquema, migraciones, seed y acceso a BD
assets/css/              Estilos globales y tokens
public/                  Archivos estáticos
```

## Despliegue con PM2

```bash
pm2 start ecosystem.config.jsx --env production
pm2 save
```

Si ya generaste `.output/` en tu entorno de build, copia esa carpeta al servidor antes de arrancar PM2.

## Notas de configuración

- `nuxt.config.ts` habilita SSR.
- La app usa sitemap y excluye rutas privadas como `/admin` y `/login`.
- El proyecto integra Google Fonts, iconos de Font Awesome y utilidades de Tailwind v4.
- El dominio configurado en metadata es `celparts.pe`.

## Solución de problemas

### Las migraciones no se aplican

- Revisa que `.env` tenga las credenciales correctas.
- Vuelve a generar migraciones con `npm run db:generate`.
- Aplica de nuevo con `npm run db:migrate`.

### La conexión a MySQL falla

- Confirma que MySQL esté levantado.
- Valida `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`.
- Prueba la conexión manualmente:

```bash
mysql -u celparts_user -p celparts -h 127.0.0.1 -e "SELECT 1"
```

### El puerto 3000 está ocupado

```bash
npm run dev -- -p 3001
```

## Documentación relacionada

- [Nuxt 3](https://nuxt.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [MySQL](https://dev.mysql.com/doc)
