# 🎓 Upskeel LMS Frontend

This is the **Upskeel LMS Frontend**, built using **React + TypeScript + Vite** and styled with **TailwindCSS**.

It communicates with the Upskeel .NET backend and provides role-based UI for Students, Instructors, and Admins.

## 🌐 Live App
👉 https://upskeel.vercel.app/login

## 🚀 Features
- Authentication + JWT handling
- Student course browsing & enrollment
- Instructor request workflow
- Admin dashboards
- Instructor approvals & user management
- Custom LMS dashboard UI with cards and role‑based menus

## 🛠️ Tech Stack
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router v6
- Lucide Icons

## ⚙️ Setup
Create `.env`:
```
VITE_API_BASE_URL=https://upskeel.up.railway.app/api
```

Install:
```
npm install
```

Run:
```
npm run dev
```

## 🔐 Auth
Frontend decodes JWT roles:
- **Student**
- **Instructor**
- **Admin**

Used for conditional routing & UI display.

## 👨‍💻 Author
**Chuma**
