# Guía de Despliegue en Producción (Windows / Otro PC)

Esta guía explica cómo levantar el proyecto **CelParts** en cualquier computadora nueva o servidor de producción sin necesidad de instalar Node.js ni MySQL. Solo necesitas Docker.

## Requisitos Previos
1. Instalar **Docker Desktop** o tener **Docker** instalado en tu servidor.
2. Crear una carpeta vacía y colocar dentro solo estos 2 archivos:
   - `docker-compose-celpartsEF3.prod.yml`
   - `.env` *(Archivo oculto con tus variables de entorno).*

**Estructura OBLIGATORIA de la carpeta:**
El archivo `.env` siempre debe ir "suelto" exactamente en la misma carpeta que el archivo `.yml`.
```text
📂 carpeta-produccion/
 ├── 📄 docker-compose-celpartsEF3.prod.yml   <-- El archivo de despliegue
 └── 📄 .env                      <-- AQUÍ (Justo al lado)
```

---

## Pasos para Encender el Proyecto

### PASO 1: Descargar las Imágenes
Descargamos los dos contenedores que necesita nuestra app desde internet (la base de datos y nuestro frontend/backend compilado).
Abre tu consola (PowerShell o CMD) en la carpeta donde tienes los archivos y ejecuta:

```bash
docker-compose -f docker-compose-celpartsEF3.prod.yml pull
```

### PASO 2: Encender el Proyecto
Una vez descargadas las imágenes, ejecuta el comando mágico final para iniciar el servidor web y la base de datos:

```bash
docker-compose -f docker-compose-celpartsEF3.prod.yml up -d
```
*(El `-d` significa "detached", es decir, se ejecutará en segundo plano y te devolverá el control de la consola).*

### PASO 3: Darles tiempo de respirar
La base de datos MySQL toma un par de segundos en iniciar su volumen interno la primera vez, y luego Nuxt 3 se conecta inmediatamente.
Puedes verificar que ambos estén encendidos con:
```bash
docker ps
```
¡Listo! Ya puedes abrir tu navegador en `http://localhost:3000`.

---

## 🛠️ Comandos de Administración Útiles

Aquí tienes la lista de comandos para controlar tu entorno en producción (asegúrate de estar en la carpeta donde está tu archivo `.yml`):

* **Apagar todo el proyecto:**
  *(Apaga los contenedores sin borrar tu base de datos)*
  ```bash
  docker-compose -f docker-compose-celpartsEF3.prod.yml down
  ```

* **Encender todo el proyecto:**
  *(Si lo apagaste el día anterior y quieres volver a prenderlo)*
  ```bash
  docker-compose -f docker-compose-celpartsEF3.prod.yml up -d
  ```

* **Reiniciar todo el proyecto:**
  *(Útil si quieres recargar el sistema)*
  ```bash
  docker-compose -f docker-compose-celpartsEF3.prod.yml restart
  ```

* **Ver si están encendidos:**
  ```bash
  docker ps
  ```

* **Ver el registro de errores (Logs) de la aplicación:**
  *(Ejemplo para ver por qué falla la web)*
  ```bash
  docker logs celparts-app-prod
  ```

---

## Solución de Problemas (Troubleshooting)

**1. "El contenedor celparts-app-prod se reinicia constantemente"**
* **Por qué pasa:** Tu servidor de Node intentó conectarse a MySQL antes de que MySQL terminara de configurar sus contraseñas iniciales, o las credenciales del `.env` están mal escritas.
* **Solución:** Revisa tu archivo `.env` y asegúrate de que `DB_HOST=mysql` y la contraseña coincidan. Reinicia con `docker-compose -f docker-compose-celpartsEF3.prod.yml restart`.

**2. Error de disco lleno o corrupción de volúmenes**
* **Solución (Reseteo de fábrica):**
  1. Libera espacio en tu disco (Mínimo 5GB).
  2. Ejecuta este comando destructivo para limpiar la basura de Docker:
     `docker system prune -a --volumes`
  3. Vuelve a ejecutar el PASO 1 con calma.
