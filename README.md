# Proyecto de Estacionamiento

Este repositorio contiene un **Dashboard de Estacionamiento** construido con **React** en el frontend y un **backend** en Node.js/Express que se conecta a una base de datos **MySQL** local.

---

## 🛠️ Prerrequisitos

Antes de comenzar, asegúrate de tener instalados en tu máquina:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) (localmente)

---

## 📁 Estructura del Proyecto

```
root/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

- **backend/**: API REST con Express y conexión a MySQL.
- **frontend/**: Aplicación React con rutas y el componente `Dashboard`.

---

## ⚙️ Configuración del Backend

1. Abre una terminal y navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Copia el archivo de ejemplo de variables de entorno y edítalo:
   ```bash
   cp .env
   ```

3. Abre `.env` y configura tus credenciales de MySQL locales:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_de_la_base
   JWT_SECRET=tu_secreto
   PORT=5000
   ```

4. Instala las dependencias y levanta la API:
   ```bash
   npm install
   npm run dev    # o yarn dev
   ```

5. Importa la base de datos adjunta con el nombre correspondiente:
   ```bash
   mysql -u tu_usuario -p estacionamiento < ../estacionamiento.sql
   ```

6. Verifica que la API esté corriendo en http://localhost:5000 (o el puerto que hayas configurado).

---

## ⚛️ Configuración del Frontend

1. En otra terminal, navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación React:
   ```bash
   npm start
   ```

4. Abre tu navegador en http://localhost:3000 para ver el Dashboard.

---

## 📝 Scripts Útiles

- **En backend**:
  - `npm run dev` — Levanta la API en modo desarrollo.
  - `npm start` — Inicia la API en modo producción.

- **En frontend**:
  - `npm start` — Inicia el servidor de desarrollo de React.
  - `npm run build` — Genera la versión optimizada para producción.


