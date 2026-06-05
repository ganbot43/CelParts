```markdown
# 🧶 Arigumi — Plataforma de Ecommerce Comunitario C2C

Plataforma web full-stack con Server-Side Rendering (SSR) desarrollada con **Nuxt 3** para **Arigumi**. El proyecto está diseñado específicamente para conectar a artesanos adultos mayores en el Perú con compradores que valoran los tejidos y productos de crochet hechos a mano. 

A diferencia de un ecommerce tradicional, Arigumi implementa un **modelo híbrido colaborativo y circular (Client-to-Client)** donde los hilos de comunicación se cierran directamente vía WhatsApp sin intermediarios, respaldado por un potente panel administrativo para la moderación del mercado y el cumplimiento de la normativa legal peruana.

---

## 🎨 Sistema de Diseño Visual (Paleta Artesanal)

La interfaz de usuario abandona las paletas corporativas frías para adoptar una estética orgánica, cálida y de alta accesibilidad para adultos mayores. Los estilos globales están centralizados en `assets/css/main.css` bajo las especificaciones de **Tailwind CSS v4**:

*   **Sage (`#7d8e74` / `#6e7e65`):** Verde salvia utilizado como color de marca y para acciones afirmativas principales (Ej: *Publicar un nuevo tapete* o *Ingresar a mi cuenta*).
*   **Earth (`#584636` / `#9c8468`):** Marrón arcilla y tonos tierra para tipografía de encabezados premium y botones de edición secundaria.
*   **Cream Base (`#faf8f5` / `#f7f5f0`):** Fondo general estilo hueso/crema que integra visualmente una sutil textura matemática en cuadrícula de puntos de costura de 24px x 24px.
*   **Tipografía Híbrida:** Uso de *Playfair Display* (Serif elegante con énfasis itálicos para slogans del tejido comunitario) combinado con *Inter* (Sans-serif limpia y de alto contraste para inputs y textos de lectura).

---

## 👥 Arquitectura de Roles y Modelo de Negocio C2C

El esquema de la base de datos rompe el flujo tradicional lineal para dar soporte a una economía circular en la tabla `users` mediante un campo del tipo `mysqlEnum`:

1.  **`comprador`**: Usuario final que explora el catálogo público, guarda favoritos y utiliza el enlace directo a WhatsApp para adquirir una obra.
2.  **`vendedor`**: Adulto mayor auto-registrado que accede de forma exclusiva a **"Mi Panel de Tejedor"** para gestionar su catálogo personal expuesto en la vitrina.
3.  **`vendedor_comprador`**: El rol estrella del ecosistema. Permite un flujo híbrido donde el artesano puede comercializar sus piezas y, al mismo tiempo, adquirir o intercambiar tejidos con otros miembros de la comunidad dentro de la misma cuenta.
4.  **`admin` / `superadmin`**: Rol encargado de la gestión del sistema C2C. No vende productos propios, sino que actúa como moderador del mercado (aprobación de publicaciones), administrador de las configuraciones de negocio (`business_config`), banners publicitarios y atiende las incidencias del Libro de Reclamaciones.

---

## 🛠️ Tecnologías Core

*   **Framework**: Nuxt 3 (Vue 3, TypeScript, Pinia) con renderizado híbrido/SSR.
*   **Estilos & UI**: Tailwind CSS v4, Nuxt UI, Nuxt Image y Nuxt Icon.
*   **Autenticación**: `nuxt-auth-utils` para la persistencia ágil de sesiones cifradas de usuarios y abuelitos tejedores.
*   **Persistencia & Base de datos**: MySQL 8+ gestionado mediante **Drizzle ORM** y **Drizzle Kit**.
*   **Almacenamiento (Storage)**: AWS S3 SDK (`@aws-sdk/client-s3`) para la carga directa desde el servidor de imágenes de productos y adjuntos legales.
*   **Seguridad**: `bcryptjs` para el hashing de contraseñas, `zod` para la validación estricta de esquemas de formularios en runtime, y Google reCAPTCHA contra bots.
*   **Infraestructura de Servidor**: NGINX como proxy inverso y **PM2** para el control de procesos en producción sobre Node.js 20.

---

## 🗄️ Esquema de Base de Datos (12 Tablas Core)

Drizzle ORM mapea la base de datos relacional orientada al flujo C2C y la administración interna:

