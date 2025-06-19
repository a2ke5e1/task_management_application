# Task Management Application

A full-stack task management application with a React + TypeScript + Vite + Material Web Components for frontend and an Express + TypeScript + MongoDB for backend.

---

## Setup

### 1. Clone the Repository

```sh
git clone <repo-url>
cd task_management_application
```

### 2. Install Dependencies

#### Backend

```sh
cd task_management_app_backend
npm install
```

#### Frontend

```sh
cd ../task_management_app_frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in `task_management_app_backend/` with your MongoDB connection string and your port:

```
MONGODB_URI=mongodb://localhost:27017/task_management
PORT=3000
```

---

## Running the Application

You can start both frontend and backend servers simultaneously using the provided batch script:

```sh
dev.bat
```

Or run them separately:

### Backend

```sh
cd task_management_app_backend
npm run dev
```

### Frontend

```sh
cd task_management_app_frontend
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).
- The backend API will be available at [http://localhost:3000](http://localhost:5000) (or your configured port).

---

## Build for Production

### Backend

```sh
cd task_management_app_backend
npm run build
```

### Frontend

```sh
cd task_management_app_frontend
npm run build
```

---

## Linting

Run ESLint in the frontend:

```sh
cd task_management_app_frontend
npm run lint
```

---

## Features

- Project, Team, and Task management
- Modern UI with Material Design and Tailwind CSS
- RESTful API with Express and MongoDB
- React Query for data fetching and caching
