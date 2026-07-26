# 🚀 HP.dev-Portfolio — Premium MERN Stack Portfolio Website

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-v19.2-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v4.21-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.9-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-v8.0-646CFF?logo=vite&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-000000?logo=vercel&logoColor=white)

Welcome to **HP.dev-Portfolio**, a state-of-the-art, dynamic, and responsive developer portfolio platform built on the MERN stack. Designed with visual excellence and administrative control in mind, this project seamlessly combines modern web aesthetics with robust backend management, dynamic content toggles, AI-driven interactivity, and cloud image management.

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🌟 Key Features](#-key-features)
- [🚀 Recent Enhancements](#-recent-enhancements)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Folder Structure](#-folder-structure)
- [⚙️ Environment Setup & Getting Started](#️-environment-setup--getting-started)
- [📡 API Endpoints Overview](#-api-endpoints-overview)
- [🔒 Security & Authentication](#-security--authentication)
- [🚢 Deployment Guide](#-deployment-guide)
- [📄 License & Author](#-license--author)

---

## ✨ Overview

**HP.dev-Portfolio** goes beyond a standard static portfolio. It functions as a complete content management ecosystem:

- **Public Client**: Showcases skills, projects, certifications, experiences, services, blogs, and testimonials with interactive background visual effects, fluid animations, and a sleek dark/light mode engine.
- **Admin Dashboard**: A secure portal allowing site owners to update profile details, manage content CRUD operations, control section visibilities instantly, analyze traffic with interactive charts, and train an AI assistant.
- **OpenAI & Q&A Assistant**: An intelligent chatbot capable of answering visitor queries using a hybrid approach—leveraging tokenized Jaccard Similarity matching for custom admin FAQs alongside fallback AI capabilities.

---

## 🌟 Key Features

### 🎨 Frontend & UI/UX Experience
- **Interactive Background Effects**: Dynamic full-page ambient visual effects and floating particle canvas overlays.
- **Dynamic Hero Section & Skills Showcase**: Manage hero titles, taglines, resume links, and hero-featured skills directly from the admin dashboard.
- **Instant Section Visibility Toggles**: Turn any section (About, Skills, Projects, Services, Experience, Blogs, Testimonials, Contact) on or off with zero-delay updates.
- **Micro-Animations & Motion**: Smooth page transitions, hover interactions, and counters powered by `Framer Motion` and `React CountUp`.
- **Pixel-Perfect Responsiveness**: Tailored design for mobile devices (down to Galaxy Fold), tablets, laptops, and ultra-wide monitors.
- **Dynamic Light & Dark Modes**: Fluid color transition system across all pages and administrative interfaces.

### 🎛️ Admin Control Center
- **Full CRUD Management**: Complete control over projects, skills, services, work experience, education, certifications, blogs, and user testimonials.
- **Live Search & Real-Time Filtering**: Instant real-time filtering across all admin data tables (Skills, Projects, Services, Certifications, Blogs, Categories, Comments).
- **Frosted-Glass Confirmation Modals**: Elegant theme-aware delete modals replacing default browser alerts.
- **Visitor Analytics Dashboard**: Recharts-powered graphs analyzing daily page views, unique visits, operating system splits, and traffic sources.
- **Maintenance Mode System**: One-click global site locking with custom maintenance messaging.

### 🤖 AI Assistant & Smart Integrations
- **AI Chatbot**: Embedded floating assistant configured to answer visitor inquiries about your background and technical skills.
- **Similarity Q&A Engine**: Uses tokenized similarity comparison to match user queries with custom Q&A items defined in the admin panel.
- **Cloudinary Image Hosting**: Direct cloud file upload with automatic disk buffer cleanup and fallback path resolution.
- **SMTP Email Dispatch**: Instant email delivery via Nodemailer whenever visitors submit the contact form.

---

## 🚀 Recent Enhancements

- 🌌 **Full-Page Ambient Background Effect**: Added smooth, modern ambient visual backdrop across the entire application interface.
- ⚡ **Zero-Delay Hide/Unhide Visibility System**: Optimized section and item visibility toggles across both public client and dashboard with instant state updates.
- 🎯 **Admin Hero Skills Management**: Dynamically customize skills displayed in the Hero section directly from the admin workspace.
- 👤 **Synchronized User Avatar Updates**: Avatar updates in profile settings seamlessly synchronize across top navigation, sidebar, and admin sessions.
- 🖼️ **Dynamic Fallback Image Resolution**: Dynamic relative fallback upload resolution preventing broken image links across local and production environments.
- 🌐 **Wildcard Admin IP & Dynamic CORS Whitelisting**: Improved security setup supporting wildcard IP matching (`*`) and dynamic origin validation for cloud platforms (Vercel, Render).
- ⚙️ **Vercel SPA Rewrites Configuration**: Pre-configured `vercel.json` for single-page app (SPA) routing without 404 errors on page reloads.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
| Library / Framework | Purpose |
| :--- | :--- |
| **React 19** | UI Component Architecture |
| **Vite 8** | Next-generation frontend build tool |
| **Tailwind CSS v4** | Utility-first styling & theme system |
| **Redux Toolkit** | Centralized application state management |
| **Framer Motion** | Declarative animations and UI transitions |
| **Recharts** | Data visualization for admin analytics |
| **Lucide & React Icons** | Modern icon set |

### **Backend**
| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Server runtime environment |
| **Express 4** | Web framework & REST API architecture |
| **MongoDB & Mongoose 8** | NoSQL database & object modeling |
| **Cloudinary SDK** | Cloud storage & image asset optimization |
| **Nodemailer** | SMTP email notification delivery |
| **OpenAI Node SDK** | AI assistance and query processing |
| **Helmet & CORS** | HTTP header security & cross-origin authorization |

---

## 📁 Folder Structure

```
HP.dev-Portfolio/
├── backend/
│   ├── config/             # Mongoose DB connection & Cloudinary config
│   ├── controllers/        # REST API controllers & business logic
│   ├── middleware/         # Auth (JWT), security, validation, & rate limiters
│   ├── models/             # Database schemas (User, Project, Skill, Blog, etc.)
│   ├── routes/             # Express API endpoints
│   ├── uploads/            # Local temporary upload storage
│   ├── utils/              # Admin seed scripts & mail helpers
│   ├── .env.example        # Backend environment template
│   └── server.js           # Express app entry point
├── frontend/
│   ├── public/             # Favicons and static web assets
│   ├── src/
│   │   ├── assets/         # App logos, illustrations, & graphics
│   │   ├── components/     # Reusable UI components (Hero, Navbar, Section Cards)
│   │   ├── context/        # React context (Theme, Admin state)
│   │   ├── pages/          # Main client & admin page views
│   │   ├── utils/          # API helper functions & Axios instance
│   │   ├── App.jsx         # Client routing & layout manager
│   │   └── main.jsx        # React root entry point
│   ├── vercel.json         # SPA fallback routes for Vercel deployment
│   ├── .env.example        # Frontend environment template
│   └── vite.config.js      # Vite configuration file
├── package.json            # Root workspace scripts & concurrency runner
└── README.md               # Project documentation
```

---

## ⚙️ Environment Setup & Getting Started

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance running on `mongodb://localhost:27017` OR a MongoDB Atlas cluster URI
- **Cloudinary Account**: For hosting image uploads (optional, local fallbacks supported)

---

### **1. Clone Repository & Install Dependencies**

Clone the project and install dependencies for root, backend, and frontend with a single command:

```bash
git clone https://github.com/hardik-prajapati-12/HP.dev-Portfolio.git
cd HP.dev-Portfolio
npm run install-all
```

---

### **2. Environment Variables Configuration**

#### **Backend Setup (`backend/.env`)**
Copy the backend `.env.example` file and configure your values:

```bash
cp backend/.env.example backend/.env
```

| Key | Description |
| :--- | :--- |
| `PORT` | Server port (default: `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signatures |
| `ADMIN_EMAIL` | Default admin email for seeding |
| `ADMIN_PASSWORD` | Default admin password for seeding |
| `ADMIN_ACCESS_KEY` | Header key for admin endpoint security |
| `ADMIN_ALLOWED_IPS` | IP whitelist (`127.0.0.1` or `*` for cloud) |
| `CLIENT_URL` | Allowed frontend origin URL |
| `CLOUDINARY_*` | Cloudinary Cloud Name, API Key, and Secret |
| `OPENAI_API_KEY` | API Key for AI Chatbot functionality |
| `SMTP_*` | Nodemailer credentials for contact email alerts |

#### **Frontend Setup (`frontend/.env`)**
Copy the frontend `.env.example` file:

```bash
cp frontend/.env.example frontend/.env
```

Set the backend API base URL:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### **3. Seed Administrator Credentials**

Run the seed script to create the initial admin user in your database:

```bash
npm run seed
```

---

### **4. Start Development Server**

Launch both backend API server and frontend Vite client simultaneously:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📡 API Endpoints Overview

| Category | Endpoint Base | Functionality | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth` | Login, verify token, security check | Public / Admin |
| **Profile** | `/api/profile` | Manage bio, title, social links, resume | Public / Admin |
| **Skills** | `/api/skills` | Manage skills list & hero skill highlights | Public / Admin |
| **Projects** | `/api/projects` | CRUD project showcase & tech tags | Public / Admin |
| **Services** | `/api/services` | Manage offered services & pricing | Public / Admin |
| **Blogs** | `/api/blogs` | Manage articles, categories, comments | Public / Admin |
| **Chat & AI** | `/api/chat`, `/api/chatbot-faq` | AI assistant queries & custom FAQ management | Public / Admin |
| **Analytics** | `/api/analytics` | Fetch page views, visitors, and stats | Admin |
| **Settings** | `/api/settings` | Maintenance mode & site configuration | Public / Admin |

---

## 🔒 Security & Authentication

- **JWT Authentication**: Protected administrative routes require valid Bearer token authentication headers.
- **Access Key Authorization**: Sensitive operations double-check explicit admin access header keys.
- **Dynamic CORS & IP Whitelisting**: Strict cross-origin request validation supporting wildcard matching for cloud dynamic IPs.
- **Rate Limiting**: Integrated express rate limiters for authentication attempts, uploads, and public APIs.
- **Input Sanitization**: Request validation using `express-validator` and `helmet` security headers.

---

## 🚢 Deployment Guide

### **Frontend (Vercel)**
1. Connect your repository to **Vercel**.
2. Set the Root Directory to `frontend`.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Add Environment Variable `VITE_API_URL` pointing to your deployed backend URL.

### **Backend (Render / Railway)**
1. Create a Web Service pointing to `backend`.
2. Build Command: `npm install`.
3. Start Command: `node server.js`.
4. Add environment variables from `backend/.env`.

---

## 📄 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs frontend and backend concurrently |
| `npm run install-all` | Installs root, backend, and frontend dependencies |
| `npm run build` | Builds frontend production assets |
| `npm run seed` | Seeds default admin credentials in database |
| `npm run server` | Starts backend server in development mode |
| `npm run client` | Starts frontend Vite development server |

---

## 👨‍💻 Author & License

Developed with ❤️ by **Hardik Prajapati**.

Distributed under the **MIT License**. See `LICENSE` for more information.
