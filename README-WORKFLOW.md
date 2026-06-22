# Ciclo de Vida del Desarrollo (Flujo de Trabajo CelParts)

Este documento detalla el ciclo completo de vida del software para el proyecto **CelParts**. Explica paso a paso cómo se pasa desde escribir código en tu máquina local, hasta actualizar la aplicación web en el servidor de producción.

---

## 🐣 Fase 0: Onboarding (Nuevo Desarrollador)
Si acabas de unirte al equipo o estás configurando una computadora nueva, este es el primer paso que debes hacer para tener todo el código fuente y levantar la aplicación en tu entorno local.

1. **Crear una carpeta maestra:** Crea una carpeta en tu computadora y abre una consola ahí.
2. **Clonar el repositorio:** Descarga el código fuente ejecutando:
   ```bash
   git clone https://github.com/ganbot43/CelParts.git
   ```
3. **Instalar dependencias y encender el proyecto local:**
   - Para programar, solo necesitas instalar los paquetes de Node y correr el proyecto en modo desarrollo.
   ```bash
   cd CelParts
   npm install --legacy-peer-deps
   npm run dev
   ```

**Estructura OBLIGATORIA de la carpeta maestra:**
Asegúrate de copiar el archivo de entorno y rellenar las variables.
```text
📂 CelParts/
 ├── 📂 components/
 ├── 📂 server/
 ├── 📄 docker-compose-celpartsEF3.yml
 └── 📄 .env                      <-- Renombrar de .env.example a .env
```

---

## 💻 Fase 1: Desarrollo Local (En tu computadora)
Esta es la fase donde "te ensucias las manos" escribiendo código. 

### Opción A: Desarrollar con Docker (Local)
1. **Encender la infraestructura:** Si no tienes MySQL instalado en tu PC, puedes usar Docker para levantarlo.
   ```bash
   docker-compose -f docker-compose-celpartsEF3.yml up -d mysql
   ```
2. **Programar:** Usa `npm run dev` para levantar el frontend y backend juntos con Hot-Reload en Nuxt 3.

### Opción B: Probar el build de producción en Local
Si quieres comprobar que todo funciona exactamente igual que en el servidor de producción:
```bash
docker-compose -f docker-compose-celpartsEF3.yml build
docker-compose -f docker-compose-celpartsEF3.yml up -d
```
Esto creará el contenedor final de CelParts y lo conectará a la base de datos de Docker.

### 3. Guardar en la Nube (Control de Versiones):
   - Cuando terminas una funcionalidad, guardas tus cambios en GitHub.
   - Usas los comandos `git add .`, `git commit -m "Mi cambio"`, y `git push`.
   - **Nota:** Al hacer `git push`, nuestro pipeline en GitHub Actions compilará automáticamente el proyecto y lo enviará a Docker Hub bajo el nombre de `ganbito/celparts-ef3:latest`.

---

## 📦 Fase 2: Empaquetado Automático (CI/CD)
El empaquetado ahora se realiza de forma **automática** gracias a las GitHub Actions (CI/CD). 

1. **Push:** Cuando envías tu código a la rama principal (`celparts-main`), los servidores de GitHub descargan el código.
2. **Build:** Construyen la imagen Docker usando el `Dockerfile` del proyecto.
3. **Publish:** Suben la nueva imagen a Docker Hub (`ganbito/celparts-ef3:latest`) usando los secretos guardados en tu repositorio.

---

## 🚀 Fase 3: Despliegue en Producción (En el Servidor)
Esta fase ocurre **fuera de tu entorno de desarrollo local**. Se realiza en la computadora de producción (Servidor Cloud o PC designada) usando **exclusivamente** el archivo `docker-compose-celpartsEF3.prod.yml` y tu archivo `.env`.

Aquí **NO** hay código fuente (ni componentes de Vue, ni servidor de Nuxt). Solo están esos dos archivos.

1. **Descargar la nueva actualización:**
   - Le dices a tu servidor que busque en internet si hay versiones más nuevas generadas por tu Github Actions en Docker Hub.
   ```bash
   docker-compose -f docker-compose-celpartsEF3.prod.yml pull
   ```
2. **Aplicar la actualización (El Reinicio Mágico):**
   - Ejecutas el comando de encendido. Docker detectará que hay una imagen nueva de `celparts-ef3`.
   ```bash
   docker-compose -f docker-compose-celpartsEF3.prod.yml up -d
   ```
   - Docker apagará suavemente el contenedor web viejo, lo eliminará e iniciará uno nuevo con tu código actualizado, dejando la base de datos intacta.

---

## 🗄️ Administración de la Base de Datos en Producción
La base de datos en producción está segura dentro del contenedor de `mysql` protegido por Docker (mediante el volumen persistente `mysql-celpartsEF3`).

* **Para revisar tablas o hacer consultas SQL remotas:**
  1. Abre tu gestor favorito (DBeaver, MySQL Workbench, DataGrip).
  2. Conéctate a: `Host: localhost` (o la IP de tu VPS) | `Port: 3307`.
  3. Usa el usuario `root` y la contraseña que definiste en el archivo `.env`.
