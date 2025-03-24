# 🧩 Pixel Place – Real-Time Collaborative Pixel Canvas

Live Demo 👉 [r-place-murex.vercel.app](https://r-place-murex.vercel.app/)

A multiplayer pixel-art canvas inspired by Reddit’s r/Place, where users draw together in real-time. Built with **Next.js**, **Supabase**, **WebSockets**, and **Tailwind CSS**.

---

## 🚀 Features

- 🎨 **Collaborative Canvas** – Live multiplayer pixel art using WebSocket server
- 🕒 **Cooldown Timer** – Prevents spamming pixels with animated visual feedback
- 🧠 **Optimized UX** – Tooltip on hover, color picker, toast notifications
- 🔐 **Google Auth** – Users must sign in with Google to place pixels
- 💾 **Database Persistence** – Pixels and user data stored in Supabase (PostgreSQL)
- 📡 **Real-Time WebSockets** – Node.js server deployed on Heroku
- 🧪 **Typed & Scalable** – TypeScript + Prisma ORM

---

## 🧰 Tech Stack

| Layer        | Tech                                                                  |
|--------------|-----------------------------------------------------------------------|
| Frontend     | **Next.js (App Router)** + **React** + **Tailwind CSS** + **TypeScript** |
| Auth & DB    | **Supabase** (PostgreSQL, Auth) + **Prisma ORM**                      |
| Real-Time    | **WebSocket Server** (`ws` library, Node.js) hosted on **Heroku**     |
| UX Enhancers | ShadCN/UI (Toasts), debounced hover, hover cards, cooldown display    |

---

## 🖼️ Demo

> [🎯 Try the Live Version](https://r-place-murex.vercel.app)

*(Add a screenshot or screen recording here for extra impact!)*

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/pixel-place.git

# 2. Install dependencies
cd pixel-place
npm install

# 3. Add environment variables
touch .env.local
