# GigFlow - Smart Leads Dashboard

A robust and modern full-stack web application designed to manage and track sales leads efficiently. This project is submitted as part of the Full Stack Development Internship assignment.

## 🚀 Core Features

- **Secure Authentication**: Built with JSON Web Tokens (JWT) and bcryptjs for encrypted password storage.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` and `Sales User` roles. For example, only Admins have the authority to delete leads from the system.
- **Optimized Data Fetching**: Features a custom `useDebounce` hook on the search input to minimize unnecessary API calls, ensuring high performance and a seamless user experience.
- **Advanced Filtering & Pagination**: Easily filter leads by Status and Source, search by name/email, and navigate through large datasets with server-side pagination.
- **Native CSV Export**: Generate and download a CSV file of the current filtered leads directly from the browser using Blob URLs.
- **Modern & Responsive UI**: Designed with TailwindCSS and Lucide Icons for a premium, glassmorphic, and fully responsive user experience across desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Form Handling & Validation**: React Hook Form, Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT, bcryptjs, CORS

### DevOps & Deployment
- **Containerization**: Docker, Docker Compose
- **Web Server (Frontend)**: NGINX (Multi-stage Docker build)

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Docker & Docker Compose](https://www.docker.com/) (Optional, for containerized setup)

## ⚙️ Environment Variables

The project requires environment variables to run. You must create `.env` files based on this structure:

**Backend (`backend/.env`):**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5001/api
```

## 🚀 Local Setup Instructions

You can run this project locally using either Docker (Recommended) or manual NPM scripts.

### Option A: Using Docker Compose (Recommended)

1. Clone the repository and navigate to the root directory.
2. Ensure Docker desktop is running.
3. Configure your `backend/.env` file with your MongoDB URI.
4. Run the following command from the root directory:

```bash
docker-compose up --build
```

- The **Frontend** will be available at: `http://localhost:3000`
- The **Backend API** will be available at: `http://localhost:5001`

### Option B: Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*(The backend will start on port 5001 by default)*

#### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will start on port 5173 by default)*

## 📁 Folder Structure Overview

```text
gigflow-smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route handlers/Logic
│   │   ├── middlewares/  # Auth and validation middlewares
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express route definitions
│   │   ├── utils/        # Helper functions
│   │   └── validators/   # Zod validation schemas
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Layout, Modals, etc.)
│   │   ├── context/      # React Context (Auth State)
│   │   ├── hooks/        # Custom React hooks (useLeads, useDebounce)
│   │   ├── pages/        # Top-level page components (Dashboard, Login)
│   │   ├── services/     # Axios API instances
│   │   └── types/        # TypeScript interfaces and enums
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml    # Root orchestration file
```
