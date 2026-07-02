# ShopZone Backend API 🛒

Full REST API for ShopZone e-commerce — Node.js + Express + MongoDB (MERN)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Hosting:** Vercel (backend) + MongoDB Atlas (DB)

---

## Project Structure

```
shopzone-backend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, Login, Profile
│   ├── productController.js# CRUD + Filter + Review
│   ├── cartController.js   # Cart operations
│   └── orderController.js  # Place & track orders
├── middleware/
│   └── auth.js             # JWT protect + adminOnly
├── models/
│   ├── User.js             # User schema
│   ├── Product.js          # Product schema
│   ├── Cart.js             # Cart schema
│   └── Order.js            # Order schema
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── server.js               # Entry point
├── seed.js                 # Seed DB with sample data
├── vercel.json             # Vercel deploy config
├── .env.example            # Environment template
└── .gitignore
```

---

## Setup — Local Development

### 1. Clone & Install
```bash
git clone https://github.com/AdityaSinghs2707/ShopZone-backend.git
cd shopzone-backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/shopzone
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://127.0.0.1:5500
```

### 3. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster → **Create Database** → name it `shopzone`
3. **Database Access** → Add user (username + password)
4. **Network Access** → Add IP → `0.0.0.0/0` (allow all, for Vercel)
5. **Connect** → Drivers → Copy connection string → paste in `.env`

### 4. Seed the Database
```bash
node seed.js
```
This creates 10 products + admin account (`admin@shopzone.com` / `admin123`)

### 5. Run Server
```bash
npm run dev    # development (nodemon)
npm start      # production
```
Server runs at `http://localhost:5000`

---

## API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login → get token |
| GET | `/me` | ✅ | Get my profile |
| PUT | `/update-profile` | ✅ | Update name/address |
| PUT | `/change-password` | ✅ | Change password |

**Register body:**
```json
{ "name": "Aditya", "email": "adi@gmail.com", "password": "pass123" }
```
**Login response:**
```json
{ "success": true, "token": "eyJ...", "user": { "_id": "...", "name": "Aditya", "role": "user" } }
```

---

### 📦 Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all products |
| GET | `/?category=electronics` | ❌ | Filter by category |
| GET | `/?search=headphones` | ❌ | Search products |
| GET | `/?sort=price-asc` | ❌ | Sort: price-asc, price-desc, rating-desc, newest |
| GET | `/?featured=true` | ❌ | Featured products |
| GET | `/?page=1&limit=12` | ❌ | Pagination |
| GET | `/:id` | ❌ | Single product |
| POST | `/` | 🔑 Admin | Create product |
| PUT | `/:id` | 🔑 Admin | Update product |
| DELETE | `/:id` | 🔑 Admin | Delete product |
| POST | `/:id/review` | ✅ | Add review |

---

### 🛒 Cart — `/api/cart`  *(All routes require login)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get my cart |
| POST | `/add` | Add item `{ productId, qty }` |
| PUT | `/update` | Update qty `{ productId, qty }` |
| DELETE | `/remove/:productId` | Remove item |
| DELETE | `/clear` | Clear entire cart |

---

### 📋 Orders — `/api/orders`  *(All routes require login)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Place order (clears cart) |
| GET | `/my` | ✅ | My orders |
| GET | `/:id` | ✅ | Order detail |
| GET | `/` | 🔑 Admin | All orders + revenue |
| PUT | `/:id/status` | 🔑 Admin | Update order status |

**Place Order body:**
```json
{
  "shippingAddress": {
    "name": "Aditya Singh",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Haldwani",
    "pincode": "263139"
  },
  "paymentMethod": "COD",
  "promoCode": "SHOP10"
}
```

**Promo codes:** `SHOP10` (₹500 off) · `SAVE200` (₹200 off)

---

## Deployment — Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: ShopZone backend complete"
git remote add origin https://github.com/AdityaSinghs2707/shopzone-backend.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. **Environment Variables** (add these in Vercel dashboard):
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
   - `JWT_EXPIRE` = 7d
   - `CLIENT_URL` = your frontend URL (GitHub Pages URL)
3. Deploy! Your API will be at `https://shopzone-backend.vercel.app`

---

## Connecting Frontend to Backend

In your frontend `main.js`, add this at the top:
```javascript
const API_URL = 'https://shopzone-backend.vercel.app/api';
// For local dev: 'http://localhost:5000/api'

// Save token after login
localStorage.setItem('sz_token', token);

// Use in API calls
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('sz_token')}`
};

// Example: Add to cart via API
async function addToCartAPI(productId, qty = 1) {
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ productId, qty })
  });
  return res.json();
}
```

---

## Order Status Flow
```
processing → confirmed → shipped → delivered
                ↓
            cancelled
```

Made with ❤️ by Aditya Singh | MainCrafts Technology Internship
