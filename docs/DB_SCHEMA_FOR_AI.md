# Esquema de Base de Datos — Formato amigable para IA

Este documento describe el esquema actual de la base de datos (MySQL) usado por el proyecto, en un formato estructurado y fácil de procesar por modelos de lenguaje o herramientas de análisis.

Formato por tabla:
- Nombre de la tabla
- Propósito
- Columnas: `nombre` — tipo — `NULL/NOT NULL` — `default` — notas
- Clave primaria (PK)
- Claves foráneas (FK)
- Índices importantes
- Relaciones (cardinalidad)
- Ejemplo (registro JSON)

---

## business_config
Propósito: Configuración global de negocio (una sola fila esperada).
Columnas:
- `id` — INT AUTO_INCREMENT — NOT NULL — PK
- `name` — TEXT — NOT NULL
- `logo_url` — TEXT — NULL
- `whatsapp` — TEXT — NOT NULL
- `address` — TEXT — NULL
- `plan` — TEXT (enum: `basic`,`intermediate`,`advanced`) — NOT NULL — DEFAULT `basic`
- `social_links` — TEXT (JSON serializado) — NULL — formato JSON
- `stock_enabled` — INT(0/1) — NOT NULL — DEFAULT 0
- `auto_payment_enabled` — INT(0/1) — NOT NULL — DEFAULT 0
- `coupons_enabled` — INT(0/1) — NOT NULL — DEFAULT 0
- `multiuser_enabled` — INT(0/1) — NOT NULL — DEFAULT 0
- `updated_at` — TEXT (timestamp) — DEFAULT CURRENT_TIMESTAMP
PK: `id`
FK: ninguno
Índices: ninguno especial
Relaciones: 1 fila única; referenciado lógicamente por la app, no por FK.
Ejemplo:
{
  "id": 1,
  "name": "Joymar Utensilios",
  "whatsapp": "+51996111303",
  "plan": "basic",
  "social_links": "{\"facebook\":\"url\"}",
  "stock_enabled": 1
}

---

## users
Propósito: Usuarios administrativos del panel.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `name` — TEXT — NOT NULL
- `email` — TEXT — NOT NULL — UNIQUE
- `password_hash` — TEXT — NOT NULL
- `role` — TEXT (enum: `superadmin`,`admin`) — NOT NULL — DEFAULT `admin`
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1
- `created_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
PK: `id`
Índices: `email` (UNIQUE)
Relaciones: puede relacionar cambios de estado de pedidos (order_status_logs.changed_by).
Ejemplo: {"id":2,"name":"Admin","email":"joymar.peru@gmail.com","role":"admin"}

---

## categories
Propósito: Categorías de productos.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `name` — TEXT — NOT NULL
- `slug` — TEXT — NOT NULL — UNIQUE
- `sort_order` — INT — NOT NULL — DEFAULT 0
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1
- `created_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
Relaciones: 1:N → `subcategories`, 1:N → `products`
Ejemplo: {"id":1,"name":"Cocina","slug":"cocina"}

---

## subcategories
Propósito: Subcategorías vinculadas a `categories`.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `category_id` — INT — NOT NULL — FK -> `categories.id` ON DELETE CASCADE
- `name` — TEXT — NOT NULL
- `slug` — TEXT — NOT NULL — UNIQUE
- `sort_order` — INT — NOT NULL — DEFAULT 0
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1
Relaciones: N:1 → `categories`, 1:N → `products`
Ejemplo: {"id":3,"category_id":1,"name":"Sartenes","slug":"sartenes"}

---

## products
Propósito: Productos del catálogo.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `category_id` — INT — FK -> `categories.id` ON DELETE SET NULL
- `subcategory_id` — INT — FK -> `subcategories.id` ON DELETE SET NULL
- `name` — TEXT — NOT NULL
- `slug` — TEXT — NOT NULL — UNIQUE
- `description` — TEXT — NULL
- `price` — DOUBLE — NOT NULL
- `stock` — INT — NOT NULL — DEFAULT 0
- `track_stock` — INT(0/1) — NOT NULL — DEFAULT 0
- `is_featured` — INT(0/1) — NOT NULL — DEFAULT 0
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1
- `created_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
- `updated_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
Relaciones: N:1 → `categories`, N:1 → `subcategories`, 1:N → `product_images`, 1:N → `order_items`
Ejemplo: {"id":10,"name":"Olla 24cm","price":59.9,"stock":12}

---

## product_images
Propósito: URLs de imágenes asociadas a productos.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `product_id` — INT — NOT NULL — FK -> `products.id` ON DELETE CASCADE
- `url` — TEXT — NOT NULL
- `sort_order` — INT — NOT NULL — DEFAULT 0
- `is_primary` — INT(0/1) — NOT NULL — DEFAULT 0
Relaciones: N:1 → `products`
Ejemplo: {"id":5,"product_id":10,"url":"/images/olla.jpg","is_primary":1}

---

## payment_methods
Propósito: Métodos de pago configurables (Yape, Plin, transferencias, etc.).
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `type` — TEXT (enum: `yape`,`plin`,`bank_transfer`,`culqi`,`mercado_pago`) — NOT NULL
- `label` — TEXT — NOT NULL
- `qr_url` — TEXT — NULL
- `account_number` — TEXT — NULL
- `account_name` — TEXT — NULL
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1
- `sort_order` — INT — NOT NULL — DEFAULT 0
Relaciones: 1:N → `orders` (via `payment_method_id`)
Ejemplo: {"id":1,"type":"yape","label":"Yape - Empresa"}

---

