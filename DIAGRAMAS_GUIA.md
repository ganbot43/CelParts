# Guía para Creación de Diagramas (CelParts)

Este documento contiene toda la información técnica y de negocio estructurada para que puedas elaborar los diagramas (Casos de uso, Entidad-Relación, Clases y Arquitectura) en **Lucidchart** u otra herramienta.

---

## 1. Arquitectura del Sistema (Diagrama de Arquitectura / N-Capas)
El proyecto está estructurado en una arquitectura moderna basada en el framework Nuxt 3.
- **Capa de Presentación (Frontend):** Construida con Vue 3, Nuxt 3 y Tailwind CSS. Gestiona la Landing Page, el Catálogo (Ecommerce) y el Panel de Administración.
- **Capa de Lógica de Negocio (Backend):** Desarrollada con Node.js y TypeScript (integrada mediante Nitro en Nuxt). Expone una API REST para procesar pedidos, enviar correos (SMTP), manejar integración con S3 (imágenes) e invocar a Watson Assistant.
- **Capa de Datos (Persistencia):** Base de datos relacional **MySQL** operada a través de **Drizzle ORM**.

---

## 2. Roles y Actores (Diagrama de Casos de Uso)

Tenemos principalmente **3 actores**:

1. **Cliente (Usuario Final / Invitado):**
   - Ver catálogo de productos (filtrado por categorías y marcas).
   - Agregar productos al carrito de compras.
   - Realizar el proceso de compra (Checkout) adjuntando un voucher de pago.
   - Interactuar con el Chatbot (Watson Assistant).
   - Registrar una queja en el Libro de Reclamaciones.

2. **Administrador (Admin):**
   - Autenticarse en el sistema.
   - Gestionar el inventario (CRUD de productos, categorías, imágenes).
   - Revisar movimientos de stock.
   - Gestionar pedidos (Cambiar estado: Pendiente, Pagado, Enviado, etc.) y agregar notas.
   - Generar reportes estadísticos exportables (PDF, Excel).
   - Configurar la plataforma (métodos de pago, datos de contacto, activar módulos).

3. **Sistema / Agentes Externos:**
   - **Módulo de Correos (SMTP):** Envía notificaciones de cambio de estado a los clientes.
   - **AWS S3:** Almacena imágenes subidas.
   - **Watson Assistant:** Responde dudas 24/7.

---

## 3. Diccionario de Base de Datos (Diagrama Entidad-Relación / Clases)

El sistema cuenta con 13 tablas en MySQL. Aquí tienes las entidades y sus atributos principales para armar el diagrama (ERD):

### Usuarios y Configuración
* **`users`**
  - `id` (PK)
  - `email` (Unique)
  - `password` (Hashed)
  - `name`, `role` (admin, superadmin, customer)
* **`business_config`**
  - `id` (PK)
  - `name`, `ruc`, `email`, `logo_url`, `whatsapp`, `address`
  - flags booleanos: `stock_enabled`, `auto_payment_enabled`, etc.

### Catálogo e Inventario
* **`categories`**
  - `id` (PK)
  - `name`, `slug`, `image_url`
* **`subcategories`**
  - `id` (PK)
  - `category_id` (FK -> categories.id)
  - `name`, `slug`
* **`products`**
  - `id` (PK)
  - `category_id` (FK -> categories.id)
  - `subcategory_id` (FK -> subcategories.id)
  - `name`, `slug`, `description`, `price`
  - `stock`, `track_stock`, `is_active`
* **`product_images`**
  - `id` (PK)
  - `product_id` (FK -> products.id)
  - `url`
* **`inventory_movements`**
  - `id` (PK)
  - `product_id` (FK -> products.id)
  - `movement_type` (entry, exit, adjustment)
  - `quantity`, `reason`

### Ventas y Pedidos
* **`payment_methods`**
  - `id` (PK)
  - `type` (Yape, Transferencia, etc.)
  - `account_number`, `account_name`, `qr_url`
* **`orders`**
  - `id` (PK)
  - `user_id` (FK -> users.id, nullable)
  - `order_code` (Unique)
  - `payment_method_id` (FK -> payment_methods.id)
  - `customer_name`, `customer_phone`, `customer_address`
  - `subtotal`, `total`, `voucher_url`
  - `status` (pending, paid, shipped, completed, etc.)
* **`order_items`**
  - `id` (PK)
  - `order_id` (FK -> orders.id)
  - `product_id` (FK -> products.id)
  - `product_name`, `unit_price`, `quantity`, `subtotal`
* **`order_status_logs`**
  - `id` (PK)
  - `order_id` (FK -> orders.id)
  - `status`, `note`

### Otros Módulos
* **`banners`**
  - `id` (PK)
  - `image_url`, `link_url`, `is_active`
* **`complaints`** (Libro de reclamaciones)
  - `id` (PK), `codigo`
  - `customer_name`, `numero_documento`, `telefono`, `email`
  - `tipo_bien`, `descripcion_bien`
  - `tipo_reclamo`, `descripcion`
  - `estado`, `respuesta`

---

## 4. Flujos Principales (Para Diagramas de Secuencia o Actividad)

**Flujo de Compra (Checkout):**
1. El Cliente envía el pedido (productos, datos, voucher).
2. El Backend valida stock (Drizzle/MySQL).
3. El Backend crea el registro en `orders` y `order_items`.
4. El Backend registra salida en `inventory_movements` (si el stock está activado).
5. El Backend envía correo de confirmación (vía SMTP/Nodemailer).
6. Retorna confirmación al Cliente.

**Flujo de Cambio de Estado:**
1. El Admin actualiza el estado de un pedido (ej. a "Enviado") y añade una nota.
2. El Backend registra el cambio en `order_status_logs`.
3. El Backend envía correo automático al cliente notificando el nuevo estado.

---
*Nota para tu compañero: Puedes usar esta estructura para crear el diagrama de Base de Datos relacional uniendo las Primary Keys (PK) con las Foreign Keys (FK). Para los Casos de Uso, guíate explícitamente del bloque de "Roles y Actores".*
