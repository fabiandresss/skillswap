# SkillSwap – Red de Intercambio de Habilidades 🤝🧠

![Estado del proyecto](https://img.shields.io/badge/Estado-MVP%20en%20desarrollo-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![Hecho con Node.js](https://img.shields.io/badge/backend-Node.js-brightgreen)
![MongoDB](https://img.shields.io/badge/database-MongoDB-informational)

> Una comunidad donde puedes enseñar lo que sabes y aprender lo que te apasiona, sin pagar. Solo conectándote con personas como tú.

---

## 🌟 ¿Qué es SkillSwap?

**SkillSwap** es una red social educativa donde las personas pueden intercambiar habilidades de forma gratuita. No hay monedas virtuales, puntos ni pagos: solo conexión directa y recíproca.

📌 Ejemplo: *“Sé inglés, quiero aprender Photoshop”*  
👉 El sistema te conecta automáticamente con alguien compatible.

---

## 🧩 Características principales

- Registro e inicio de sesión de usuarios
- Perfiles con:
  - Nombre, bio, intereses
  - Qué sabes hacer
  - Qué quieres aprender
- Página de exploración con filtros
- Sugerencias automáticas por afinidad (match)
- Chat interno privado y seguro
- Sistema de reportes y bloqueo de usuarios
- Notificaciones visuales de nuevos mensajes

---

## 🛠️ Tecnologías usadas

| Parte         | Tecnología               |
|--------------|--------------------------|
| Frontend     | HTML, CSS, Bootstrap     |
| Backend      | Node.js, Express         |
| Base de datos| MongoDB Atlas            |
| Autenticación| Email + password (básico)|
| Renderizado  | HTML/API                 |

---

## 🚀 Instalación local

```bash
git clone https://github.com/tuusuario/skillswap.git
cd skillswap
npm install
npm run dev
```

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```ini
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/skillswap
PORT=3000
```

Luego abre tu navegador en:  
👉 `http://localhost:3000`

---