*   `business_config`: Configuración general del negocio, logo, WhatsApp, dirección y flags del sistema.
*   `users`: Usuarios del sistema con roles diferenciados y soporte de enums para los 5 roles (`comprador` hasta `superadmin`).
*   `categories`: Categorías principales del catálogo de productos artesanales (tejidos, crochet, accesorios, entre otros).
*   `subcategories`: Subcategorías relacionadas a una categoría.
*   `products`: Catálogo de obras de arte. Incluye campos críticos de la creación artesanal como: `material` (ej: *Lana de Alpaca Bebé*), `price` (Sabor local en Soles `S/.`), dimensiones físicas (`sizeLength`, `sizeWidth`, `sizeUnit: 'cm'`) y el flag booleano `offersPattern` (si el tejedor enseña o vende el patrón/guía de diseño).
*   `product_images`: Imágenes asociadas a productos y alojadas en el bucket S3.
*   `payment_methods`: Medios de pago disponibles como Yape, Plin o transferencia bancaria.
*   `orders`: Pedidos realizados por clientes.
*   `order_items`: Detalle de productos dentro de cada pedido.
*   `order_status_logs`: Historial de cambios de estado de pedidos.
*   `banners`: Banners promocionales o de homepage administrados por el dueño del sistema.
*   `complaints`: Registros del libro de reclamaciones digital, obligatorio por la legislación peruana.

---

## 🚀 Instalación y Configuración del Entorno

### Requisitos Previos
*   Node.js 20 (Verificar usando `nvm use 20` y `node -v`)
*   npm
*   MySQL 8.0 o superior configurado localmente.
*   Opcional: Git Bash o WSL en Windows para ejecutar `reset-db.sh`

### Pasos de Configuración

1. **Clonar el proyecto e instalar dependencias:**
```bash
   npm install

```

2. **Configurar Variables de Entorno (`.env`):**
Crea un archivo `.env` en la raíz del proyecto tomando como estructura base la siguiente configuración:

```env
   # Base de datos MySQL
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=arigumi_user
   DB_PASSWORD=tu_password
   DB_NAME=arigumi

   # Sesión / Seguridad
   NUXT_SESSION_PASSWORD=una_clave_larga_de_minimo_32_caracteres

   # Variables Públicas de la Comunidad
   NUXT_PUBLIC_APP_NAME=Arigumi
   NUXT_PUBLIC_COMPANY_NAME="Arigumi S.A.C."
   NUXT_PUBLIC_SITE_NAME=Arigumi
   NUXT_PUBLIC_SITE_URL=[https://arigumi.pe](https://arigumi.pe)
   NUXT_PUBLIC_WHATSAPP=+51940756166

   # Google reCAPTCHA
   G_RECAPTCHA_SITE_KEY=tu_site_key
   G_RECAPTCHA_SECRET_KEY=tu_secret_key

   # SMTP / Correos
   SMTP_HOST=mail.example.com
   SMTP_PORT=587
   SMTP_USER=info@arigumi.pe
   SMTP_PASSWORD=tu_password
   SMTP_FROM="Arigumi <info@arigumi.pe>"
   SMTP_SECURE=false

   # Amazon S3 Config (Uploads de productos y reclamos)
   S3_BUCKET=arigumi-media-bucket
   S3_REGION=us-east-1
   S3_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   S3_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   S3_ROOT_PREFIX=arigumi

```

3. **Inicializar la Base de Datos:**
Ingresa a tu consola de MySQL y crea la base de datos con soporte completo para caracteres especiales (Emojis de la UI y texto peruano):

```sql
   CREATE DATABASE arigumi CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

```

4. **Sincronizar y Poblar con Datos Muestra (Seeder):**
Para entornos Unix o terminales con Bash en Windows, ejecuta el script de automatización que limpia la base de datos, corre las migraciones de Drizzle y monta los datos iniciales de los tejedores pioneros (Abuela Clara, Don Ricardo):

```bash
   ./reset-db.sh

```

*Nota: También puedes ejecutar de forma manual la secuencia:* `npm run db:generate && npm run db:migrate && npm run db:seed`.

---

## 💻 Comandos de Desarrollo y Producción

