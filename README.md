# Destini : A Comprehensive Transportation Solution for Schools and Colleges

A full-stack ride-booking platform for students, colleges, and drivers. Built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Socket.io.

---

## Features

### User Portal

- Book instant or scheduled rides with live map tracking
- View recent and upcoming rides
- Manage saved places and payments
- Responsive, modern UI

### Driver Portal

- Real-time ride requests via Socket.io
- Toggle availability, view ride history, and earnings
- Live status updates and notifications

### College Portal

- Manage students and services
- Access marketing insights and payment management

### Backend

- RESTful API with Express.js
- MongoDB for data storage (users, rides, captains, payments, etc.)
- JWT authentication and secure cookies
- Real-time communication with Socket.io
- CORS and environment variable support

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- MongoDB instance (local or cloud)

### 1. Clone the Repository

```sh
git clone https://github.com/PaulAyushmaan/destini
cd destini
```

### 2. Setup Environment Variables

Create a `.env` file in the root with:

```
VITE_BASE_URL=http://localhost:4000
VITE_MAPTITUDE_API_KEY=your_map_api_key
```

For backend, you may also need:

```
PORT=4000
DB_CONNECT=mongodb://localhost:27017/destini
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### 3. Install Dependencies

#### Frontend

```sh
npm install
```

#### Backend

```sh
cd backend
npm install
```

### 4. Run the App

#### Backend

```sh
cd backend
npm run dev
```

#### Frontend

```sh
cd ..
npm run dev
```

---

## Project Structure

```
destini/
├── backend/           # Express.js API & Socket.io server
│   ├── controllers/   # Route controllers
│   ├── db/            # Database connection
│   ├── middlewares/   # Auth, error handling, etc.
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── app.js         # Express app setup
│   ├── server.js      # Server entry point
│   └── ...
├── public/            # Static assets
├── src/               # Frontend React app
│   ├── components/    # UI components
│   ├── contexts/      # React context providers
│   ├── lib/           # Utilities, socket context
│   ├── pages/         # Route pages (user, driver, college, etc.)
│   ├── styles/        # Tailwind/global CSS
│   └── main.jsx       # App entry point
├── .env               # Environment variables
├── package.json       # Frontend dependencies
└── README.md          # Project documentation
```

---

## Key Scripts

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

### Backend

- `npm run dev` — Start backend with nodemon
- `npm run start` — Start backend (production)

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Leaflet, Socket.io-client, Sonner (toasts)
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, JWT, CORS

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
