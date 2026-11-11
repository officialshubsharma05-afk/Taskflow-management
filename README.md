# TaskFlow - MERN Stack Task Management System

TaskFlow is a modern, responsive, full-stack task management application built with the MERN stack (MongoDB, Express, React 19, and Node.js) and powered by Vite, Lucide React icons, and modern CSS.

---

## Features

- **Authentication & Security:**
  - Secure user registration and login with bcryptjs password hashing.
  - Stateless JSON Web Token (JWT) authentication.
  - Automatic Authorization header injection via Axios interceptors.
  - Auto-logout on 401 unauthorized / expired tokens.
  - Strict user-level data isolation (users can only access, modify, or delete their own tasks).

- **Task Management (Full CRUD):**
  - **Create:** Add tasks with title, description, category, priority, status, and due date via `TaskModal`.
  - **Read:** Live dashboard with responsive grid layout and real-time statistics.
  - **Update:** Edit task details or quickly toggle completion status (Completed <-> Pending) with one click.
  - **Delete:** Remove tasks with confirmation dialog.

- **Smart Filtering & Search:**
  - Sidebar view filters: *All Tasks*, *Pending*, *Completed*, *High Priority*.
  - Category filters: *Personal*, *Work*, *Study*, *Development*.
  - Live, real-time title and description search in the Navbar.
  - Secondary dropdown filter for priority levels (*Low*, *Medium*, *High*).
  - Clickable `StatCard` metrics for instant view filtering.

- **Responsive Design:**
  - Optimized for desktop, tablet, and mobile viewports.
  - Mobile slide-over drawer sidebar with backdrop blur.
  - Sticky top navigation bar.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Lucide React |
| **Backend** | Node.js, Express 5, Mongoose 9, JWT, bcryptjs, CORS, dotenv |
| **Database** | MongoDB Atlas |

---

## Project Structure

```text
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Mongoose connection
│   ├── middleware/
│   │   └── authMiddleware.js# JWT verification middleware
│   ├── models/
│   │   ├── Task.js          # Task schema & model
│   │   └── User.js          # User schema & model
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth (register, login)
│   │   └── taskRoutes.js    # /api/tasks (CRUD endpoints)
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── server.js            # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with search & user pill
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx      # Navigation drawer & filters
│   │   │   ├── StatCard.jsx     # KPI metric cards
│   │   │   ├── TaskCard.jsx     # Task card with badges & actions
│   │   │   ├── TaskModal.jsx    # Create/Edit dialog
│   │   │   ├── components.css   # Scoped modern styles
│   │   │   └── index.js         # Barrel export
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Register.jsx     # Registration page
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with interceptors
│   │   ├── App.jsx              # React Router setup
│   │   ├── Dashboard.jsx        # Integrated dashboard
│   │   └── main.jsx
│   ├── .env.example             # Frontend env template
│   └── package.json
│
├── .gitignore                   # Root gitignore protecting .env
├── package.json                 # Root convenience scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB Atlas cluster URI

### 1. Clone & Setup Environment

#### Backend Setup
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key_here
```

#### Frontend Setup (Optional for local dev)
For local development, the frontend defaults to `http://localhost:5000/api`. For custom or production URLs:
```bash
cd frontend
cp .env.example .env.local
```

---

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 3. Running Locally

#### Option A: Run Backend & Frontend Separately
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### Option B: Run from Root
```bash
npm run backend   # Starts backend on http://localhost:5000
npm run frontend  # Starts frontend on http://localhost:5173
```

---

## API Endpoints

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Create account (`name`, `email`, `password`)
* `POST /api/auth/login` - Authenticate (`email`, `password`), returns JWT token & user info

### Tasks (`/api/tasks`) *(Requires `Authorization: Bearer <token>`)*
* `GET /api/tasks` - Fetch all tasks for logged-in user
* `POST /api/tasks` - Create a task (`title`, `description`, `category`, `priority`, `status`, `dueDate`)
* `PUT /api/tasks/:id` - Update a task owned by logged-in user
* `DELETE /api/tasks/:id` - Delete a task owned by logged-in user
