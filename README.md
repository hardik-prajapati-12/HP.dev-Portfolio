# HP.dev-Portfolio 🚀 — Premium MERN Stack Portfolio Website

Welcome to **HP.dev-Portfolio**, a state-of-the-art, fully dynamic, and responsive professional portfolio website built using the MERN stack (MongoDB, Express, React, Node.js). 

This platform not only showcases your professional skills, projects, certifications, experiences, and blogs but also features a comprehensive **Admin Dashboard** to control and update all content dynamically, track visitor analytics, manage site settings (including a maintenance mode toggle), and interact with an integrated **AI Chatbot** powered by OpenAI.

---

## 🌟 Key Features

### 🖥️ Frontend & UI/UX
- **Dynamic Theming**: Smooth dark mode and light mode switching.
- **Micro-Animations**: Fluid transitions and hover effects powered by `Framer Motion`.
- **Responsive Layout**: Pixel-perfect grid layout matching all mobile, tablet, and desktop screens.
- **Custom Cursor & Loading Screen**: Sleek entry animation with custom loading states.
- **Section Controls**: Dynamically toggle sections (About, Skills, Projects, Services, Experience, Blogs, Testimonials, Contact) on or off from the Admin Panel.

### ⚙️ Admin Dashboard (Control Center)
- **Content Management (CRUD)**: Manage all profile data, skills, projects, experiences, services, blogs, testimonials, and certifications directly.
- **Visitor Analytics**: Interactive analytics charts using `Recharts` for page views, unique visits, and geographical/device statistics.
- **Maintenance Mode Switch**: Instantly lock/unlock the site with a custom maintenance message.
- **Global Settings Panel**: Change the site title, logos, social links, contact email, and visibility settings in real-time.

### 🤖 Advanced Integrations
- **AI Chatbot**: An embedded OpenAI-powered assistant trained to answer questions about you, your skills, and your portfolio.
- **Contact Notifications**: SMTP integration with `Nodemailer` for immediate email notification whenever a visitor fills out the contact form.
- **Payment Processing**: Integrated structures for Stripe and Razorpay payment support.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React.js](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vite.dev/) (v8)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) & Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [React Type Animation](https://github.com/lucasbasquerotto/react-type-animation)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)

### **Backend & Database**
- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **Security**: [Helmet](https://helmetjs.github.io/), CORS, and rate-limiting middleware
- **Email Dispatch**: [Nodemailer](https://nodemailer.com/)
- **AI Integration**: [OpenAI Node.js SDK](https://github.com/openai/openai-node)

---

## 📁 Folder Structure

```
HP.dev-Portfolio/
├── backend/
│   ├── config/             # Mongoose/DB configuration
│   ├── controllers/        # Route handlers for CRUD and business logic
│   ├── middleware/         # Auth, validation, error-handling, and security middlewares
│   ├── models/             # Mongoose schemas (Blog, Project, User, Analytics, etc.)
│   ├── routes/             # Express API routes
│   ├── utils/              # Helper utilities (Email, seed script, etc.)
│   ├── .env.example        # Environment variables template
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static assets (Favicons, generic SVGs)
│   ├── src/
│   │   ├── assets/         # App-specific images & logo branding
│   │   ├── components/     # UI components (Hero, About, Skills, Projects, Navbar, etc.)
│   │   ├── context/        # Theme & Admin Session context providers
│   │   ├── data/           # Config lists (Country codes, local data)
│   │   ├── pages/          # Main page views (Admin dashboard, BlogDetails, ProjectDetails)
│   │   ├── utils/          # Client API calls & layout helpers
│   │   ├── App.jsx         # App router and layout manager
│   │   └── main.jsx        # Frontend entry point
│   ├── .env.example        # Frontend environment variables template
│   └── vite.config.js      # Vite compilation configurations
├── package.json            # Workspace dev dependencies and runner scripts
└── README.md               # Project documentation
```

---

## 🚀 Getting Started (Local Setup)

Follow these steps to configure and run the project locally on your machine.

### **Prerequisites**
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally or a MongoDB Atlas connection URI

---

### **1. Clone & Install Dependencies**
Navigate to the root directory and install dependencies for the root, backend, and frontend with a single command:
```bash
npm run install-all
```

---

### **2. Setup Environment Variables**

#### **Backend Setup**
1. Copy the backend environment example file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Open `backend/.env` and update the variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure key used for signing session tokens.
   - `ADMIN_ACCESS_KEY` & `ADMIN_ALLOWED_IPS`: Keys and controls to restrict/secure admin login.
   - `SMTP_USER` & `SMTP_PASS`: Your Gmail/SMTP credentials for the contact form notifications.
   - `OPENAI_API_KEY`: Your OpenAI API key for training and powering the chatbot.

#### **Frontend Setup**
1. Copy the frontend environment example file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Open `frontend/.env` and set the backend base URL (usually `http://localhost:5000/api` during local development):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### **3. Seed the Admin User**
Create your default administrator credentials by running the seeding script:
```bash
npm run seed
```
*(This script will create the default admin account using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your `backend/.env` file)*

---

### **4. Start the Application**
Launch both the backend server and frontend development client concurrently:
```bash
npm run dev
```

Your React development server will start (normally at `http://localhost:5173`) and automatically open the website in your browser!

---

## 🔒 Security Practices
- Environment variables are properly separated and ignored by Git history.
- API requests to sensitive admin endpoints are protected by JSON Web Tokens (JWT) and custom access key authorization headers.
- Rate-limiting headers are applied on authorization and upload routes to prevent brute-force attacks.
- Inputs are validated using `express-validator` to protect against command and script injections.
