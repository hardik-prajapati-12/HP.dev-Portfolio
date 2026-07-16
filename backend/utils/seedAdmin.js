const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Blog = require('../models/Blog');
const Stat = require('../models/Stat');
const SkillCategory = require('../models/SkillCategory');
const ExperienceType = require('../models/ExperienceType');
const BlogCategory = require('../models/BlogCategory');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Clear Existing Collections
    console.log('Clearing existing database collections...');
    
    // Preserve custom avatar if it exists
    let avatarToUse = "/uploads/1781442618400-360230949.png"; // Fallback to their uploaded photo
    try {
      const existingProfile = await Profile.findOne();
      if (existingProfile && existingProfile.avatar && !existingProfile.avatar.includes('dicebear.com')) {
        avatarToUse = existingProfile.avatar;
      }
    } catch (err) {
      console.warn("Failed checking existing profile avatar:", err.message);
    }

    await User.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});
    await Achievement.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});
    await Stat.deleteMany({});
    await SkillCategory.deleteMany({});
    await ExperienceType.deleteMany({});
    await BlogCategory.deleteMany({});
    console.log('Database collections cleared successfully.');

    // 2. Seed Admin User
    console.log('Seeding Admin User...');
    const adminUser = await User.create({
      name: 'Hardik Prajapati',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // 3. Seed Profile
    console.log('Seeding Profile...');
    await Profile.create({
      name: "Hardik Prajapati",
      title: "Software Engineer",
      email: "hardikprajapati@email.com",
      phone: "+91 9876543210",
      location: "India",
      github: "https://github.com/hardikprajapati",
      linkedin: "https://linkedin.com/in/hardikprajapati",
      twitter: "https://twitter.com/hardikprajapati",
      bio: "Passionate MERN Stack Developer with a love for building scalable, elegant web applications. I transform complex problems into clean, user-friendly solutions that make a difference.",
      avatar: avatarToUse,
      yearsExp: 4,
      resumeUrl: "#",
      heroTitle: "Full Stack Developer & Software Engineer",
      heroDesc: "I build scalable, high-performance web applications with clean code and exceptional user experiences.",
      roles: [
        "MERN Stack Developer",
        "Full Stack Engineer",
        "Java Developer",
        "Problem Solver",
        "Open Source Contributor",
      ],
      heroSkills: [
        "Java",
        "React",
        "Node.js",
        "MongoDB",
        "AI / ML",
        "DSA"
      ]
    });
    console.log('Profile seeded successfully.');

    // 3.5. Seed Skill Categories
    console.log('Seeding Skill Categories...');
    const initialCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Learning'];
    await SkillCategory.insertMany(initialCategories.map(name => ({ name })));
    console.log('Skill Categories seeded successfully.');

    // Seed Experience Types
    console.log('Seeding Experience Types...');
    const initialTypes = ['Full-time', 'Internship', 'Freelance', 'Volunteer', 'Part-time', 'Contract'];
    await ExperienceType.insertMany(initialTypes.map(name => ({ name })));
    console.log('Experience Types seeded successfully.');

    // Seed Blog Categories
    console.log('Seeding Blog Categories...');
    const initialBlogCategories = [
      { name: 'Frontend', color: '#3B82F6' },
      { name: 'Backend', color: '#10B981' },
      { name: 'Design', color: '#EC4899' }
    ];
    await BlogCategory.insertMany(initialBlogCategories);
    console.log('Blog Categories seeded successfully.');

    // 4. Seed Skills
    console.log('Seeding Skills...');
    const skillsData = [
      // Frontend
      { name: "React.js", level: 92, category: "Frontend", order: 1 },
      { name: "JavaScript", level: 90, category: "Frontend", order: 2 },
      { name: "TypeScript", level: 78, category: "Frontend", order: 3 },
      { name: "Tailwind CSS", level: 88, category: "Frontend", order: 4 },
      { name: "HTML", level: 95, category: "Frontend", order: 5 },
      { name: "CSS", level: 93, category: "Frontend", order: 6 },
      { name: "Next.js", level: 75, category: "Frontend", order: 7 },
      // Backend
      { name: "Node.js", level: 88, category: "Backend", order: 8 },
      { name: "Express.js", level: 85, category: "Backend", order: 9 },
      { name: "Java", level: 80, category: "Backend", order: 10 },
      { name: "Python", level: 70, category: "Backend", order: 11 },
      { name: "REST APIs", level: 92, category: "Backend", order: 12 },
      { name: "GraphQL", level: 65, category: "Backend", order: 13 },
      // Database
      { name: "MongoDB", level: 87, category: "Database", order: 14 },
      { name: "MySQL", level: 82, category: "Database", order: 15 },
      { name: "PostgreSQL", level: 75, category: "Database", order: 16 },
      { name: "Redis", level: 65, category: "Database", order: 17 },
      // Tools
      { name: "Git & GitHub", level: 93, category: "Tools", order: 18 },
      { name: "Docker", level: 72, category: "Tools", order: 19 },
      { name: "VS Code", level: 97, category: "Tools", order: 20 },
      { name: "Postman", level: 90, category: "Tools", order: 21 },
      { name: "AWS", level: 60, category: "Tools", order: 22 },
      { name: "Linux", level: 75, category: "Tools", order: 23 },
      // Learning
      { name: "Rust", level: 100, category: "Learning", order: 24 },
      { name: "TypeScript", level: 100, category: "Learning", order: 25 },
      { name: "Kubernetes", level: 100, category: "Learning", order: 26 },
      { name: "AI/ML", level: 100, category: "Learning", order: 27 },
      { name: "React Native", level: 100, category: "Learning", order: 28 },
      { name: "Web3", level: 100, category: "Learning", order: 29 },
    ];
    await Skill.insertMany(skillsData);
    console.log('Skills seeded successfully.');

    // 5. Seed Projects
    console.log('Seeding Projects...');
    const projectsData = [
      {
        title: "E-Commerce Platform",
        description: "Full-featured MERN stack e-commerce with real-time inventory, payment gateway, and admin dashboard.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis", "Socket.io"],
        category: "mern",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["Real-time inventory", "Stripe payments", "JWT auth", "Admin panel", "Order tracking"],
        featured: true,
        order: 1
      },
      {
        title: "AI Task Manager",
        description: "Smart task management app with AI-powered prioritization, calendar sync, and team collaboration.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80",
        technologies: ["React", "Node.js", "OpenAI API", "MongoDB", "Socket.io"],
        category: "web",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["AI prioritization", "Real-time sync", "Calendar integration", "Team workspaces"],
        featured: true,
        order: 2
      },
      {
        title: "Social Media Analytics",
        description: "Real-time social media analytics dashboard with data visualization and sentiment analysis.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
        technologies: ["React", "D3.js", "Node.js", "Python", "PostgreSQL"],
        category: "web",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["Real-time data", "Sentiment analysis", "Custom reports", "Data export"],
        featured: false,
        order: 3
      },
      {
        title: "Hospital Management System",
        description: "Java-based comprehensive hospital management system with patient records and appointment scheduling.",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80",
        technologies: ["Java", "Spring Boot", "MySQL", "Hibernate", "Thymeleaf"],
        category: "java",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["Patient records", "Appointment system", "Billing", "Doctor dashboard"],
        featured: false,
        order: 4
      },
      {
        title: "Real-time Chat App",
        description: "WebSocket-powered messaging platform with end-to-end encryption, file sharing, and video calls.",
        image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80",
        technologies: ["React", "Socket.io", "Node.js", "MongoDB", "WebRTC"],
        category: "mern",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["Real-time messaging", "E2E encryption", "File sharing", "Video calls"],
        featured: true,
        order: 5
      },
      {
        title: "Portfolio Design System",
        description: "Modern UI design system and component library with Figma integration and interactive docs.",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
        technologies: ["React", "Storybook", "Figma", "Tailwind CSS", "TypeScript"],
        category: "ui",
        githubUrl: "#",
        liveUrl: "#",
        showGithub: true,
        showLive: true,
        features: ["50+ components", "Figma tokens", "Dark/light mode", "Accessibility"],
        featured: false,
        order: 6
      },
    ];
    await Project.insertMany(projectsData);
    console.log('Projects seeded successfully.');

    // 6. Seed Experience
    console.log('Seeding Experience...');
    const experienceData = [
      {
        year: "2023 – Present",
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        type: "Full-time",
        description: "Building scalable microservices architecture with Node.js, leading a team of 5 developers, and implementing CI/CD pipelines that reduced deployment time by 60%.",
        tech: ["React", "Node.js", "AWS", "Docker", "MongoDB"],
        icon: "💼",
        order: 1
      },
      {
        year: "2022 – 2023",
        title: "MERN Stack Intern",
        company: "StartupHub Inc.",
        type: "Internship",
        description: "Developed 3 full-stack features from scratch, improved page load times by 40%, and contributed to the migration from REST to GraphQL APIs.",
        tech: ["React", "Express.js", "MongoDB", "GraphQL"],
        icon: "🚀",
        order: 2
      },
      {
        year: "2022",
        title: "Freelance Developer",
        company: "Self-employed",
        type: "Freelance",
        description: "Delivered 15+ client projects including e-commerce platforms, business websites, and web applications with 100% client satisfaction rate.",
        tech: ["React", "Node.js", "WordPress", "Shopify"],
        icon: "🎯",
        order: 3
      },
      {
        year: "2021",
        title: "Open Source Contributor",
        company: "Various Projects",
        type: "Volunteer",
        description: "Contributed to popular open source projects including React libraries and Node.js packages, with 500+ GitHub stars earned.",
        tech: ["JavaScript", "TypeScript", "Git"],
        icon: "🌟",
        order: 4
      },
    ];
    await Experience.insertMany(experienceData);
    console.log('Experience seeded successfully.');

    // 7. Seed Education
    console.log('Seeding Education...');
    const educationData = [
      {
        degree: "Bachelor of Technology - Computer Science",
        institution: "State University of Technology",
        year: "2019 – 2023",
        grade: "GPA: 3.8 / 4.0",
        icon: "🎓",
        color: "#10B981",
        order: 1,
        currentlyPursuing: false
      },
      {
        degree: "Higher Secondary Certificate",
        institution: "City Science College",
        year: "2017 – 2019",
        grade: "Percentage: 92%",
        icon: "📚",
        color: "#06B6D4",
        order: 2,
        currentlyPursuing: false
      },
    ];
    await Education.insertMany(educationData);
    console.log('Education seeded successfully.');

    // 8. Seed Certifications
    console.log('Seeding Certifications...');
    const certificationsData = [
      {
        title: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        date: new Date("2023-06-15"),
        badge: "☁️",
        color: "#FF9900",
        credentialId: "AWS-DEV-87421",
        credentialUrl: "https://aws.amazon.com/verification",
        description: "AWS Certified Developer - Associate showcases key technical expertise in designing, building, and deploying secure, robust, and scalable applications on the Amazon Web Services platform. It validates the capability to write applications using AWS service APIs, write infrastructure-as-code using AWS CloudFormation, configure CI/CD pipelines, and implement cloud security best practices.",
        skills: "Cloud Architecture, AWS Serverless, Lambda, DynamoDB, CloudFormation, CI/CD, IAM Security, API Gateway"
      },
      {
        title: "MongoDB Certified Developer",
        issuer: "MongoDB University",
        date: new Date("2023-04-10"),
        badge: "🍃",
        color: "#10B981",
        credentialId: "MDB-CERT-9923",
        credentialUrl: "https://university.mongodb.com/course_completion/verify",
        description: "MongoDB Certified Developer Associate validates the key developer skills required to build applications using MongoDB. It covers data modeling patterns, indexing strategies, aggregation pipeline construction, CRUD operations optimization, and understanding the core mechanics of document storage under write and read concern configurations.",
        skills: "Document Modeling, Indexing, Aggregation Framework, Mongoose, NoSQL Architecture, Query Optimization"
      },
      {
        title: "Meta React Developer Certificate",
        issuer: "Meta / Coursera",
        date: new Date("2022-11-20"),
        badge: "⚛️",
        color: "#0081FB",
        credentialId: "COURSERA-META-REACT-7",
        credentialUrl: "https://www.coursera.org/verify/meta-react-developer",
        description: "Issued by Meta through Coursera, this certification validates core frontend engineering principles, advanced React hooks, responsive web layouts, custom component designs, client-side routing structures, and state management optimization. It includes designing full-fledged reactive client-side interfaces and testing components using Jest and React Testing Library.",
        skills: "React.js, React Hooks, Frontend Design, State Management, Routing, Component Testing, CSS Frameworks"
      },
      {
        title: "Node.js Application Developer",
        issuer: "OpenJS Foundation",
        date: new Date("2022-08-05"),
        badge: "🟢",
        color: "#68A063",
        credentialId: "OPENJS-JSNAD-2810",
        credentialUrl: "https://credentials.openjsf.org",
        description: "The OpenJS Node.js Application Developer (JSNAD) certificate validates competency in creating server-side applications, writing RESTful routers, configuring security measures, handling asynchronous operations, managing stream buffers, and integrating database connections using the official Node.js runtime and Express framework.",
        skills: "Node.js, Express.js, Asynchronous Programming, REST APIs, Stream Buffers, Event Loop, Server Security"
      },
      {
        title: "Google Cloud Professional",
        issuer: "Google Cloud",
        date: new Date("2023-09-12"),
        badge: "🌐",
        color: "#4285F4",
        credentialId: "GCP-PDEV-55410",
        credentialUrl: "https://credential.google.com",
        description: "Google Cloud Professional developer credentials validate the capabilities to design, build, and manage cloud-native developer applications on Google Cloud Platform. It verifies familiarity with Google Kubernetes Engine (GKE), Google Cloud Functions, Cloud Run, Firestore, BigQuery, and implementing secure cloud IAM policies.",
        skills: "Google Cloud Platform, Kubernetes (GKE), Serverless Compute, Cloud Run, IAM Policies, Firestore, Cloud Monitoring"
      },
      {
        title: "Java SE 11 Developer",
        issuer: "Oracle",
        date: new Date("2022-03-30"),
        badge: "☕",
        color: "#F80000",
        credentialId: "ORACLE-OCP-11-JAVASE",
        credentialUrl: "https://education.oracle.com",
        description: "Oracle Java SE 11 Professional Certification demonstrates deep understanding of Java syntax, object-oriented design principles, functional interfaces, lambda expressions, stream API processing, concurrency frameworks, modules design, and database interaction using JDBC APIs.",
        skills: "Java 11, Object-Oriented Programming, Functional Programming, Java Streams, Concurrency, JDBC, Module System"
      }
    ];
    await Certification.insertMany(certificationsData);
    console.log('Certifications seeded successfully.');

    // 9. Seed Achievements
    console.log('Seeding Achievements...');
    const achievementsData = [
      {
        title: "Hackathon Winner",
        desc: "1st place at TechHack 2023 out of 200 teams",
        icon: "🥇",
        value: "1st Place",
        order: 1,
        details: "Achieved first place out of 200 competing developer teams in the annual TechHack 2023 Hackathon. Designed and built a fully functional MERN stack cooperative platform with real-time analytics in a high-pressure, 36-hour sprint.",
        skills: "Rapid Prototyping, Team Leadership, Full-Stack Architecture, Presentation, Real-time WebSockets"
      },
      {
        title: "Open Source Stars",
        desc: "Earned 500+ stars across personal GitHub repositories",
        icon: "⭐",
        value: "500+",
        order: 2,
        details: "Earned more than 500 stars across various personal open-source GitHub repositories. Published reusable React components, custom Hooks, and Node.js middleware modules designed to help developers solve everyday logic problems.",
        skills: "Open Source, Git/GitHub, Library Design, Code Documentation, Package Maintenance"
      },
      {
        title: "LeetCode Rank",
        desc: "Solved 500+ problems with top 5% global ranking",
        icon: "💻",
        value: "Top 5%",
        order: 3,
        details: "Solved over 500 algorithm problems covering arrays, dynamic programming, graph traversal, greedy choices, and search methodologies, ranking in the top 5% of global competitors on LeetCode.",
        skills: "Data Structures, Algorithms, Problem Solving, Computational Complexity, Code Optimization"
      },
      {
        title: "Published Articles",
        desc: "Technical articles on Medium with 10K+ total reads",
        icon: "✍️",
        value: "10K+ reads",
        order: 4,
        details: "Authored and published over 15 high-quality technical articles on Medium and dev.to focused on JavaScript, React optimization, and backend architectures, collectively earning over 10K reads globally.",
        skills: "Technical Writing, Code Explanation, Developer Relations, Blogging, SEO Content"
      }
    ];
    await Achievement.insertMany(achievementsData);
    console.log('Achievements seeded successfully.');

    // 10. Seed Services
    console.log('Seeding Services...');
    const servicesData = [
      { title: "Full Stack Development", desc: "End-to-end web applications with React, Node.js, and MongoDB", icon: "🚀", color: "#10B981", order: 1 },
      { title: "API Development", desc: "RESTful and GraphQL APIs with robust auth and documentation", icon: "🔗", color: "#06B6D4", order: 2 },
      { title: "Frontend Development", desc: "Pixel-perfect, responsive UIs with modern frameworks and animations", icon: "🎨", color: "#8B5CF6", order: 3 },
      { title: "Database Design", desc: "Scalable database architecture for SQL and NoSQL systems", icon: "🗄️", color: "#F59E0B", order: 4 },
      { title: "Performance Optimization", desc: "Audit and optimize load times, Core Web Vitals, and SEO", icon: "⚡", color: "#EF4444", order: 5 },
      { title: "Technical Consulting", desc: "Architecture reviews, code audits, and tech stack recommendations", icon: "💡", color: "#10B981", order: 6 },
    ];
    await Service.insertMany(servicesData);
    console.log('Services seeded successfully.');

    // 11. Seed Testimonials
    console.log('Seeding Testimonials...');
    const testimonialsData = [
      { name: "Sarah Chen", role: "CTO", company: "TechVenture", content: "Hardik delivered our e-commerce platform on time and exceeded expectations. The code quality and attention to detail were remarkable. Highly recommend!", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      { name: "Marcus Johnson", role: "Founder", company: "StartupX", content: "Working with Hardik was a game-changer. The MERN stack app he built for us handles 50K+ users daily with zero downtime. Absolutely brilliant work!", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
      { name: "Emily Rodriguez", role: "Product Manager", company: "InnovateCo", content: "Hardik is not just a developer — he's a problem solver. He suggested architectural improvements that saved us months of tech debt. A true professional.", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
      { name: "David Park", role: "Lead Developer", company: "CodeFactory", content: "Outstanding JavaScript developer. Hardik's code is clean, well-documented, and scalable. He was also proactive in identifying and fixing potential issues.", rating: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log('Testimonials seeded successfully.');

    // 12. Seed Blogs
    console.log('Seeding Blogs...');
    const blogsData = [
      {
        title: 'Building Scalable MERN Apps: Best Practices in 2024',
        content: `Building scalable applications with the MERN stack requires a strong understanding of database modeling, server performance, and front-end optimization.\n\nIn this article, we cover key architecture patterns such as:\n1. Modular folder structures\n2. Mongoose schema optimizations\n3. Express middleware configuration\n4. React performance tuning\n\nImplementing these best practices helps keep your code maintainable and your app fast.`,
        excerpt: 'A deep dive into architecture patterns, performance optimization, and deployment strategies for production-ready MERN stack applications.',
        category: 'Backend',
        categoryColor: '#10B981',
        tags: ['MERN', 'Node.js', 'MongoDB', 'React'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2024-03-15'),
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80',
        views: 142,
        likes: 24
      },
      {
        title: 'Mastering React Performance with useMemo & useCallback',
        content: `React is incredibly fast out of the box, but as your application grows, you might notice sluggish performance due to unnecessary re-renders.\n\nWe will look at:\n1. When to use useMemo\n2. When to use useCallback\n3. How to profile components with React DevTools\n\nAvoid premature optimization, but know how to apply these hooks when you need them.`,
        excerpt: "Learn when and how to use React's memoization hooks to prevent unnecessary re-renders and dramatically boost app performance.",
        category: 'Frontend',
        categoryColor: '#3B82F6',
        tags: ['React', 'Performance', 'Hooks'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2024-02-28'),
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
        views: 98,
        likes: 16
      },
      {
        title: 'Designing Beautiful UIs: Glassmorphism & Neumorphism',
        content: `Modern UI design is all about visual hierarchies and depth. Glassmorphism and Neumorphism are two popular visual design languages.\n\nIn this guide:\n1. CSS recipes for glassy backdrops\n2. Box shadow techniques for neumorphic buttons\n3. Accessibility considerations for low contrast designs\n\nCombine Tailwind CSS and Framer Motion to bring these designs to life.`,
        excerpt: 'Explore modern UI design trends including glassmorphism and neumorphism, with practical examples using Tailwind CSS and Framer Motion.',
        category: 'Design',
        categoryColor: '#EC4899',
        tags: ['UI/UX', 'Tailwind', 'Design'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2024-02-10'),
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
        views: 184,
        likes: 32
      },
      {
        title: 'MongoDB Aggregation Pipelines: The Complete Guide',
        content: `MongoDB's aggregation framework is a powerful tool for processing data records and returning computed results.\n\nWe'll walk through:\n1. The $match and $project stages\n2. Grouping data with $group\n3. Joining collections with $lookup\n4. Performance tuning tips for large collections\n\nMastering aggregations can save you from writing complex logic in your application backend.`,
        excerpt: 'Master MongoDB aggregation pipelines from basics to advanced stages like $lookup, $unwind, $group, and real-world use cases.',
        category: 'Backend',
        categoryColor: '#10B981',
        tags: ['MongoDB', 'Database', 'NoSQL'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2024-01-22'),
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
        views: 76,
        likes: 12
      },
      {
        title: 'JWT Authentication: Secure Your Express APIs',
        content: `Securing endpoints is one of the most critical parts of web development. JSON Web Tokens (JWT) are the industry standard.\n\nTopics covered:\n1. Generating tokens and refresh tokens\n2. Securing routes with JWT middleware\n3. Storing tokens securely on the client-side\n4. Handling token expiration and logout\n\nKeep your Express APIs secure with robust auth middleware.`,
        excerpt: 'A step-by-step guide to implementing JWT-based authentication with refresh tokens, role-based access control, and security best practices.',
        category: 'Backend',
        categoryColor: '#10B981',
        tags: ['JWT', 'Security', 'Express', 'Node.js'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2024-01-08'),
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
        views: 120,
        likes: 19
      },
      {
        title: 'Framer Motion: Advanced Animations in React',
        content: `Framer Motion is a production-ready motion library for React. It makes creating smooth animations simple and declarative.\n\nWe explore:\n1. Motion components and basic animates\n2. Orchestrating timelines with AnimatePresence\n3. Building complex hover and tap interactions\n4. Scroll-triggered animations\n\nAdd micro-interactions to make your site feel premium and dynamic.`,
        excerpt: 'From basic transitions to complex orchestrated animations, page transitions, and scroll-triggered effects using Framer Motion.',
        category: 'Frontend',
        categoryColor: '#3B82F6',
        tags: ['React', 'Animation', 'Framer Motion'],
        author: 'Hardik Prajapati',
        createdAt: new Date('2023-12-15'),
        readTime: '9 min read',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      },
    ];
    const blogsWithSlugs = blogsData.map(b => ({
      ...b,
      slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
    await Blog.insertMany(blogsWithSlugs);
    console.log('Blogs seeded successfully.');

    // 12. Seed Stats
    console.log('Seeding Stats...');
    const statsData = [
      {
        label: "Projects Completed",
        value: 48,
        suffix: "+",
        icon: "🚀",
        description: "Delivering high-quality, scalable, and responsive web applications.",
        order: 1
      },
      {
        label: "Technologies Mastered",
        value: 25,
        suffix: "+",
        icon: "⚡",
        description: "Proficient across the full stack, from frontend frameworks to databases.",
        order: 2
      },
      {
        label: "Certifications",
        value: 12,
        suffix: "",
        icon: "🏆",
        description: "Validated expertise from leading cloud providers and technology partners.",
        order: 3
      },
      {
        label: "Problems Solved",
        value: 500,
        suffix: "+",
        icon: "💡",
        description: "Strong foundation in data structures, algorithms, and logical reasoning.",
        order: 4
      }
    ];
    await Stat.insertMany(statsData);
    console.log('Stats seeded successfully.');

    console.log('All database data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