## orders
Propósito: Pedidos realizados por clientes.
Columnas (resumen):
- `id` — INT AUTO_INCREMENT — PK
- `order_code` — TEXT — NOT NULL — UNIQUE
- `payment_method_id` — INT — FK -> `payment_methods.id` ON DELETE SET NULL
- `paymentMethodType`, `paymentMethodLabel`, ... — TEXT — snapshots del método de pago
- `customerName`, `customerPhone`, `customerAddress`, `customerReference`, `customerNotes` — TEXT — datos del cliente
- `subtotal` — DOUBLE — NOT NULL
- `total` — DOUBLE — NOT NULL
- `voucher_url` — TEXT — NULL
- `status` — TEXT (enum: `pending`,`voucher_sent`,`payment_validated`,`in_preparation`,`delivered`,`cancelled`) — NOT NULL — DEFAULT `pending`
- `created_at`, `updated_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
Relaciones: 1:N → `order_items`, 1:N → `order_status_logs`, N:1 → `payment_methods`
Ejemplo: {"id":100,"order_code":"JY-0001","total":123.5,"status":"pending"}

---

## order_items
Propósito: Items de cada pedido (snapshot del producto al momento del pedido).
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `order_id` — INT — NOT NULL — FK -> `orders.id` ON DELETE CASCADE
- `product_id` — INT — FK -> `products.id` ON DELETE SET NULL
- `product_name` — TEXT — NOT NULL (snapshot)
- `unit_price` — DOUBLE — NOT NULL (snapshot)
- `quantity` — INT — NOT NULL
- `subtotal` — DOUBLE — NOT NULL
Relaciones: N:1 → `orders`, N:1 → `products`
Ejemplo: {"order_id":100,"product_name":"Olla 24cm","unit_price":59.9,"quantity":2}

---

## order_status_logs
Propósito: Historial de cambios de estado de pedidos.
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `order_id` — INT — NOT NULL — FK -> `orders.id` ON DELETE CASCADE
- `status` — TEXT (same enum que `orders.status`) — NOT NULL
- `changed_by` — INT — FK -> `users.id` ON DELETE SET NULL
- `note` — TEXT — NULL
- `created_at` — TEXT — DEFAULT CURRENT_TIMESTAMP
Relaciones: N:1 → `orders`, N:1 → `users` (quien cambió estado)

---

## banners
Propósito: Banners para el front (hero/carousel).
Columnas:
- `id` — INT AUTO_INCREMENT — PK
- `image_url` — TEXT — NOT NULL
- `link_url` — TEXT — NULL
- `sort_order` — INT — NOT NULL — DEFAULT 0
- `is_active` — INT(0/1) — NOT NULL — DEFAULT 1

---

## complaints (libro de reclamaciones)
Propósito: Registro de reclamos/quejas de clientes.
Columnas (resumen):
- `id` — INT AUTO_INCREMENT — PK
- `codigo` — TEXT — NOT NULL — DEFAULT ''
- Datos del cliente: `customer_name`, `tipo_documento`, `numero_documento`, `direccion`, `telefono`, `email`
- Detalle del bien: `tipo_bien`, `descripcion_bien`, `monto`
- Detalle del reclamo: `tipo_reclamo`, `descripcion`, `pedido`
- Sistema: `estado` (enum: `pendiente`,`en_proceso`,`respondido`,`cerrado`) — DEFAULT `pendiente`
- `respuesta`, `fecha_respuesta`, `archivo_url`, `created_at`

---

## Relaciones generales (resumen)
- `categories` 1:N `subcategories`
- `categories` 1:N `products`
- `subcategories` 1:N `products`
- `products` 1:N `product_images`
- `products` 1:N `order_items`
- `orders` 1:N `order_items`
- `orders` 1:N `order_status_logs`
- `payment_methods` 1:N `orders`

---

## Índices y unicidades importantes
- `users.email` — UNIQUE
- `categories.slug`, `subcategories.slug`, `products.slug`, `orders.order_code` — UNIQUE

---

## Notas técnicas útiles para IA / integraciones
- Tipos en Drizzle: `int()` → INT, `double()` → DOUBLE, `text()` → TEXT; las definiciones actuales usan `mysql-core`.
- Timestamps: las columnas usan `TEXT` con `DEFAULT CURRENT_TIMESTAMP` en el esquema actual; considerar migrar a `TIMESTAMP` si se necesita funciones temporales nativas.
- Booleans: representados como `INT` (0/1).
- Relaciones: muchas FK usan `ON DELETE CASCADE` o `ON DELETE SET NULL` según la lógica de borrado.

---

## Ejemplo de SQL simplificado (MySQL) para `products` (referencia)
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NULL,
  subcategory_id INT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DOUBLE NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  track_stock INT NOT NULL DEFAULT 0,
  is_featured INT NOT NULL DEFAULT 0,
  is_active INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Pasos recomendados para migraciones / verificación
1. Exportar datos de SQLite si existe y mapear tipos a MySQL (dobles, ints, texto). Preservar `slug` y `order_code`.
2. Crear la base en MySQL y configurar variables de entorno: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
3. Ejecutar las migraciones de `drizzle-kit` con `drizzle.config.ts` configurado a `dialect: 'mysql'`.
4. Ejecutar `npm run db:seed` (o script equivalente) para insertar datos iniciales.
5. Probar endpoints y flujos de checkout, revisar `order.status` y `order_status_logs`.

---

## Artefactos útiles para IA
- Representación JSON de la estructura (tabla → columnas) facilita el análisis automático.
- Si deseas, puedo exportar este esquema como JSON o generar un diagrama ERD en texto o mermaid para uso automático.

---

Archivo generado automáticamente para uso interno y por agentes de IA. Si quieres que incluya variantes con tipos `TIMESTAMP`, o que exporte a `schema.json` o `mermaid`, dime cuál y lo genero.
