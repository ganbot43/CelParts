# 🧶 Arigumi — Plataforma de Ecommerce Comunitario C2C

Plataforma web full-stack con Server-Side Rendering (SSR) desarrollada con **Nuxt 3** para **Arigumi**. El proyecto está diseñado específicamente para conectar a artesanos adultos mayores en el Perú con compradores que valoran los tejidos y productos de crochet hechos a mano.

A diferencia de un ecommerce tradicional, Arigumi implementa un **modelo híbrido colaborativo y circular (Client-to-Client)** donde los hilos de comunicación se cierran directamente vía WhatsApp sin intermediarios, respaldado por un potente panel administrativo para la moderación del mercado y el cumplimiento de la normativa legal peruana.

---

## 🎨 Sistema de Diseño Visual (Paleta Artesanal)

La interfaz abandona las paletas corporativas frías para adoptar una estética orgánica, cálida y de alta accesibilidad para adultos mayores. Los estilos globales están centralizados en `assets/css/main.css` bajo las especificaciones de **Tailwind CSS v4**:

| Token | Hex | Uso |
|-------|-----|-----|
| **Sage** | `#7d8e74` / `#6e7e65` | Color de marca y acciones afirmativas (ej: *Publicar un tapete*, *Ingresar*) |
| **Earth** | `#584636` / `#9c8468` | Tipografía de encabezados premium y botones de edición secundaria |
| **Cream Base** | `#faf8f5` / `#f7f5f0` | Fondo general estilo hueso/crema con textura de cuadrícula de 24×24 px |

**Tipografía híbrida:** *Playfair Display* (serif elegante para slogans) + *Inter* (sans-serif de alto contraste para inputs y textos de lectura).

---

## 👥 Arquitectura de Roles y Modelo C2C

El esquema rompe el flujo lineal tradicional con un campo `mysqlEnum` en la tabla `users`:

| Rol | Descripción |
|-----|-------------|
| `comprador` | Explora el catálogo, guarda favoritos y contacta al artesano directamente vía WhatsApp |
| `vendedor` | Adulto mayor con acceso exclusivo a **"Mi Panel de Tejedor"** para gestionar su catálogo |
| `vendedor_comprador` | Rol estrella: comercializa sus piezas y adquiere tejidos de otros miembros en la misma cuenta |
| `admin` / `superadmin` | Modera publicaciones, administra `business_config`, banners y el Libro de Reclamaciones |

---

## 🛠️ Tecnologías Core

| Capa | Tecnología |
|------|------------|
| Framework | Nuxt 3 (Vue 3, TypeScript, Pinia) — renderizado híbrido/SSR |
| Estilos & UI | Tailwind CSS v4, Nuxt UI, Nuxt Image, Nuxt Icon |
| Autenticación | `nuxt-auth-utils` — sesiones cifradas |
| Base de datos | MySQL 8+ · Drizzle ORM · Drizzle Kit |
| Storage | AWS S3 SDK (`@aws-sdk/client-s3`) |
| Seguridad | `bcryptjs` · `zod` · Google reCAPTCHA |
| Infraestructura | NGINX (proxy inverso) · PM2 · Node.js 20 |

---

## 🗄️ Esquema de Base de Datos (12 tablas)

| Tabla | Descripción |
|-------|-------------|
| `business_config` | Configuración general: logo, WhatsApp, dirección y flags del sistema |
| `users` | Usuarios con roles diferenciados (`comprador` → `superadmin`) |
| `categories` | Categorías principales del catálogo artesanal |
| `subcategories` | Subcategorías vinculadas a una categoría |
| `products` | Obras artesanales — incluye `material`, `price` (S/.), dimensiones (`sizeLength`, `sizeWidth`, `sizeUnit`) y flag `offersPattern` |
| `product_images` | Imágenes alojadas en S3 |
| `payment_methods` | Yape, Plin, transferencia bancaria, etc. |
| `orders` | Pedidos realizados por clientes |
| `order_items` | Detalle de productos dentro de cada pedido |
| `order_status_logs` | Historial de cambios de estado |
| `banners` | Banners promocionales administrados por el dueño del sistema |
| `complaints` | Libro de Reclamaciones digital (obligatorio por ley peruana) |

---

## 🚀 Instalación

### Requisitos previos

- Node.js 20 (`nvm use 20 && node -v`)
- npm
- MySQL 8.0+ configurado localmente
- *(Opcional)* Git Bash o WSL en Windows para ejecutar `reset-db.sh`

### Pasos de configuración

**1. Clonar el proyecto e instalar dependencias:**

```bash
npm install
```