Manejo de la aplicación a través de scripts de `npm`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo local en `http://localhost:3000`. |
| `npm run build` | Genera la compilación de producción optimizada en la carpeta `.output/`. |
| `npm run preview` | Previsualiza el build generado localmente. |
| `npm run start` | Inicia la aplicación Node.js ya compilada para producción. |
| `npm run db:studio` | Levanta el panel gráfico local de Drizzle para auditar visualmente las tablas MySQL. |
| `npm run db:generate` | Lee el esquema de TypeScript y genera los archivos `.sql` de migración. |
| `npm run db:migrate` | Impacta las migraciones pendientes directamente sobre tu base de datos MySQL. |
| `npm run db:seed` | Carga la información de prueba y configuración inicial en las tablas. |

---

## 📁 Estructura General del Proyecto

```text
app.vue                 Layout raíz
nuxt.config.ts          Configuración de Nuxt (SSR habilitado, exclusión de /admin en sitemap)
pages/                  Rutas públicas, catálogo del ecommerce y vistas protegidas del admin
components/             Componentes UI reutilizables (Fichas de tejidos, modales, alertas)
layouts/                Layouts diferenciados para la tienda pública y el panel administrativo
composables/            Lógica compartida y reactiva
stores/                 Manejo de estados globales con Pinia
server/api/             Endpoints y controladores del backend en Nuxt Server
server/db/              Esquema de tablas, migraciones generadas y script de semilla (seed)
assets/css/             Estilos globales, tokens de Tailwind v4 y patrón de cuadrícula
public/                 Archivos estáticos, imágenes locales y fallbacks locales de subida

```

---

## 📦 Almacenamiento en AWS S3 e Infraestructura de Subida

El backend procesa los archivos multimedia desde el servidor usando `@aws-sdk/client-s3` en los siguientes flujos de negocio:

* `server/api/upload/image.post.ts`: Para imágenes asociadas a los productos del catálogo.
* `server/api/(landing)/reclamaciones.post.ts`: Para adjuntar sustentos o evidencias en el Libro de Reclamaciones.

**Requisitos mínimos de AWS:**

1. Crear un bucket S3 en la región configurada en `S3_REGION`.
2. Crear un usuario IAM con permisos explícitos de escritura (`s3:PutObject` y `s3:PutObjectAcl` si se requiere herencia directa).
3. Asegurar la lectura pública de los archivos si se consumen directamente mediante el endpoint estándar de S3 devuelto por la aplicación.
4. **Mecanismo de Fallback:** Si no se configuran las credenciales de AWS S3 en el entorno, el formulario del Libro de Reclamaciones cuenta con un mecanismo de emergencia automático que almacena los archivos localmente en el directorio de producción `public/uploads/complaints`.

---

## 🎛️ Despliegue en Producción (PM2 & NGINX)

Para entornos productivos, una vez que la carpeta `.output/` ha sido generada en el servidor mediante el build, el ciclo de vida del proceso se gestiona mediante PM2:

```bash
pm2 start ecosystem.config.jsx --env production
pm2 save

```

**Configuración del Servidor Web:**
NGINX se utiliza en el entorno de producción como servidor principal y proxy inverso. Escucha las peticiones en los puertos estándar `80` (HTTP) y `443` (HTTPS para el dominio configurado `arigumi.pe`), redireccionando el flujo interno hacia el puerto `3000` donde corre la aplicación de Nuxt 3.

---

## 🛠️ Solución de Problemas Comunes

### Las migraciones no se aplican correctamente

* Verifica que el archivo `.env` contenga el string de conexión o los parámetros de credenciales de MySQL correctos.
* Limpia la cola de migraciones y regenera los archivos locales ejecutando `npm run db:generate`.
* Impacta nuevamente la base de datos con `npm run db:migrate`.

### Error en la conexión a la base de datos de MySQL

* Confirma que el servicio de MySQL 8+ se encuentre activo y corriendo en el servidor.
* Valida la conectividad de red y los puertos utilizando el comando de testeo rápido:

```bash
    mysql -u arigumi_user -p arigumi -h 127.0.0.1 -e "SELECT 1"
    ```

### El puerto por defecto 3000 ya se encuentra ocupado
Si necesitas cambiar el puerto en entorno de desarrollo, puedes especificar un puerto alternativo utilizando el flag nativo en el comando de arranque:
```bash
npm run dev -- -p 3001

```

```

```
