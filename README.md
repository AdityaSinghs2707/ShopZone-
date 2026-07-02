# 🛒 ShopZone — Full-Stack E-Commerce App

ShopZone is a full-stack e-commerce web application built from scratch — featuring product browsing, cart & checkout, user authentication, order management, and a fully responsive dark/light themed UI.

🔗 **Live Demo:** [shop-zone-bay-three.vercel.app](https://shop-zone-bay-three.vercel.app)
🔗 **Backend API:** [shopzone-ij7m.onrender.com](https://shopzone-ij7m.onrender.com)

> ⚠️ Note: The backend is hosted on Render's free tier, so the first request after inactivity may take 30–50 seconds to spin up.

---

## ✨ Features

- 🛍️ **Product Catalog** — browse products by category, search, and filter
- 🛒 **Cart & Checkout** — add/remove items, adjust quantities, apply promo codes
- 🔐 **Authentication** — secure signup/login with JWT-based sessions
- 📦 **Order Management** — place orders, view order history
- 💫 **Deals Page** — live countdown timer for limited-time offers
- 🌗 **Dark / Light Mode** — theme toggle with persistent preference
- 📱 **Fully Responsive** — optimized for mobile, tablet, and desktop
- ⭐ **Product Reviews & Ratings**
- 🎁 **Wishlist** functionality

---

## 🧱 Tech Stack

**Frontend**
- HTML5, CSS3 (custom design system with CSS variables)
- Vanilla JavaScript

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 📂 Project Structure

```
ShopZone/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, cart, orders, products)
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js
└── frontend/
    ├── assets/
    ├── css/
    ├── js/
    ├── pages/           # cart, products, deals, account, product-detail
    └── index.html
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo
```bash
git clone https://github.com/AdityaSinghs2707/ShopZone-.git
cd ShopZone-
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

Run the server:
```bash
node server.js
```

### 3. Frontend Setup
Open `frontend/index.html` using **Live Server** (VS Code extension) — do not open it directly via `file://`, as API calls will be blocked by browser security restrictions.

---

## 📸 Screenshots

*(Add screenshots here — homepage, product page, cart, checkout)*

---

## 👤 Author

**Aditya Singh**
[LinkedIn](https://www.linkedin.com/in/aditya-singh-b8b60a3a3/) · [GitHub](https://github.com/AdityaSinghs2707)

---

## 📄 License

This project is open source and available for learning purposes.
