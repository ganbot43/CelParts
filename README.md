# Kite Utensilios

Plataforma ecommerce desarrollada con Nuxt 3 para Kite Utensilios. El proyecto combina una landing page pública, catálogo y flujo de compra, además de un panel administrativo para gestionar productos, categorías, pedidos, banners, pagos y el libro de reclamaciones.

## Qué tipo de proyecto es

Es una aplicación web full-stack con SSR, pensada para vender utensilios de cocina y administrar el negocio desde el mismo código base. Incluye:

- Landing page institucional y secciones de marketing.
- Ecommerce con catálogo, carrito, checkout y seguimiento de pedidos.
- Panel admin para operaciones internas.
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

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea el archivo `.env` con las variables necesarias.

## Variables de entorno

El proyecto usa configuración de entorno para la base de datos, correo, reCAPTCHA, sesión y S3.

```env
# Base de datos MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=kite_user
DB_PASSWORD=tu_password
DB_NAME=kiteprueba

# Sesión / auth
NUXT_SESSION_PASSWORD=una_clave_larga_y_segura

# App pública
NUXT_PUBLIC_APP_NAME=Kite Utensilios
NUXT_PUBLIC_COMPANY_NAME=Kite Utensilios
NUXT_PUBLIC_SITE_NAME=Kite Peru
NUXT_PUBLIC_SITE_URL=https://kite.pe
NUXT_PUBLIC_WHATSAPP=+51923821520

# Google reCAPTCHA
G_RECAPTCHA_SECRET_KEY=tu_secret_key
G_RECAPTCHA_SITE_KEY=tu_site_key

# SMTP
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=info@kite.pe
SMTP_PASSWORD=tu_password
SMTP_FROM="Kite Utensilios <info@kite.pe>"
SMTP_SECURE=false

# S3
S3_BUCKET=mi-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=tu_key
S3_SECRET_ACCESS_KEY=tu_secret
S3_ROOT_PREFIX=kite_utensilios
```

## Configurar S3 en AWS

El proyecto sube archivos desde el backend usando `@aws-sdk/client-s3` en estos flujos:

- `server/api/upload/image.post.ts` para imágenes del sistema.
- `server/api/(landing)/reclamaciones.post.ts` para adjuntos del libro de reclamaciones.

Para que funcione en AWS necesitas:

1. Crear un bucket S3 en la región que vayas a usar en `S3_REGION`.
2. Crear un IAM user o credenciales de acceso para la app.
3. Dar permisos mínimos de escritura al bucket, por ejemplo `s3:PutObject` y `s3:PutObjectAcl` si luego decides hacer los objetos públicos por ACL o políticas.
4. Asegurar lectura pública de los archivos si vas a consumir las URLs directas que devuelve la app, porque el código arma URLs públicas con el endpoint estándar de S3.
5. Cargar las variables `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` y, si quieres organizar archivos por carpeta, `S3_ROOT_PREFIX`.

Notas importantes:

- El upload de imágenes falla si faltan credenciales S3.
- El formulario de reclamaciones tiene fallback local a `public/uploads/complaints` solo cuando S3 no está configurado.
- No hace falta configurar CORS para estos uploads porque la subida la hace el servidor, no el navegador directamente.
- Si el bucket tiene bloqueado el acceso público, las URLs devueltas no serán visibles desde el navegador a menos que cambies el código para firmar URLs o sirvas los archivos por otro medio.

Ejemplo de configuración mínima:

```env
S3_BUCKET=mi-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
S3_ROOT_PREFIX=joymar_utensilios
```

## Base de datos

La aplicación usa MySQL con Drizzle ORM. El esquema está definido en `server/db/schema.ts` y las migraciones se generan con Drizzle Kit.

### Crear la base de datos

```bash
mysql -u root -p
```

Dentro del prompt de MySQL:

```sql
CREATE DATABASE kiteprueba CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
EXIT;
```

### Inicializar tablas y datos

Forma recomendada:

```bash
./reset-db.sh
```

Ese script normalmente hace lo siguiente:

1. Limpia la base de datos.
2. Genera migraciones a partir del esquema.
3. Aplica las migraciones.
4. Carga datos iniciales con seed.

Si prefieres hacerlo manualmente:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Tablas de la base de datos

El esquema actual crea 12 tablas:

- `business_config`: configuración general del negocio, logo, WhatsApp, dirección y flags del sistema.
- `users`: usuarios del sistema y roles administrativos.
- `categories`: categorías principales del catálogo.
- `subcategories`: subcategorías relacionadas a una categoría.
- `products`: productos del ecommerce.
- `product_images`: imágenes asociadas a productos.
- `payment_methods`: medios de pago disponibles como Yape, Plin o transferencia.
- `orders`: pedidos realizados por clientes.
- `order_items`: detalle de productos dentro de cada pedido.
- `order_status_logs`: historial de cambios de estado de pedidos.
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
-- El dominio configurado en metadata es `kite.pe`.

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
mysql -u kite_user -p kiteprueba -h 127.0.0.1 -e "SELECT 1"
```

### El puerto 3000 está ocupado

```bash
npm run dev -- -p 3001
```

## Documentación relacionada

- [Nuxt 3](https://nuxt.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [MySQL](https://dev.mysql.com/doc)
