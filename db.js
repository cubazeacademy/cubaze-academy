// Cubaze Academy Client-Side Database Manager (db.js)
// v2.0 — Full Premium LMS Edition

// ============================================================
// DEFAULT COURSE DATA — Real Cubaze Academy Courses
// ============================================================

const DEFAULT_COURSES = [
  {
    id: "blender-premium",
    title: "Blender Premium Course",
    shortDescription: "A complete professional Blender course covering beginner to advanced 3D modeling, sculpting, animation, and rendering.",
    description: "Master the art of 3D creation with our comprehensive Blender course. From absolute beginner to professional-level workflows, this course covers everything you need to launch a career in 3D art, animation, and visualization.\n\nYou'll learn 3D modeling techniques, sculpting organic and hard-surface objects, rigging and character animation, advanced rendering with Cycles and EEVEE, Geometry Nodes for procedural modeling, product visualization, professional lighting setups, and how to build a stunning 3D portfolio.",
    price: 2999,
    badge: "Best Seller",
    badgeColor: "#f59e0b",
    level: "Beginner to Advanced",
    language: "Malayalam + English",
    studentsCount: 4280,
    duration: "28 Hours",
    lessonsCount: 12,
    rating: 4.9,
    author: "sinanmp",
    authorName: "Cubaze Academy",
    authorBio: "Professional 3D artist and educator with 8+ years of experience in Blender, Cinema 4D, and visual effects.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    previewVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    requirements: [
      "A computer (Windows/Mac/Linux) — Blender is free to download",
      "No prior 3D experience required — we start from zero",
      "Basic computer literacy",
      "Willingness to practice and experiment"
    ],
    projects: [
      "3D Logo Reveal Animation",
      "Realistic Product Visualization (Bottle/Shoe)",
      "Character Sculpt & Rig",
      "Architectural Interior Render",
      "Procedural Landscape with Geometry Nodes"
    ],
    reviews: [
      { username: "riya_learns", name: "Riya Sharma", rating: 5, comment: "Absolutely the best Blender course on the internet! The instructor explains everything so clearly, even complex concepts like Geometry Nodes feel easy. I went from zero to creating professional product renders in just 3 weeks!", date: "2026-06-28" },
      { username: "dev_3d", name: "Devraj Patel", rating: 5, comment: "Worth every rupee! The projects are practical and industry-level. I got my first freelance 3D project because of the portfolio I built during this course. Highly recommended!", date: "2026-07-01" },
      { username: "ananya_art", name: "Ananya Iyer", rating: 5, comment: "The sculpting module alone is worth the full price. The attention to detail in teaching and the quality of content is outstanding. Cubaze Academy is top tier!", date: "2026-07-03" },
      { username: "mohit_3d", name: "Mohit Verma", rating: 4, comment: "Great course with excellent content. The lighting and rendering modules are especially well done. Would love to see more advanced animation content in future updates.", date: "2026-07-05" }
    ],
    modules: [
      {
        id: "blender-p-m1",
        title: "Module 1: Blender Interface & Navigation",
        lessons: [
          { id: "blp-m1-l1", title: "Introduction to Blender — Download & Setup", duration: "12:30" },
          { id: "blp-m1-l2", title: "Navigating the 3D Viewport", duration: "18:45" },
          { id: "blp-m1-l3", title: "Workspace Customization & Shortcuts", duration: "15:20" }
        ]
      },
      {
        id: "blender-p-m2",
        title: "Module 2: 3D Modeling Fundamentals",
        lessons: [
          { id: "blp-m2-l1", title: "Mesh Editing — Vertices, Edges & Faces", duration: "24:10" },
          { id: "blp-m2-l2", title: "Modifiers — Mirror, Subdivision, Bevel", duration: "28:35" },
          { id: "blp-m2-l3", title: "Hard Surface Modeling Project — Helmet", duration: "42:00" }
        ]
      },
      {
        id: "blender-p-m3",
        title: "Module 3: Sculpting",
        lessons: [
          { id: "blp-m3-l1", title: "Sculpt Mode — Brushes & Tools", duration: "22:15" },
          { id: "blp-m3-l2", title: "Organic Sculpting — Character Head", duration: "38:45" }
        ]
      },
      {
        id: "blender-p-m4",
        title: "Module 4: Materials & Texturing",
        lessons: [
          { id: "blp-m4-l1", title: "Shader Editor & PBR Materials", duration: "26:30" },
          { id: "blp-m4-l2", title: "UV Unwrapping & Texture Painting", duration: "32:10" }
        ]
      },
      {
        id: "blender-p-m5",
        title: "Module 5: Lighting & Rendering",
        lessons: [
          { id: "blp-m5-l1", title: "HDRI Lighting & Studio Setups", duration: "20:45" },
          { id: "blp-m5-l2", title: "Cycles vs EEVEE — Production Rendering", duration: "35:20" }
        ]
      },
      {
        id: "blender-p-m6",
        title: "Module 6: Animation Fundamentals",
        lessons: [
          { id: "blp-m6-l1", title: "Keyframes, Timeline & Graph Editor", duration: "24:00" },
          { id: "blp-m6-l2", title: "Rigging & Armatures for Character Animation", duration: "45:30" }
        ]
      },
      {
        id: "blender-p-m7",
        title: "Module 7: Geometry Nodes",
        lessons: [
          { id: "blp-m7-l1", title: "Introduction to Geometry Nodes", duration: "28:15" },
          { id: "blp-m7-l2", title: "Procedural Landscapes & Effects", duration: "36:40" }
        ]
      },
      {
        id: "blender-p-m8",
        title: "Module 8: Product Visualization & Portfolio",
        lessons: [
          { id: "blp-m8-l1", title: "Professional Product Visualization Workflow", duration: "40:10" },
          { id: "blp-m8-l2", title: "Building Your 3D Portfolio", duration: "18:30" }
        ]
      }
    ],
    quiz: {
      questions: [
        { question: "Which rendering engine in Blender is GPU-accelerated and physically based?", options: ["EEVEE", "Cycles", "Workbench", "LuxCore"], answer: 1 },
        { question: "What modifier is used to make an object symmetrical along an axis?", options: ["Subdivision Surface", "Array", "Mirror", "Boolean"], answer: 2 },
        { question: "What does 'PBR' stand for in 3D materials?", options: ["Pixel Based Rendering", "Physically Based Rendering", "Procedural Blur Rendering", "Path Based Rendering"], answer: 1 },
        { question: "Geometry Nodes in Blender allow you to:", options: ["Only create particles", "Procedurally generate and modify geometry", "Only animate objects", "Import external 3D models"], answer: 1 }
      ]
    }
  },
  {
    id: "blender-basics",
    title: "Basics of Blender",
    shortDescription: "Perfect for beginners to learn Blender interface, navigation, simple modeling, materials, camera, and rendering.",
    description: "New to 3D? This is the perfect starting point. The Basics of Blender course is designed for complete beginners who want to understand the fundamentals of Blender without feeling overwhelmed.\n\nYou'll get comfortable with the Blender interface, learn to navigate the 3D viewport, create your first 3D models, apply basic materials and colors, set up cameras and lighting for a clean render, and export your work for sharing.",
    price: 499,
    badge: "Beginner",
    badgeColor: "#10b981",
    level: "Beginner",
    language: "Malayalam",
    studentsCount: 8620,
    duration: "8 Hours",
    lessonsCount: 5,
    rating: 4.8,
    author: "admin",
    authorName: "Cubaze Academy",
    authorBio: "Professional 3D artist and educator with 8+ years of experience in Blender and digital art.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    previewVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    requirements: [
      "A computer with Blender installed (free at blender.org)",
      "No 3D experience needed — this is a beginner course",
      "Curiosity and patience"
    ],
    projects: [
      "Simple 3D Donut (classic Blender project)",
      "Room Interior with Basic Furniture",
      "Simple Character — Beginner Sculpt"
    ],
    reviews: [
      { username: "priya_begin", name: "Priya Menon", rating: 5, comment: "As a complete beginner I was nervous about 3D but this course made it so approachable. The instructor is patient and explains every step. I made my first render within the first week!", date: "2026-06-20" },
      { username: "sachin_3d", name: "Sachin Gupta", rating: 5, comment: "Incredible value for ₹499! This is better than many courses that cost 10x more. I now understand Blender and am ready to move on to the Premium course.", date: "2026-07-02" },
      { username: "neha_creative", name: "Neha Joshi", rating: 5, comment: "Simple, clear, and concise. The perfect introduction to Blender. I was able to follow along at my own pace and actually understand what I was doing.", date: "2026-07-04" }
    ],
    modules: [
      {
        id: "blender-b-m1",
        title: "Module 1: Getting Started with Blender",
        lessons: [
          { id: "blb-m1-l1", title: "What is Blender & Why Learn It?", duration: "08:15" },
          { id: "blb-m1-l2", title: "Downloading & Installing Blender", duration: "06:30" },
          { id: "blb-m1-l3", title: "Understanding the Interface", duration: "16:45" }
        ]
      },
      {
        id: "blender-b-m2",
        title: "Module 2: Basic 3D Modeling",
        lessons: [
          { id: "blb-m2-l1", title: "Adding Objects & Basic Transforms", duration: "14:20" },
          { id: "blb-m2-l2", title: "Edit Mode — Simple Shape Creation", duration: "18:35" }
        ]
      },
      {
        id: "blender-b-m3",
        title: "Module 3: Materials & Colors",
        lessons: [
          { id: "blb-m3-l1", title: "Applying Materials & Colors", duration: "12:10" },
          { id: "blb-m3-l2", title: "Basic Shaders & Textures", duration: "15:40" }
        ]
      },
      {
        id: "blender-b-m4",
        title: "Module 4: Camera & Lighting",
        lessons: [
          { id: "blb-m4-l1", title: "Setting Up Camera & Composition", duration: "11:25" },
          { id: "blb-m4-l2", title: "Basic Lighting for Beginners", duration: "13:50" }
        ]
      },
      {
        id: "blender-b-m5",
        title: "Module 5: Rendering & Exporting",
        lessons: [
          { id: "blb-m5-l1", title: "Rendering Your First Image", duration: "10:30" },
          { id: "blb-m5-l2", title: "Exporting & Sharing Your Work", duration: "08:45" }
        ]
      }
    ],
    quiz: {
      questions: [
        { question: "What key is used to switch between Object Mode and Edit Mode in Blender?", options: ["E", "Tab", "M", "G"], answer: 1 },
        { question: "Which panel in Blender is used to assign materials to objects?", options: ["Modifiers", "Properties > Material", "UV Editor", "Node Editor"], answer: 1 },
        { question: "To render your scene, which keyboard shortcut do you use?", options: ["R", "F10", "F12", "Ctrl+R"], answer: 2 }
      ]
    }
  },
  {
    id: "premiere-pro",
    title: "Adobe Premiere Pro Tutorial",
    shortDescription: "Learn professional video editing using Adobe Premiere Pro, including editing workflow, color grading, and real-world projects.",
    description: "Become a professional video editor with this comprehensive Adobe Premiere Pro course. Whether you're editing YouTube videos, Instagram Reels, client projects, or cinematic films, this course will give you the skills and confidence to work like a pro.\n\nYou'll learn the complete editing workflow, cutting techniques, transitions, color grading with Lumetri Color, audio editing, motion graphics and title design, subtitles and captions, exporting for different platforms, and build real-world projects from scratch.",
    price: 999,
    badge: "Popular",
    badgeColor: "#3D46D8",
    level: "Beginner to Intermediate",
    language: "Malayalam + English",
    studentsCount: 6150,
    duration: "14 Hours",
    lessonsCount: 8,
    rating: 4.8,
    author: "instructor",
    authorName: "Cubaze Academy",
    authorBio: "Professional video editor and filmmaker with experience in Bollywood post-production, YouTube, and brand commercials.",
    image: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=600&auto=format&fit=crop&q=80",
    previewVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    requirements: [
      "Adobe Premiere Pro installed (CC subscription required)",
      "A computer with decent specs (8GB RAM minimum recommended)",
      "No prior video editing experience required",
      "Passion for storytelling through video"
    ],
    projects: [
      "YouTube Vlog Edit — Complete Episode",
      "Short Film Cinematic Edit with Color Grade",
      "Instagram Reel with Motion Graphics",
      "Client Commercial — 30-Second Ad"
    ],
    reviews: [
      { username: "vikas_edit", name: "Vikas Kumar", rating: 5, comment: "Best Premiere Pro course in Malayalam! I've been editing for a year now and I still learned so much from this course. The color grading module is exceptional. My videos look completely different now!", date: "2026-06-25" },
      { username: "sneha_youtube", name: "Sneha Rawat", rating: 5, comment: "I started this course as a YouTube beginner and now I get compliments on my editing constantly. The workflow section alone saved me hours every week. Thank you Cubaze Academy!", date: "2026-07-01" },
      { username: "amir_films", name: "Amir Shaikh", rating: 5, comment: "Amazing course for someone getting into film editing. The audio section was a revelation — I had no idea how much audio design matters. Production quality is top notch.", date: "2026-07-03" },
      { username: "kiran_creator", name: "Kiran Nair", rating: 4, comment: "Very comprehensive and well structured. The motion graphics section could be a bit more advanced but overall this is an excellent course for anyone starting out.", date: "2026-07-06" }
    ],
    modules: [
      {
        id: "premiere-m1",
        title: "Module 1: Introduction to Premiere Pro",
        lessons: [
          { id: "pp-m1-l1", title: "Interface Tour & Workspace Setup", duration: "14:20" },
          { id: "pp-m1-l2", title: "Importing Media & Project Management", duration: "12:35" }
        ]
      },
      {
        id: "premiere-m2",
        title: "Module 2: The Editing Workflow",
        lessons: [
          { id: "pp-m2-l1", title: "Timeline Basics — Cuts, Trims & Splits", duration: "22:10" },
          { id: "pp-m2-l2", title: "Advanced Editing Techniques", duration: "28:45" }
        ]
      },
      {
        id: "premiere-m3",
        title: "Module 3: Transitions & Effects",
        lessons: [
          { id: "pp-m3-l1", title: "Video Transitions & When to Use Them", duration: "16:30" },
          { id: "pp-m3-l2", title: "Video Effects & Speed Ramps", duration: "20:15" }
        ]
      },
      {
        id: "premiere-m4",
        title: "Module 4: Color Grading",
        lessons: [
          { id: "pp-m4-l1", title: "Lumetri Color — Basics & Correction", duration: "24:40" },
          { id: "pp-m4-l2", title: "Cinematic Color Grading Techniques", duration: "32:20" }
        ]
      },
      {
        id: "premiere-m5",
        title: "Module 5: Audio Editing",
        lessons: [
          { id: "pp-m5-l1", title: "Audio Fundamentals — Levels & Mixing", duration: "18:55" },
          { id: "pp-m5-l2", title: "Sound Design & Music Sync", duration: "22:30" }
        ]
      },
      {
        id: "premiere-m6",
        title: "Module 6: Motion Graphics & Titles",
        lessons: [
          { id: "pp-m6-l1", title: "Creating Text & Title Animations", duration: "20:10" },
          { id: "pp-m6-l2", title: "Using Essential Graphics & Motion Templates", duration: "16:45" }
        ]
      },
      {
        id: "premiere-m7",
        title: "Module 7: Subtitles & Captions",
        lessons: [
          { id: "pp-m7-l1", title: "Adding Subtitles & Auto-Captions", duration: "14:20" },
          { id: "pp-m7-l2", title: "Styling & Animating Captions", duration: "12:35" }
        ]
      },
      {
        id: "premiere-m8",
        title: "Module 8: Exporting & Real-World Projects",
        lessons: [
          { id: "pp-m8-l1", title: "Export Settings for YouTube, Instagram & Film", duration: "16:00" },
          { id: "pp-m8-l2", title: "Real-World Project — Full Edit from Scratch", duration: "48:30" }
        ]
      }
    ],
    quiz: {
      questions: [
        { question: "Which panel in Premiere Pro is used for color grading?", options: ["Effects Controls", "Lumetri Color", "Audio Track Mixer", "Essential Graphics"], answer: 1 },
        { question: "What is a 'J-Cut' in video editing?", options: ["A jump cut between scenes", "Where the audio from the next clip starts before the video", "A color grading technique", "A type of transition effect"], answer: 1 },
        { question: "Which keyboard shortcut is used to export/render a sequence in Premiere Pro?", options: ["Ctrl+S", "Ctrl+E", "Ctrl+M", "Ctrl+R"], answer: 2 },
        { question: "What does 'LUT' stand for in color grading?", options: ["Light Utility Tool", "Look Up Table", "Luma Uniform Tone", "Layer Unified Transfer"], answer: 1 }
      ]
    }
  }
];

// ============================================================
// DEFAULT USERS
// ============================================================
const DEFAULT_USERS = [
  { username: "sinanmp", password: "admin", name: "Cubaze Admin", role: "admin", registeredDate: "2026-01-01", enrolledCourses: [] }
];

// ============================================================
// DEFAULT TRANSACTIONS
// ============================================================
const DEFAULT_TRANSACTIONS = [];

// ============================================================
// DEFAULT PROGRESS
// ============================================================
const DEFAULT_PROGRESS = {};


// ============================================================
// DEFAULT BLOG POSTS
// ============================================================
const DEFAULT_BLOG_POSTS = [
  {
    id: "blender-beginners-guide",
    title: "The Ultimate Blender Beginner's Guide 2026",
    excerpt: "New to 3D? Here's everything you need to know to get started with Blender — the world's most powerful free 3D software.",
    content: "Blender is the most powerful free 3D software in the world. Whether you want to create movies, games, animations, or product visualizations, Blender has you covered. In this guide, we'll walk you through everything you need to know to get started on your 3D journey.",
    category: "Blender",
    author: "Cubaze Academy",
    date: "2026-07-01",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    tags: ["Blender", "3D", "Beginner", "Tutorial"]
  },
  {
    id: "color-grading-tips",
    title: "5 Color Grading Techniques That Will Transform Your Videos",
    excerpt: "Professional color grading is the secret weapon that separates amateur videos from cinematic masterpieces. Here are 5 techniques to elevate your work.",
    content: "Color grading is one of the most impactful skills a video editor can learn. A great color grade can make a simple iPhone video look cinematic, and a poor color grade can ruin footage shot on a RED camera. In this article, we explore 5 professional techniques.",
    category: "Premiere Pro",
    author: "Cubaze Academy",
    date: "2026-06-28",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=600&auto=format&fit=crop&q=80",
    tags: ["Premiere Pro", "Color Grading", "Video Editing"]
  },
  {
    id: "freelance-3d-career",
    title: "How to Start a 3D Freelancing Career in India",
    excerpt: "Learn how to turn your Blender skills into a profitable freelancing career. Real advice, real numbers, and a step-by-step roadmap.",
    content: "The 3D freelancing market in India is booming. From architectural visualization to product animation for e-commerce, the opportunities are endless. In this article, we share our proven roadmap for launching a profitable freelancing career.",
    category: "Freelancing",
    author: "Cubaze Academy",
    date: "2026-06-25",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format&fit=crop&q=80",
    tags: ["Freelancing", "Career", "3D", "India"]
  },
  {
    id: "ai-tools-creators",
    title: "Top 10 AI Tools Every Creator Needs in 2026",
    excerpt: "AI is transforming the creative industry. Here are the 10 AI tools that every digital creator, video editor, and 3D artist needs to know about.",
    content: "Artificial intelligence is no longer a futuristic concept — it's a practical tool that creative professionals use every day. From AI-powered background removal to automatic subtitle generation, these tools will save you hours every week.",
    category: "AI Tools",
    author: "Cubaze Academy",
    date: "2026-06-20",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80",
    tags: ["AI", "Tools", "Creators", "Productivity"]
  },
  {
    id: "video-editing-career",
    title: "Video Editing as a Career: Salary, Scope & Skills",
    excerpt: "Is video editing a good career choice in India? We break down salary expectations, market demand, and the skills you need to succeed.",
    content: "Video editing has emerged as one of the most in-demand creative skills of the 2020s. With the explosion of YouTube, OTT platforms, corporate video content, and social media, professional video editors are needed everywhere.",
    category: "Career",
    author: "Cubaze Academy",
    date: "2026-06-15",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    tags: ["Career", "Video Editing", "India", "Salary"]
  },
  {
    id: "blender-geometry-nodes",
    title: "Geometry Nodes in Blender: A Complete Introduction",
    excerpt: "Geometry Nodes is the most powerful feature in modern Blender. Learn how procedural generation works and why every 3D artist needs to know this.",
    content: "Geometry Nodes changed everything about how 3D artists create in Blender. This procedural system allows you to create complex, dynamic geometry using a visual node-based workflow — no manual modeling required.",
    category: "Blender",
    author: "Cubaze Academy",
    date: "2026-06-10",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80",
    tags: ["Blender", "Geometry Nodes", "Advanced", "Procedural"]
  }
];

// ============================================================
// DEFAULT FAQ DATA
// ============================================================
const DEFAULT_FAQ = [
  {
    category: "Courses & Learning",
    questions: [
      { q: "Do I get lifetime access to the course?", a: "Yes! Once you purchase a course, you have lifetime access to all lessons, resources, and future updates. Learn at your own pace, anytime, anywhere." },
      { q: "Are the courses in Malayalam or English?", a: "Most of our courses are taught in Malayalam with English technical terms, making them accessible to students. The Blender Premium and Adobe Premiere Pro courses are in Malayalam + English." },
      { q: "Can I access the course on mobile?", a: "Absolutely! Cubaze Academy is fully responsive and works on mobile, tablet, and desktop. You can learn on the go from any device." },
      { q: "Will I receive a certificate after completing the course?", a: "Yes! Upon completing all lessons and passing the final quiz, you'll automatically receive a verifiable digital certificate with a unique certificate number and QR code." },
      { q: "What is the difference between Basics of Blender and Blender Premium?", a: "Basics of Blender (₹499) is for absolute beginners and covers the fundamental interface, modeling, materials, and rendering. The Blender Premium Course (₹2999) is a comprehensive course covering advanced sculpting, animation, rigging, Geometry Nodes, product visualization, and portfolio creation." }
    ]
  },
  {
    category: "Payments & Pricing",
    questions: [
      { q: "What payment methods are accepted?", a: "We accept all payment methods via PhonePe — UPI, credit/debit cards, net banking, and PhonePe Wallet. Payments are 100% secure and encrypted." },
      { q: "Can I use a coupon or discount code?", a: "Yes! We regularly offer discount coupons on our social media channels and email newsletter. Enter your coupon code during checkout to avail the discount." },
      { q: "Is there an EMI option available?", a: "EMI options are available for purchases above ₹999 through our payment gateway partner. You'll see available EMI options at the payment step." },
      { q: "Are the prices inclusive of GST?", a: "All displayed prices are inclusive of applicable taxes (GST). There are no hidden charges." }
    ]
  },
  {
    category: "Refunds & Support",
    questions: [
      { q: "What is your refund policy?", a: "We offer a 7-day money-back guarantee on all courses. If you're not satisfied within 7 days of purchase, contact us at support@cubazeacademy.com for a full refund, no questions asked." },
      { q: "How can I contact support?", a: "You can reach us via email at support@cubazeacademy.com, WhatsApp at +91 98765 43210, or through the contact form on our Contact page. We typically respond within 24 hours." },
      { q: "What if I face technical issues with the course?", a: "Our support team is here to help! Contact us via email or WhatsApp and we'll resolve your issue as quickly as possible. Most issues are resolved within 2-4 hours." }
    ]
  },
  {
    category: "Certificates & Career",
    questions: [
      { q: "Is the Cubaze Academy certificate recognized by employers?", a: "Our certificates are industry-recognized and widely accepted by creative agencies, studios, and freelancing platforms. The certificate includes a QR code for easy online verification." },
      { q: "Can the certificate be shared on LinkedIn?", a: "Yes! Our certificates are designed to be shared on LinkedIn, your portfolio, and resume. They're professional, verifiable, and make a great impression on employers." },
      { q: "Will these courses help me get freelance work?", a: "Absolutely! Our courses are designed with real-world freelancing in mind. The projects you'll create during the courses serve as portfolio pieces that you can immediately show to clients." }
    ]
  }
];

// ============================================================
// DEFAULT TESTIMONIALS
// ============================================================
const DEFAULT_TESTIMONIALS = [
  { name: "Arjun Mehta", role: "3D Artist & Freelancer", location: "Mumbai", text: "Cubaze Academy completely changed my career trajectory. I went from a mechanical engineer to a professional 3D artist earning ₹80,000/month freelancing. The Blender Premium course is absolutely world class!", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { name: "Priya Sharma", role: "YouTube Creator", location: "Delhi", text: "The Premiere Pro course helped me take my YouTube channel from 500 to 50,000 subscribers! My video quality improved so dramatically that brands started noticing and offering sponsorships.", rating: 5, image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&auto=format&fit=crop&q=80" },
  { name: "Rohan Verma", role: "Graphic Designer", location: "Bangalore", text: "I'd tried multiple other online courses but nothing compared to Cubaze Academy's teaching style and course quality. The content is practical, up-to-date, and the instructor is incredibly knowledgeable.", rating: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
  { name: "Sneha Patel", role: "Architectural Visualizer", location: "Ahmedabad", text: "As an architecture student, the Blender course transformed how I present my projects. My visualizations now look indistinguishable from professional renders. Got hired at a top architectural firm because of this!", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80" },
  { name: "Karthik Nair", role: "Freelance Video Editor", location: "Kochi", text: "Best investment I've made in my creative education. Within 2 months of completing the Premiere Pro course, I was earning more than my previous full-time job. Thank you Cubaze Academy!", rating: 5, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
];

// ============================================================
// DEFAULT COUPONS
// ============================================================
const DEFAULT_COUPONS = [
  { code: "CUBAZE50", discount: 50, type: "percentage", active: true },
  { code: "LAUNCH2026", discount: 500, type: "flat", active: true },
  { code: "BLENDER200", discount: 200, type: "flat", active: true },
  { code: "STUDENT25", discount: 25, type: "percentage", active: true }
];

// Helper to get formatted dates relative to today
const getRelativeDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_LIVE_CLASSES = [
  {
    id: "LC_000001",
    course_id: "blender-premium",
    module_id: 0,
    tutor_id: "sinansir",
    title: "Introduction to 3D Viewport & Navigation",
    description: "In this live class, we will go over the Blender interface, viewport navigation, object manipulation, and basic scene setup. Bring your questions!",
    meet_link: "https://meet.google.com/abc-defg-hij",
    date: getRelativeDateString(1), // Tomorrow
    start_time: "15:00",
    end_time: "16:30",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "LC_000002",
    course_id: "blender-premium",
    module_id: 1,
    tutor_id: "sinansir",
    title: "Live Sculpting Workshop: Organic Shapes",
    description: "Hands-on sculpting workshop. We will learn dyntopo, remeshing, and dynamic topology sculpting workflow.",
    meet_link: "https://meet.google.com/xyz-pdqo-tuv",
    date: getRelativeDateString(0), // Today!
    start_time: "10:00",
    end_time: "23:59", // Keep it open for today
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "LC_000003",
    course_id: "blender-premium",
    module_id: 2,
    tutor_id: "sinansir",
    title: "Completed Class: Advanced Rigging Workflows",
    description: "This class covered inverse kinematics, forward kinematics, paint weights, and custom bone shapes. Recording is available below.",
    meet_link: "https://meet.google.com/qwe-rtyu-iop",
    date: getRelativeDateString(-2), // 2 days ago
    start_time: "14:00",
    end_time: "15:30",
    status: "published",
    recording_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_COMMON_MEETINGS = [
  {
    id: "CM-ORIENT-101",
    title: "Academy Orientation Session 2026",
    description: "Welcome to Cubaze Academy! Join this platform-wide orientation session to understand the curriculum, meet your instructors, and learn how to navigate the LMS.",
    meetLink: "https://meet.google.com/abc-orient-xyz",
    date: "2026-07-15",
    startTime: "10:00",
    endTime: "11:30",
    hostName: "Director Admin",
    status: "Upcoming",
    access: {
      type: "everyone",
      courseIds: [],
      batchIds: []
    },
    password: "welcome_cubaze",
    recordingLink: "",
    googleDriveResources: "https://drive.google.com/drive/folders/orient-resources",
    notes: "Please arrive 5 minutes early. Keep your microphone muted unless asked."
  }
];

const DEFAULT_BATCHES = [
  {
    id: "B-BLNP-001",
    name: "Blender Premium - Batch 1",
    courseId: "blender-premium",
    tutorIds: ["sinanmp"],
    maxStudents: 50,
    currentEnrollment: 10,
    startDate: "2026-07-01",
    endDate: "2026-10-01",
    classDays: ["Mon", "Wed", "Fri"],
    classTime: "18:00 - 20:00",
    googleMeetLink: "https://meet.google.com/abc-defg-hij",
    googleDriveFolder: "https://drive.google.com/drive/folders/blender-premium-b1",
    status: "Active"
  },
  {
    id: "B-BLNP-002",
    name: "Blender Premium - Batch 2",
    courseId: "blender-premium",
    tutorIds: ["sinanmp"],
    maxStudents: 50,
    currentEnrollment: 0,
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    classDays: ["Tue", "Thu", "Sat"],
    classTime: "19:00 - 21:00",
    googleMeetLink: "https://meet.google.com/xyz-pdqo-tuv",
    googleDriveFolder: "https://drive.google.com/drive/folders/blender-premium-b2",
    status: "Upcoming"
  },
  {
    id: "B-BLNB-001",
    name: "Blender Basics - Batch 1",
    courseId: "blender-basics",
    tutorIds: ["sinanmp"],
    maxStudents: 100,
    currentEnrollment: 5,
    startDate: "2026-07-10",
    endDate: "2026-08-10",
    classDays: ["Mon", "Thu"],
    classTime: "16:00 - 17:30",
    googleMeetLink: "https://meet.google.com/abc-defg-hij",
    googleDriveFolder: "https://drive.google.com/drive/folders/blender-basics-b1",
    status: "Enrollment Open"
  },
  {
    id: "B-PREM-001",
    name: "Premiere Pro - Batch 1",
    courseId: "premiere-pro",
    tutorIds: ["sinanmp"],
    maxStudents: 40,
    currentEnrollment: 8,
    startDate: "2026-06-15",
    endDate: "2026-08-15",
    classDays: ["Tue", "Fri"],
    classTime: "17:00 - 18:30",
    googleMeetLink: "https://meet.google.com/qwe-rtyu-iop",
    googleDriveFolder: "https://drive.google.com/drive/folders/premiere-pro-b1",
    status: "Active"
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "ANN_001",
    courseId: "blender-premium",
    batchId: "B-BLNP-001",
    title: "Welcome to Blender Premium Batch 1!",
    content: "Hi everyone! Welcome to the course. We will have our first live class this Monday at 6:00 PM. Please make sure you have installed Blender 4.1 before the class.",
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  },
  {
    id: "ANN_002",
    courseId: "blender-premium",
    batchId: "", // Entire course
    title: "Blender 4.2 LTS Released",
    content: "Blender 4.2 LTS has been released! It contains many performance improvements and new features. You can download it from blender.org.",
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: "ASM_001",
    courseId: "blender-premium",
    batchId: "B-BLNP-001",
    title: "Viewport Navigation Exercise",
    description: "Submit a screenshot of your customized workspace layout and create a simple scene with 3 primitives arranged in a step shape.",
    dueDate: getRelativeDateString(5),
    maxPoints: 100,
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  },
  {
    id: "ASM_002",
    courseId: "blender-premium",
    batchId: "", // Entire course
    title: "Blender Basics Quiz",
    description: "Complete the module 1 review quiz on the platform.",
    dueDate: getRelativeDateString(10),
    maxPoints: 50,
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_RESOURCES = [
  {
    id: "RES_001",
    courseId: "blender-premium",
    batchId: "B-BLNP-001",
    title: "Blender Shortcuts Cheat Sheet PDF",
    url: "https://download.blender.org/documentation/Blender_Shortcuts_CheatSheet.pdf",
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  },
  {
    id: "RES_002",
    courseId: "blender-premium",
    batchId: "", // Entire course
    title: "Reference Cube Texture Grid",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000",
    createdBy: "sinanmp",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ATTENDANCE = [
  {
    id: "ATT_001",
    batchId: "B-BLNP-001",
    username: "riya_learns",
    classDate: getRelativeDateString(-2),
    status: "PRESENT",
    joinTime: "18:02"
  },
  {
    id: "ATT_002",
    batchId: "B-BLNP-001",
    username: "dev_3d",
    classDate: getRelativeDateString(-2),
    status: "LATE",
    joinTime: "18:15"
  }
];



// ============================================================
// DATABASE CLASS
// ============================================================
class CubazeDB {
  constructor() {
    this.init();
    this.initSupabase();
  }

  initSupabase() {
    this.supabaseUrl = localStorage.getItem("cubaze_supabase_url") || "https://aqvtbtfospccfwpbqycx.supabase.co";
    this.supabaseKey = localStorage.getItem("cubaze_supabase_key") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdnRidGZvc3BjY2Z3cGJxeWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzE2MDQsImV4cCI6MjA5OTAwNzYwNH0.rwTdM4F8LZevcTyCanQb3eVyzrPMliYMuHyMKcP5QA8";
    this.sb = null;

    if (this.supabaseUrl && this.supabaseKey && window.supabase) {
      try {
        const cu = this.getCurrentUser();
        const options = {};
        if (cu) {
          options.global = {
            headers: {
              'X-Custom-Username': cu.username || '',
              'X-Custom-Role': cu.role || 'student'
            }
          };
        }
        this.sb = window.supabase.createClient(this.supabaseUrl, this.supabaseKey, options);
        console.log("⚡ Supabase Client initialized with headers:", options.global ? options.global.headers : 'none');
        // Try initial sync in background
        this.syncFromSupabase();
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
      }
    }
  }

  async syncFromSupabase() {
    if (!this.sb) return { success: false, error: "Supabase not connected." };
    try {
      console.log("🔄 Syncing data from Supabase...");
      
      // Sync Users — convert Supabase snake_case → JS camelCase
      const { data: users, error: uErr } = await this.sb.from('cubaze_users').select('*');
      if (!uErr && users && users.length > 0) {
        const mappedUsers = users.map(u => ({
          username: u.username,
          password: u.password,
          name: u.name,
          role: u.role || 'student',
          registeredDate: u.registered_date || '',
          enrolledCourses: u.enrolled_courses || [],
          enrolledBatches: u.enrolled_batches || {},
          wishlist: u.wishlist || [],
          authorBio: u.author_bio || '',
          assignedCourses: u.assigned_courses || [],
          suspended: u.suspended || false,
          deleted: u.deleted || false,
          phone: u.phone || ''
        }));
        localStorage.setItem("cubaze_users", JSON.stringify(mappedUsers));
      }

      // Sync Courses
      const { data: courses, error: cErr } = await this.sb.from('cubaze_courses').select('*');
      if (!cErr && courses && courses.length > 0) {
        localStorage.setItem("cubaze_courses", JSON.stringify(courses));
      }

      // Sync Batches
      const { data: batches, error: bErr } = await this.sb.from('cubaze_batches').select('*');
      if (!bErr && batches && batches.length > 0) {
        const mappedBatches = batches.map(b => ({
          id: b.id,
          name: b.name,
          courseId: b.course_id,
          tutorIds: b.tutor_ids || [],
          maxStudents: b.max_students || 50,
          currentEnrollment: b.current_enrollment || 0,
          startDate: b.start_date || '',
          endDate: b.end_date || '',
          classDays: b.class_days || [],
          classTime: b.class_time || '',
          googleMeetLink: b.google_meet_link || '',
          googleDriveFolder: b.google_drive_folder || '',
          status: b.status || 'Upcoming'
        }));
        localStorage.setItem("cubaze_batches", JSON.stringify(mappedBatches));
      }

      // Sync Announcements
      const { data: anns, error: annErr } = await this.sb.from('cubaze_announcements').select('*');
      if (!annErr && anns && anns.length > 0) {
        const mappedAnns = anns.map(a => ({
          id: a.id,
          courseId: a.course_id,
          batchId: a.batch_id,
          title: a.title,
          content: a.content,
          createdBy: a.created_by,
          createdAt: a.created_at
        }));
        localStorage.setItem("cubaze_announcements", JSON.stringify(mappedAnns));
      }

      // Sync Assignments
      const { data: asgs, error: asgErr } = await this.sb.from('cubaze_assignments').select('*');
      if (!asgErr && asgs && asgs.length > 0) {
        const mappedAsgs = asgs.map(a => ({
          id: a.id,
          courseId: a.course_id,
          batchId: a.batch_id,
          title: a.title,
          description: a.description,
          dueDate: a.due_date,
          maxPoints: a.max_points || 100,
          createdBy: a.created_by,
          createdAt: a.created_at
        }));
        localStorage.setItem("cubaze_assignments", JSON.stringify(mappedAsgs));
      }

      // Sync Resources
      const { data: ress, error: resErr } = await this.sb.from('cubaze_resources').select('*');
      if (!resErr && ress && ress.length > 0) {
        const mappedRess = ress.map(r => ({
          id: r.id,
          courseId: r.course_id,
          batchId: r.batch_id,
          title: r.title,
          url: r.url,
          createdBy: r.created_by,
          createdAt: r.created_at
        }));
        localStorage.setItem("cubaze_resources", JSON.stringify(mappedRess));
      }

      // Sync Attendance
      const { data: atts, error: attErr } = await this.sb.from('cubaze_attendance').select('*');
      if (!attErr && atts && atts.length > 0) {
        const mappedAtts = atts.map(a => ({
          id: a.id,
          batchId: a.batch_id,
          username: a.username,
          classDate: a.class_date,
          status: a.status,
          joinTime: a.join_time
        }));
        localStorage.setItem("cubaze_attendance", JSON.stringify(mappedAtts));
      }

      // Sync Transactions
      const { data: txns, error: tErr } = await this.sb.from('cubaze_transactions').select('*');
      if (!tErr && txns && txns.length > 0) {
        localStorage.setItem("cubaze_transactions", JSON.stringify(txns));
      }

      // Sync Progress
      const { data: prog, error: pErr } = await this.sb.from('cubaze_progress').select('*');
      if (!pErr && prog) {
        const progMap = {};
        prog.forEach(item => {
          if (!progMap[item.username]) progMap[item.username] = {};
          progMap[item.username][item.course_id] = {
            completedLessons: item.completed_lessons || [],
            quizScore: item.quiz_score,
            certificateEarned: item.certificate_earned
          };
        });
        if (Object.keys(progMap).length > 0) {
          localStorage.setItem("cubaze_progress", JSON.stringify(progMap));
        }
      }

      // Sync Activity Log
      const { data: acts, error: aErr } = await this.sb.from('cubaze_activity_log').select('*').order('timestamp', { ascending: false });
      if (!aErr && acts && acts.length > 0) {
        localStorage.setItem("cubaze_activity_log", JSON.stringify(acts));
      }

      // Sync Posters
      try {
        const { data: posts, error: postErr } = await this.sb.from('cubaze_posters').select('*');
        if (!postErr && posts) {
          const mappedPosts = posts.map(p => ({
            id: p.id,
            title: p.title,
            image: p.image || "",
            type: p.type || "General",
            shortDescription: p.short_description || "",
            eventDate: p.event_date || "",
            buttonText: p.button_text || "",
            buttonLink: p.button_link || "",
            publishStartDate: p.publish_start_date || "",
            publishEndDate: p.publish_end_date || "",
            targetAudience: p.target_audience || "Everyone",
            status: p.status || "Draft",
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString()
          }));
          localStorage.setItem("cubaze_posters", JSON.stringify(mappedPosts));
        }
      } catch (err) {
        console.warn("Supabase posters sync failed:", err);
      }

      console.log("✅ Supabase sync completed.");
      // Trigger a view refresh if app is loaded
      if (window.app && typeof window.app.renderRoute === 'function') {
        window.app.renderRoute();
      }
      return { success: true };
    } catch (e) {
      console.error("Supabase sync error:", e);
      return { success: false, error: e.message };
    }
  }

  async pushToSupabase(table, record) {
    if (!this.sb) return;
    try {
      // Upsert the record asynchronously in background
      await this.sb.from(table).upsert(record);
      console.log(`📡 Pushed update to Supabase table: ${table}`);
    } catch (err) {
      console.error(`Supabase push failed for table ${table}:`, err);
    }
  }

  setItemAndSync(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    
    // Check if Supabase client is initialized
    if (!this.sb) return;

    // Asynchronously push to Supabase based on the key
    if (key === "cubaze_courses") {
      value.forEach(course => {
        this.pushToSupabase("cubaze_courses", {
          id: course.id,
          title: course.title,
          short_description: course.shortDescription || "",
          description: course.description || "",
          price: course.price,
          badge: course.badge || "",
          badge_color: course.badgeColor || "",
          level: course.level || "",
          language: course.language || "",
          students_count: course.studentsCount || 0,
          duration: course.duration || "",
          lessons_count: course.lessonsCount || 0,
          rating: course.rating || 4.5,
          author: course.author || "admin",
          author_name: course.authorName || "Cubaze Academy",
          author_bio: course.authorBio || "",
          image: course.image || "",
          preview_video: course.previewVideo || "",
          requirements: course.requirements || [],
          projects: course.projects || [],
          reviews: course.reviews || [],
          modules: course.modules || [],
          quiz: course.quiz || { questions: [] },
          published: course.published !== false,
          archived: course.archived === true,
          created_at: course.createdDate || new Date().toISOString(),
          updated_at: course.updatedDate || new Date().toISOString(),
          category: course.category || "General"
        });
      });
    } else if (key === "cubaze_users") {
      value.forEach(user => {
        this.pushToSupabase("cubaze_users", {
          username: user.username,
          password: user.password,
          name: user.name,
          role: user.role || "student",
          registered_date: user.registeredDate || new Date().toISOString().split('T')[0],
          enrolled_courses: user.enrolledCourses || [],
          enrolled_batches: user.enrolledBatches || {},
          wishlist: user.wishlist || [],
          author_bio: user.authorBio || "",
          assigned_courses: user.assignedCourses || [],
          suspended: user.suspended === true,
          deleted: user.deleted === true,
          phone: user.phone || ""
        });
      });
    } else if (key === "cubaze_batches") {
      value.forEach(batch => {
        this.pushToSupabase("cubaze_batches", {
          id: batch.id,
          name: batch.name,
          course_id: batch.courseId,
          tutor_ids: batch.tutorIds || [],
          max_students: batch.maxStudents || 50,
          start_date: batch.startDate || null,
          end_date: batch.endDate || null,
          class_days: batch.classDays || [],
          class_time: batch.classTime || '',
          google_meet_link: batch.googleMeetLink || '',
          google_drive_folder: batch.googleDriveFolder || '',
          status: batch.status || 'Upcoming'
        });
      });
    } else if (key === "cubaze_announcements") {
      value.forEach(a => {
        this.pushToSupabase("cubaze_announcements", {
          id: a.id,
          course_id: a.courseId || null,
          batch_id: a.batchId || null,
          title: a.title,
          content: a.content,
          created_by: a.createdBy,
          created_at: a.createdAt
        });
      });
    } else if (key === "cubaze_assignments") {
      value.forEach(a => {
        this.pushToSupabase("cubaze_assignments", {
          id: a.id,
          course_id: a.courseId || null,
          batch_id: a.batchId || null,
          title: a.title,
          description: a.description,
          due_date: a.dueDate || null,
          max_points: a.maxPoints || 100,
          created_by: a.createdBy,
          created_at: a.createdAt
        });
      });
    } else if (key === "cubaze_resources") {
      value.forEach(r => {
        this.pushToSupabase("cubaze_resources", {
          id: r.id,
          course_id: r.courseId || null,
          batch_id: r.batchId || null,
          title: r.title,
          url: r.url,
          created_by: r.createdBy,
          created_at: r.createdAt
        });
      });
    } else if (key === "cubaze_attendance") {
      value.forEach(a => {
        this.pushToSupabase("cubaze_attendance", {
          id: a.id,
          batch_id: a.batchId,
          username: a.username,
          class_date: a.classDate,
          status: a.status,
          join_time: a.joinTime
        });
      });
    } else if (key === "cubaze_transactions") {
      value.forEach(txn => {
        this.pushToSupabase("cubaze_transactions", {
          id: txn.id,
          username: txn.username,
          course_id: txn.courseId,
          course_title: txn.courseTitle || "",
          amount: txn.amount,
          status: txn.status || "PENDING",
          payment_method: txn.paymentMethod || "",
          timestamp: txn.timestamp || new Date().toISOString(),
          admin_status: txn.adminStatus || "PENDING",
          invoice_number: txn.invoiceNumber || ""
        });
      });
    } else if (key === "cubaze_progress") {
      Object.keys(value).forEach(uname => {
        Object.keys(value[uname]).forEach(cid => {
          const prog = value[uname][cid];
          this.pushToSupabase("cubaze_progress", {
            id: `${uname}_${cid}`,
            username: uname,
            course_id: cid,
            completed_lessons: prog.completedLessons || [],
            quiz_score: prog.quizScore,
            certificate_earned: prog.certificateEarned === true
          });
        });
      });
    } else if (key === "cubaze_activity_log") {
      value.forEach(act => {
        this.pushToSupabase("cubaze_activity_log", {
          id: act.id,
          actor: act.actor,
          action: act.action,
          resource_type: act.resourceType,
          resource_id: act.resourceId,
          details: act.details || "",
        });
      });
    } else if (key === "cubaze_posters") {
      value.forEach(p => {
        this.pushToSupabase("cubaze_posters", {
          id: p.id,
          title: p.title,
          image: p.image || "",
          type: p.type || "General",
          short_description: p.shortDescription || "",
          event_date: p.eventDate || "",
          button_text: p.buttonText || "",
          button_link: p.buttonLink || "",
          publish_start_date: p.publishStartDate || "",
          publish_end_date: p.publishEndDate || "",
          target_audience: p.targetAudience || "Everyone",
          status: p.status || "Draft",
          created_at: p.createdAt || new Date().toISOString(),
          updated_at: p.updatedAt || new Date().toISOString()
        });
      });
    }
  }


  init() {
    // ── App version stamp: bump this string any time you want a forced clean reset ──
    const APP_VERSION = "v4.3-common-meetings";
    const storedVersion = localStorage.getItem("cubaze_app_version");

    // Force reset if course IDs have changed OR version mismatch
    const storedCourses = localStorage.getItem("cubaze_courses");
    let needsReset = storedVersion !== APP_VERSION;
    if (!needsReset && storedCourses) {
      const parsed = JSON.parse(storedCourses);
      if (!parsed.some(c => c.id === "blender-premium")) needsReset = true;
    }
    if (!localStorage.getItem("cubaze_users")) needsReset = true;
    if (!localStorage.getItem("cubaze_blog")) needsReset = true;

    if (needsReset) {
      localStorage.removeItem("cubaze_courses");
      localStorage.removeItem("cubaze_users");
      localStorage.removeItem("cubaze_transactions");
      localStorage.removeItem("cubaze_progress");
      localStorage.removeItem("cubaze_submitted_courses");
      localStorage.removeItem("cubaze_activity_log");
      localStorage.setItem("cubaze_app_version", APP_VERSION);
    }

    if (!localStorage.getItem("cubaze_courses")) localStorage.setItem("cubaze_courses", JSON.stringify(DEFAULT_COURSES));
    if (!localStorage.getItem("cubaze_users")) localStorage.setItem("cubaze_users", JSON.stringify(DEFAULT_USERS));
    if (!localStorage.getItem("cubaze_transactions")) localStorage.setItem("cubaze_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
    if (!localStorage.getItem("cubaze_progress")) localStorage.setItem("cubaze_progress", JSON.stringify(DEFAULT_PROGRESS));
    if (!localStorage.getItem("cubaze_submitted_courses")) localStorage.setItem("cubaze_submitted_courses", JSON.stringify([]));
    if (!localStorage.getItem("cubaze_blog")) localStorage.setItem("cubaze_blog", JSON.stringify(DEFAULT_BLOG_POSTS));
    if (!localStorage.getItem("cubaze_coupons")) localStorage.setItem("cubaze_coupons", JSON.stringify(DEFAULT_COUPONS));
    if (!localStorage.getItem("cubaze_live_classes")) localStorage.setItem("cubaze_live_classes", JSON.stringify(DEFAULT_LIVE_CLASSES));
    if (!localStorage.getItem("cubaze_notifications")) localStorage.setItem("cubaze_notifications", JSON.stringify([]));
    if (!localStorage.getItem("cubaze_wishlist")) localStorage.setItem("cubaze_wishlist", JSON.stringify({}));
    if (!localStorage.getItem("cubaze_dark_mode")) localStorage.setItem("cubaze_dark_mode", "false");

    // Initialize Batch System tables in LocalStorage
    if (!localStorage.getItem("cubaze_batches")) localStorage.setItem("cubaze_batches", JSON.stringify(DEFAULT_BATCHES));
    if (!localStorage.getItem("cubaze_announcements")) localStorage.setItem("cubaze_announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    if (!localStorage.getItem("cubaze_assignments")) localStorage.setItem("cubaze_assignments", JSON.stringify(DEFAULT_ASSIGNMENTS));
    if (!localStorage.getItem("cubaze_resources")) localStorage.setItem("cubaze_resources", JSON.stringify(DEFAULT_RESOURCES));
    if (!localStorage.getItem("cubaze_attendance")) localStorage.setItem("cubaze_attendance", JSON.stringify(DEFAULT_ATTENDANCE));
    if (!localStorage.getItem("cubaze_common_meetings")) localStorage.setItem("cubaze_common_meetings", JSON.stringify(DEFAULT_COMMON_MEETINGS));

    // Migrate legacy users without enrolledBatches
    const currentUsers = JSON.parse(localStorage.getItem("cubaze_users") || "[]");
    let migrated = false;
    const currentBatches = JSON.parse(localStorage.getItem("cubaze_batches") || "[]");
    
    currentUsers.forEach(u => {
      if (u.role === 'student' && u.enrolledCourses && u.enrolledCourses.length > 0) {
        if (!u.enrolledBatches) {
          u.enrolledBatches = {};
          migrated = true;
        }
        u.enrolledCourses.forEach(cid => {
          if (!u.enrolledBatches[cid]) {
            // Find first batch of this course
            let batch = currentBatches.find(b => b.courseId === cid);
            if (!batch) {
              // Create default batch
              batch = {
                id: `B-${cid.substring(0,4).toUpperCase()}-LEGACY`,
                name: `Legacy Batch - ${cid}`,
                courseId: cid,
                tutorIds: ["sinanmp"],
                maxStudents: 100,
                currentEnrollment: 1,
                startDate: "2026-01-01",
                endDate: "2026-12-31",
                classDays: ["Mon", "Wed"],
                classTime: "18:00 - 19:30",
                googleMeetLink: "https://meet.google.com/abc-defg-hij",
                googleDriveFolder: "",
                status: "Active"
              };
              currentBatches.push(batch);
              localStorage.setItem("cubaze_batches", JSON.stringify(currentBatches));
            }
            u.enrolledBatches[cid] = batch.id;
            migrated = true;
          }
        });
      }
    });
    
    if (migrated) {
      localStorage.setItem("cubaze_users", JSON.stringify(currentUsers));
    }

    // ── Sanitize: remove any leftover demo users (keep only admin + real registrations) ──
    const DEMO_USERNAMES = ["student", "riya_learns", "vikas_edit", "alex_j", "demo_user"];
    const currentUsersRaw = JSON.parse(localStorage.getItem("cubaze_users") || "[]");
    const cleanUsers = currentUsersRaw.filter(u => !DEMO_USERNAMES.includes(u.username));
    if (cleanUsers.length !== currentUsersRaw.length) {
      localStorage.setItem("cubaze_users", JSON.stringify(cleanUsers));
    }
  }

  // --- COURSES ---
  getCourses() {
    const courses = JSON.parse(localStorage.getItem("cubaze_courses")) || [];
    const users = JSON.parse(localStorage.getItem("cubaze_users")) || [];
    const enrollmentCounts = {};
    users.forEach(u => {
      if (u.enrolledCourses && Array.isArray(u.enrolledCourses)) {
        u.enrolledCourses.forEach(cid => {
          enrollmentCounts[cid] = (enrollmentCounts[cid] || 0) + 1;
        });
      }
    });
    return courses.map(c => ({
      ...c,
      studentsCount: enrollmentCounts[c.id] || 0
    }));
  }
  getCourseById(id) { return this.getCourses().find(c => c.id === id); }

  saveCourse(courseData) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === courseData.id);
    if (!courseData.reviews) courseData.reviews = [];
    if (!courseData.author) courseData.author = "sinanmp";
    if (index > -1) { courses[index] = { ...courses[index], ...courseData }; }
    else { courses.push(courseData); }
    this.setItemAndSync("cubaze_courses", courses);
    return courseData;
  }

  deleteCourse(id) {
    const courses = this.getCourses().filter(c => c.id !== id);
    this.setItemAndSync("cubaze_courses", courses);
    return true;
  }

  addCourseReview(courseId, username, name, rating, comment) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index > -1) {
      if (!courses[index].reviews) courses[index].reviews = [];
      const existing = courses[index].reviews.find(r => r.username === username);
      if (existing) return { success: false, error: "You have already reviewed this course." };
      courses[index].reviews.unshift({ username, name, rating: parseFloat(rating), comment: comment.trim(), date: new Date().toISOString().split('T')[0] });
      const sum = courses[index].reviews.reduce((acc, r) => acc + r.rating, 0);
      courses[index].rating = parseFloat((sum / courses[index].reviews.length).toFixed(1));
      this.setItemAndSync("cubaze_courses", courses);
      return { success: true };
    }
    return { success: false, error: "Course not found." };
  }

  // --- BLOG ---
  getBlogPosts() { return JSON.parse(localStorage.getItem("cubaze_blog")) || []; }
  getBlogPostById(id) { return this.getBlogPosts().find(p => p.id === id); }
  getBlogByCategory(cat) {
    const posts = this.getBlogPosts();
    return cat === "All" ? posts : posts.filter(p => p.category === cat);
  }

  // --- FAQ ---
  getFAQ() { return DEFAULT_FAQ; }

  // --- TESTIMONIALS ---
  getTestimonials() { return DEFAULT_TESTIMONIALS; }

  // --- USERS ---
  getUsers() { return JSON.parse(localStorage.getItem("cubaze_users")) || []; }

  registerUser(username, password, name, role = "student", phone = "") {
    const users = this.getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return { success: false, error: "Username already exists." };
    const newUser = { username: username.trim(), password, name: name.trim(), role, registeredDate: new Date().toISOString().split('T')[0], enrolledCourses: [], wishlist: [], phone: phone.trim() };
    users.push(newUser);
    this.setItemAndSync("cubaze_users", users);
    return { success: true, user: newUser };
  }

  loginUser(username, password) {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password);
    if (user) {
      localStorage.setItem("cubaze_current_user", JSON.stringify(user));
      this.initSupabase();
      return { success: true, user };
    }
    return { success: false, error: "Invalid username or password." };
  }

  getCurrentUser() { return JSON.parse(localStorage.getItem("cubaze_current_user")) || null; }

  setCurrentUser(user) {
    if (user) localStorage.setItem("cubaze_current_user", JSON.stringify(user));
    else localStorage.removeItem("cubaze_current_user");
    this.initSupabase();
  }

  logout() {
    localStorage.removeItem("cubaze_current_user");
    this.initSupabase();
  }

  updateUser(username, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username === username);
    if (index > -1) {
      users[index] = { ...users[index], ...updates };
      this.setItemAndSync("cubaze_users", users);
      const cu = this.getCurrentUser();
      if (cu && cu.username === username) this.setCurrentUser(users[index]);
      return { success: true };
    }
    return { success: false };
  }

  enrollUserInCourse(username, courseId) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (index > -1) {
      if (!users[index].enrolledCourses) users[index].enrolledCourses = [];
      if (!users[index].enrolledCourses.includes(courseId)) {
        users[index].enrolledCourses.push(courseId);
        this.setItemAndSync("cubaze_users", users);
        const cu = this.getCurrentUser();
        if (cu && cu.username.toLowerCase() === username.toLowerCase()) {
          cu.enrolledCourses = users[index].enrolledCourses;
          this.setCurrentUser(cu);
        }
      }
    }
  }

  // --- WISHLIST ---
  getWishlist(username) {
    const user = this.getUsers().find(u => u.username === username);
    return user ? (user.wishlist || []) : [];
  }

  toggleWishlist(username, courseId) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username === username);
    if (index > -1) {
      if (!users[index].wishlist) users[index].wishlist = [];
      const wIdx = users[index].wishlist.indexOf(courseId);
      if (wIdx > -1) users[index].wishlist.splice(wIdx, 1);
      else users[index].wishlist.push(courseId);
      this.setItemAndSync("cubaze_users", users);
      const cu = this.getCurrentUser();
      if (cu && cu.username === username) { cu.wishlist = users[index].wishlist; this.setCurrentUser(cu); }
      return wIdx === -1; // true = added, false = removed
    }
    return false;
  }

  // --- COUPONS ---
  getCoupons() { return JSON.parse(localStorage.getItem("cubaze_coupons")) || []; }

  deleteCoupon(code) {
    let coupons = this.getCoupons();
    const initialLen = coupons.length;
    const target = String(code).trim().toUpperCase();
    coupons = coupons.filter(c => String(c.code).trim().toUpperCase() !== target);
    if (coupons.length < initialLen) {
      this.setItemAndSync("cubaze_coupons", coupons);
      return true;
    }
    return false;
  }

  saveCoupon(coupon) {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex(c => String(c.code).trim().toUpperCase() === String(coupon.code).trim().toUpperCase());
    if (idx > -1) {
      coupons[idx] = { ...coupons[idx], ...coupon };
    } else {
      coupons.push(coupon);
    }
    this.setItemAndSync("cubaze_coupons", coupons);
    return true;
  }

  validateCoupon(code, originalPrice) {
    const coupon = this.getCoupons().find(c => c.code === code.toUpperCase() && c.active);
    if (!coupon) return { valid: false, error: "Invalid or expired coupon code." };
    const discount = coupon.type === "percentage" ? Math.round(originalPrice * coupon.discount / 100) : coupon.discount;
    const finalPrice = Math.max(0, originalPrice - discount);
    return { valid: true, discount, finalPrice, coupon };
  }

  // --- LIVE CLASSES ---
  getLiveClasses() { return JSON.parse(localStorage.getItem("cubaze_live_classes")) || []; }

  getLiveClassById(id) {
    return this.getLiveClasses().find(lc => lc.id === id);
  }

  saveLiveClass(liveClass) {
    const classes = this.getLiveClasses();
    const now = new Date().toISOString();
    if (liveClass.id) {
      const idx = classes.findIndex(lc => lc.id === liveClass.id);
      if (idx > -1) {
        classes[idx] = { ...classes[idx], ...liveClass, updated_at: now };
      } else {
        return false;
      }
    } else {
      liveClass.id = "LC_" + Math.floor(100000 + Math.random() * 900000);
      liveClass.created_at = now;
      liveClass.updated_at = now;
      classes.push(liveClass);
    }
    this.setItemAndSync("cubaze_live_classes", classes);
    this.addActivity(liveClass.tutor_id || "admin", "SAVE_LIVE_CLASS", "live_class", liveClass.id, liveClass.title);
    return liveClass;
  }

  deleteLiveClass(id) {
    let classes = this.getLiveClasses();
    const initialLen = classes.length;
    classes = classes.filter(lc => lc.id !== id);
    if (classes.length < initialLen) {
      this.setItemAndSync("cubaze_live_classes", classes);
      this.addActivity("admin", "DELETED_LIVE_CLASS", "live_class", id, `Class ID: ${id}`);
      return true;
    }
    return false;
  }

  getAttendanceReport(classId) {
    const liveClass = this.getLiveClassById(classId);
    if (!liveClass) return [];
    
    // Find all users enrolled in the course
    const users = this.getUsers().filter(u => u.role === 'student' && (u.enrolledCourses || []).includes(liveClass.course_id));
    
    // Generate deterministic mock attendance based on username
    return users.map((u, i) => {
      const hash = (u.username.length + i) % 10;
      let status = "PRESENT";
      let joinTime = liveClass.start_time;
      if (hash === 2) {
        status = "LATE";
        const parts = liveClass.start_time.split(':');
        const min = parseInt(parts[1] || '0') + 12;
        joinTime = `${parts[0]}:${min < 10 ? '0' + min : min}`;
      } else if (hash === 5) {
        status = "ABSENT";
        joinTime = "—";
      }
      return {
        username: u.username,
        name: u.name,
        email: u.email || `${u.username}@cubaze.edu`,
        status,
        joinTime
      };
    });
  }

  // --- TRANSACTIONS ---
  getTransactions() { return JSON.parse(localStorage.getItem("cubaze_transactions")) || []; }

  addTransaction(username, courseId, amount, paymentMethod, status = "SUCCESS") {
    const transactions = this.getTransactions();
    const course = this.getCourseById(courseId);
    const txnId = "TXN_PHPE_" + Math.floor(100000000 + Math.random() * 900000000);
    const newTxn = { id: txnId, username, courseId, courseTitle: course ? course.title : "Unknown", amount, status, paymentMethod, timestamp: new Date().toISOString() };
    transactions.unshift(newTxn);
    this.setItemAndSync("cubaze_transactions", transactions);
    if (status === "SUCCESS") {
      this.handleAutomaticEnrollment(username, courseId);
    }
    return newTxn;
  }

  getInstructorEarnings(instructorUsername) {
    const transactions = this.getTransactions().filter(t => t.status === "SUCCESS");
    const courses = this.getCourses();
    let totalSales = 0, enrollmentCount = 0;
    transactions.forEach(t => {
      const course = courses.find(c => c.id === t.courseId);
      if (course && course.author === instructorUsername) { totalSales += t.amount; enrollmentCount++; }
    });
    return { grossSales: totalSales, instructorShare: Math.round(totalSales * 0.70), enrollmentCount };
  }

  getAdminAnalytics() {
    const txns = this.getTransactions().filter(t => t.status === "SUCCESS");
    const users = this.getUsers();
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = txns.filter(t => t.timestamp.startsWith(today)).reduce((s, t) => s + t.amount, 0);
    const monthRevenue = txns.reduce((s, t) => s + t.amount, 0);
    const students = users.filter(u => u.role === "student");
    const activeStudents = students.filter(u => u.enrolledCourses && u.enrolledCourses.length > 0);

    // Most popular course
    const courseEnrollments = {};
    txns.forEach(t => { courseEnrollments[t.courseId] = (courseEnrollments[t.courseId] || 0) + 1; });
    const popularCourseId = Object.keys(courseEnrollments).sort((a, b) => courseEnrollments[b] - courseEnrollments[a])[0];
    const popularCourse = popularCourseId ? this.getCourseById(popularCourseId) : null;

    return {
      todayRevenue, monthRevenue,
      totalStudents: students.length,
      activeStudents: activeStudents.length,
      totalCourses: this.getCourses().length,
      totalTransactions: txns.length,
      popularCourse: popularCourse ? popularCourse.title : "N/A",
      recentTransactions: txns.slice(0, 5)
    };
  }

  // --- PROGRESS ---
  getProgress() { return JSON.parse(localStorage.getItem("cubaze_progress")) || {}; }

  getUserProgress(username, courseId) {
    const progress = this.getProgress();
    if (!progress[username]) progress[username] = {};
    if (!progress[username][courseId]) {
      progress[username][courseId] = { completedLessons: [], quizScore: null, certificateEarned: false };
      this.setItemAndSync("cubaze_progress", progress);
    }
    return progress[username][courseId];
  }

  toggleLessonProgress(username, courseId, lessonId) {
    const progress = this.getProgress();
    if (!progress[username]) progress[username] = {};
    if (!progress[username][courseId]) progress[username][courseId] = { completedLessons: [], quizScore: null, certificateEarned: false };
    const completed = progress[username][courseId].completedLessons;
    const index = completed.indexOf(lessonId);
    if (index > -1) completed.splice(index, 1);
    else completed.push(lessonId);
    this.setItemAndSync("cubaze_progress", progress);
    return progress[username][courseId];
  }

  saveQuizProgress(username, courseId, score, passed) {
    const progress = this.getProgress();
    if (!progress[username]) progress[username] = {};
    if (!progress[username][courseId]) progress[username][courseId] = { completedLessons: [], quizScore: null, certificateEarned: false };
    progress[username][courseId].quizScore = score;
    if (passed) progress[username][courseId].certificateEarned = true;
    this.setItemAndSync("cubaze_progress", progress);
    return progress[username][courseId];
  }

  // --- SUBMISSIONS ---
  getSubmittedCourses() { return JSON.parse(localStorage.getItem("cubaze_submitted_courses")) || []; }

  submitCourseForReview(authorUsername, courseObj) {
    const submissions = this.getSubmittedCourses();
    const newSub = { ...courseObj, author: authorUsername, status: "PENDING", submittedDate: new Date().toISOString().split('T')[0] };
    submissions.push(newSub);
    this.setItemAndSync("cubaze_submitted_courses", submissions);
    return newSub;
  }

  approveCourse(subId) {
    const submissions = this.getSubmittedCourses();
    const index = submissions.findIndex(s => s.id === subId);
    if (index > -1) {
      submissions[index].status = "APPROVED";
      this.setItemAndSync("cubaze_submitted_courses", submissions);
      const courseCopy = { ...submissions[index], rating: 4.8, lessonsCount: 4, reviews: [], modules: [{ id: submissions[index].id + "-m1", title: "Module 1: Orientation", lessons: [{ id: submissions[index].id + "-l1", title: "General Orientation", duration: "12:10" }] }], quiz: { questions: [] } };
      delete courseCopy.status; delete courseCopy.submittedDate;
      this.saveCourse(courseCopy);
      return { success: true, course: courseCopy };
    }
    return { success: false };
  }

  rejectCourse(subId) {
    const submissions = this.getSubmittedCourses();
    const index = submissions.findIndex(s => s.id === subId);
    if (index > -1) { submissions[index].status = "REJECTED"; this.setItemAndSync("cubaze_submitted_courses", submissions); return true; }
    return false;
  }

  // --- DARK MODE ---
  getDarkMode() { return localStorage.getItem("cubaze_dark_mode") === "true"; }
  setDarkMode(val) { localStorage.setItem("cubaze_dark_mode", val.toString()); }

  // --- CONVENIENCE ALIASES ---
  login(username, password) { return this.loginUser(username, password); }
  register(name, username, password, phone = "") { return this.registerUser(username, password, name, "student", phone); }

  // --- TUTORS MANAGEMENT BY ADMIN ---
  addTutor(username, password, name, bio = "", assignedCourseIds = []) {
    const users = this.getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Username already exists." };
    }
    const newTutor = {
      username: username.trim(),
      password: password,
      name: name.trim(),
      role: "instructor",
      authorBio: bio.trim(),
      registeredDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [],
      assignedCourses: assignedCourseIds  // Courses admin assigned to this tutor
    };
    users.push(newTutor);
    this.setItemAndSync("cubaze_users", users);
    return { success: true, user: newTutor };
  }

  // Get the courses assigned to a specific tutor by admin
  getTutorAssignedCourses(username) {
    const users = this.getUsers();
    const tutor = users.find(u => u.username === username);
    if (!tutor || !tutor.assignedCourses || tutor.assignedCourses.length === 0) return [];
    const allCourses = this.getCourses();
    return allCourses.filter(c => tutor.assignedCourses.includes(c.id));
  }

  // Admin updates a tutor's assigned courses
  updateTutorCourseAssignments(username, courseIds = []) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "Tutor not found." };
    users[idx].assignedCourses = courseIds;
    this.setItemAndSync("cubaze_users", users);
    return { success: true };
  }

  // Admin updates a student's enrolled courses (assignments)
  updateStudentCourseEnrollments(username, courseIds = []) {
    const users = this.getUsers();
    const student = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!student) return { success: false, error: "Student not found." };
    
    const currentEnrolled = student.enrolledCourses || [];
    const currentBatches = student.enrolledBatches || {};

    // Find courses to add
    const toAdd = courseIds.filter(cid => !currentEnrolled.includes(cid));
    // Find courses to remove
    const toRemove = currentEnrolled.filter(cid => !courseIds.includes(cid));

    // Perform removal first
    for (const cid of toRemove) {
      const batchId = currentBatches[cid];
      this.unenrollUserFromBatch(username, cid, batchId);
    }

    // Perform enrollment
    for (const cid of toAdd) {
      this.handleAutomaticEnrollment(username, cid);
    }

    return { success: true };
  }

  // --- DELETE LESSON FROM COURSE MODULE ---
  deleteLessonFromCourseModule(courseId, lessonId) {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return { success: false, error: "Course not found." };
    const course = courses[courseIndex];
    let deleted = false;
    course.modules.forEach(mod => {
      const lesIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lesIdx > -1) { mod.lessons.splice(lesIdx, 1); deleted = true; }
    });
    if (!deleted) return { success: false, error: "Lesson not found." };
    let totalLessons = 0;
    course.modules.forEach(m => { totalLessons += m.lessons.length; });
    course.lessonsCount = totalLessons;
    courses[courseIndex] = course;
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true };
  }

  // --- UPDATE LESSON IN COURSE MODULE ---
  updateLessonInCourseModule(courseId, modIdx, lessonId, updates) {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return { success: false, error: "Course not found." };
    const course = courses[courseIndex];
    if (!course.modules || !course.modules[modIdx]) return { success: false, error: "Module not found." };
    const lesIdx = course.modules[modIdx].lessons.findIndex(l => l.id === lessonId);
    if (lesIdx === -1) return { success: false, error: "Lesson not found." };
    
    course.modules[modIdx].lessons[lesIdx] = { 
      ...course.modules[modIdx].lessons[lesIdx], 
      ...updates 
    };
    
    courses[courseIndex] = course;
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true };
  }

  // ============================================================
  // PAYMENT ADMIN STATUS MANAGEMENT
  // ============================================================
  updatePaymentAdminStatus(txnId, newStatus) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { success: false, error: "Transaction not found." };
    const txn = txns[idx];
    const prevStatus = txn.adminStatus || "PENDING";
    txn.adminStatus = newStatus; // PENDING | APPROVED | DENIED
    txn.adminUpdatedAt = new Date().toISOString();
    if (newStatus === "APPROVED") {
      txn.status = "SUCCESS";
      if (!txn.invoiceNumber) txn.invoiceNumber = "INV-" + Date.now();
      // Auto-enroll student
      const users = this.getUsers();
      const uIdx = users.findIndex(u => u.username === txn.username);
      if (uIdx > -1) {
        if (!users[uIdx].enrolledBatches || !users[uIdx].enrolledBatches[txn.courseId]) {
          this.handleAutomaticEnrollment(txn.username, txn.courseId);
        } else {
          // Fallback: make sure they are in enrolledCourses
          if (!users[uIdx].enrolledCourses) users[uIdx].enrolledCourses = [];
          if (!users[uIdx].enrolledCourses.includes(txn.courseId)) {
            users[uIdx].enrolledCourses.push(txn.courseId);
            this.setItemAndSync("cubaze_users", users);
          }
        }
      }
      this.addActivity("admin", "APPROVED_PAYMENT", "transaction", txnId, `₹${txn.amount} for ${txn.courseTitle} — ${txn.username}`);
    } else if (newStatus === "DENIED") {
      txn.status = "FAILED";
      // Remove enrollment if was previously approved
      if (prevStatus === "APPROVED") {
        const users = this.getUsers();
        const uIdx = users.findIndex(u => u.username === txn.username);
        if (uIdx > -1 && users[uIdx].enrolledCourses) {
          users[uIdx].enrolledCourses = users[uIdx].enrolledCourses.filter(cId => cId !== txn.courseId);
          this.setItemAndSync("cubaze_users", users);
        }
      }
      this.addActivity("admin", "DENIED_PAYMENT", "transaction", txnId, `₹${txn.amount} for ${txn.courseTitle} — ${txn.username}`);
    } else {
      txn.status = "PENDING";
      this.addActivity("admin", "PENDING_PAYMENT", "transaction", txnId, `₹${txn.amount} for ${txn.courseTitle}`);
    }
    txns[idx] = txn;
    this.setItemAndSync("cubaze_transactions", txns);
    return { success: true, transaction: txn };
  }

  // ============================================================
  // COURSE CRUD (ADMIN)
  // ============================================================
  createAdminCourse(courseData) {
    const courses = this.getCourses();
    const id = courseData.id || "course-" + Date.now();
    const newCourse = {
      id, title: courseData.title || "Untitled Course",
      shortDescription: courseData.shortDescription || "",
      description: courseData.description || "",
      price: parseInt(courseData.price) || 0,
      badge: courseData.badge || "New", badgeColor: courseData.badgeColor || "#3D46D8",
      level: courseData.level || "Beginner", language: courseData.language || "Malayalam + English",
      studentsCount: 0, duration: courseData.duration || "1 Hour",
      lessonsCount: 0, rating: 4.5,
      author: courseData.author || "admin", authorName: courseData.authorName || "Cubaze Academy",
      authorBio: courseData.authorBio || "", image: courseData.image || "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600",
      previewVideo: courseData.previewVideo || "",
      requirements: courseData.requirements || [], projects: [], reviews: [],
      modules: courseData.modules || [{ id: id + "-m1", title: "Module 1: Introduction", lessons: [] }],
      quiz: { questions: [] }, published: false, archived: false,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      category: courseData.category || "General"
    };
    courses.push(newCourse);
    this.setItemAndSync("cubaze_courses", courses);
    this.addActivity("admin", "CREATED_COURSE", "course", id, newCourse.title);
    return { success: true, course: newCourse };
  }

  updateCourse(courseId, updates) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx === -1) return { success: false, error: "Course not found." };
    courses[idx] = { ...courses[idx], ...updates, updatedDate: new Date().toISOString().split('T')[0] };
    this.setItemAndSync("cubaze_courses", courses);
    this.addActivity("admin", "UPDATED_COURSE", "course", courseId, courses[idx].title);
    return { success: true, course: courses[idx] };
  }

  duplicateCourse(courseId) {
    const courses = this.getCourses();
    const orig = courses.find(c => c.id === courseId);
    if (!orig) return { success: false, error: "Course not found." };
    const newId = "course-copy-" + Date.now();
    const copy = {
      ...JSON.parse(JSON.stringify(orig)), id: newId,
      title: "Copy of " + orig.title, studentsCount: 0, rating: 4.5,
      reviews: [], published: false, archived: false,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    // Re-ID modules and lessons
    copy.modules = (orig.modules || []).map((mod, mi) => ({
      ...mod, id: newId + "-m" + mi,
      lessons: (mod.lessons || []).map((les, li) => ({ ...les, id: newId + "-m" + mi + "-l" + li }))
    }));
    courses.push(copy);
    this.setItemAndSync("cubaze_courses", courses);
    this.addActivity("admin", "DUPLICATED_COURSE", "course", newId, copy.title);
    return { success: true, course: copy };
  }

  publishCourse(courseId) {
    const res = this.updateCourse(courseId, { published: true, archived: false });
    if (res.success) this.addActivity("admin", "PUBLISHED_COURSE", "course", courseId, res.course.title);
    return res;
  }

  unpublishCourse(courseId) {
    const res = this.updateCourse(courseId, { published: false });
    if (res.success) this.addActivity("admin", "UNPUBLISHED_COURSE", "course", courseId, res.course.title);
    return res;
  }

  archiveCourse(courseId) {
    const res = this.updateCourse(courseId, { archived: true, published: false });
    if (res.success) this.addActivity("admin", "ARCHIVED_COURSE", "course", courseId, res.course.title);
    return res;
  }

  restoreCourse(courseId) {
    const res = this.updateCourse(courseId, { archived: false });
    if (res.success) this.addActivity("admin", "RESTORED_COURSE", "course", courseId, res.course.title);
    return res;
  }

  addCourseModule(courseId, moduleTitle) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx === -1) return { success: false, error: "Course not found." };
    const modId = courseId + "-m" + Date.now();
    const newMod = { id: modId, title: moduleTitle || "New Module", lessons: [] };
    if (!courses[idx].modules) courses[idx].modules = [];
    courses[idx].modules.push(newMod);
    courses[idx].updatedDate = new Date().toISOString().split('T')[0];
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true, module: newMod };
  }

  deleteCourseModule(courseId, moduleIdx) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx === -1) return { success: false, error: "Course not found." };
    if (!courses[idx].modules || !courses[idx].modules[moduleIdx]) return { success: false, error: "Module not found." };
    courses[idx].modules.splice(moduleIdx, 1);
    let total = 0; courses[idx].modules.forEach(m => { total += (m.lessons || []).length; });
    courses[idx].lessonsCount = total;
    courses[idx].updatedDate = new Date().toISOString().split('T')[0];
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true };
  }

  updateCourseModule(courseId, moduleIdx, newTitle) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === courseId);
    if (idx === -1) return { success: false, error: "Course not found." };
    if (!courses[idx].modules || !courses[idx].modules[moduleIdx]) return { success: false, error: "Module not found." };
    courses[idx].modules[moduleIdx].title = newTitle;
    courses[idx].updatedDate = new Date().toISOString().split('T')[0];
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true };
  }

  // ============================================================
  // USER MANAGEMENT (ADMIN)
  // ============================================================
  suspendUser(username) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "User not found." };
    users[idx].suspended = true;
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "SUSPENDED_USER", "user", username, users[idx].name);
    return { success: true };
  }

  activateUser(username) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "User not found." };
    users[idx].suspended = false;
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "ACTIVATED_USER", "user", username, users[idx].name);
    return { success: true };
  }

  deleteUser(username) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "User not found." };
    const name = users[idx].name;
    users[idx].deleted = true;
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "DELETED_USER", "user", username, name);
    return { success: true };
  }

  resetUserPassword(username, newPassword) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "User not found." };
    users[idx].password = newPassword;
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "RESET_PASSWORD", "user", username, users[idx].name);
    return { success: true };
  }

  updateUser(username, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "User not found." };
    users[idx] = { ...users[idx], ...updates };
    this.setItemAndSync("cubaze_users", users);
    return { success: true, user: users[idx] };
  }

  // ============================================================
  // ACTIVITY LOG
  // ============================================================
  addActivity(actor, action, resourceType, resourceId, details = "") {
    const log = this.getActivities();
    log.unshift({ id: Date.now(), actor, action, resourceType, resourceId, details, timestamp: new Date().toISOString() });
    // Keep last 200 entries
    this.setItemAndSync("cubaze_activity_log", log.slice(0, 200));
  }

  getActivities() { return JSON.parse(localStorage.getItem("cubaze_activity_log")) || []; }

  // ============================================================
  // UPDATED ANALYTICS (includes tutors, payment statuses)
  // ============================================================
  getAdminAnalytics() {
    const allTxns = this.getTransactions();
    const approvedTxns = allTxns.filter(t => (t.adminStatus || "APPROVED") === "APPROVED" && t.status === "SUCCESS");
    const pendingTxns = allTxns.filter(t => (t.adminStatus || "APPROVED") === "PENDING" || t.status === "PENDING");
    const deniedTxns = allTxns.filter(t => (t.adminStatus || "APPROVED") === "DENIED");
    const users = this.getUsers().filter(u => !u.deleted);
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = approvedTxns.filter(t => t.timestamp.startsWith(today)).reduce((s, t) => s + t.amount, 0);
    const monthRevenue = approvedTxns.reduce((s, t) => s + t.amount, 0);
    const students = users.filter(u => u.role === "student");
    const tutors = users.filter(u => u.role === "instructor");
    const activeStudents = students.filter(u => u.enrolledCourses && u.enrolledCourses.length > 0);
    const courseEnrollments = {};
    approvedTxns.forEach(t => { courseEnrollments[t.courseId] = (courseEnrollments[t.courseId] || 0) + 1; });
    const popularCourseId = Object.keys(courseEnrollments).sort((a, b) => courseEnrollments[b] - courseEnrollments[a])[0];
    const popularCourse = popularCourseId ? this.getCourseById(popularCourseId) : null;
    return {
      todayRevenue, monthRevenue,
      totalStudents: students.length, activeStudents: activeStudents.length,
      totalTutors: tutors.length,
      totalCourses: this.getCourses().filter(c => !c.archived).length,
      publishedCourses: this.getCourses().filter(c => c.published && !c.archived).length,
      totalTransactions: approvedTxns.length,
      pendingPayments: pendingTxns.length,
      approvedPayments: approvedTxns.length,
      deniedPayments: deniedTxns.length,
      popularCourse: popularCourse ? popularCourse.title : "N/A",
      recentTransactions: allTxns.slice(0, 8)
    };
  }

  // --- DARK MODE ---
  getDarkMode() { return localStorage.getItem("cubaze_dark_mode") === "true"; }
  setDarkMode(val) { localStorage.setItem("cubaze_dark_mode", val.toString()); }

  // --- CONVENIENCE ALIASES ---
  login(username, password) { return this.loginUser(username, password); }
  register(name, username, password, phone = "") { return this.registerUser(username, password, name, "student", phone); }

  // --- TUTORS MANAGEMENT BY ADMIN ---
  addTutor(username, password, name, bio = "", assignedCourseIds = []) {
    const users = this.getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Username already exists." };
    }
    const newTutor = {
      username: username.trim(), password: password, name: name.trim(),
      role: "instructor", authorBio: bio.trim(),
      registeredDate: new Date().toISOString().split('T')[0],
      enrolledCourses: [], assignedCourses: assignedCourseIds
    };
    users.push(newTutor);
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "CREATED_TUTOR", "user", username, name);
    return { success: true, user: newTutor };
  }

  getTutorAssignedCourses(username) {
    const users = this.getUsers();
    const tutor = users.find(u => u.username === username);
    if (!tutor) return [];
    if (tutor.role === 'admin') return this.getCourses(); // admin sees all
    if (!tutor.assignedCourses || tutor.assignedCourses.length === 0) return [];
    const allCourses = this.getCourses();
    return allCourses.filter(c => tutor.assignedCourses.includes(c.id));
  }

  updateTutorCourseAssignments(username, courseIds = []) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return { success: false, error: "Tutor not found." };
    users[idx].assignedCourses = courseIds;
    this.setItemAndSync("cubaze_users", users);
    this.addActivity("admin", "UPDATED_TUTOR_COURSES", "user", username, `${courseIds.length} courses`);
    return { success: true };
  }

  // --- ADD LESSON TO COURSE MODULE ---
  addLessonToCourseModule(courseId, moduleIdx, lessonTitle, duration, videoUrl, description = "", addedBy = "") {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return { success: false, error: "Course not found." };
    const course = courses[courseIndex];
    if (!course.modules || !course.modules[moduleIdx]) return { success: false, error: "Module not found." };
    const lessonId = `les-${courseId}-${Date.now()}`;
    const newLesson = {
      id: lessonId, title: lessonTitle.trim(), duration: duration || "10:00",
      videoUrl: videoUrl.trim(), description: description.trim(),
      addedBy: addedBy, status: "published", addedDate: new Date().toISOString().split('T')[0]
    };
    course.modules[moduleIdx].lessons.push(newLesson);
    let totalLessons = 0;
    course.modules.forEach(m => { totalLessons += m.lessons.length; });
    course.lessonsCount = totalLessons;
    courses[courseIndex] = course;
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true, lesson: newLesson };
  }

  // --- UPDATE LESSON IN COURSE MODULE ---
  updateLessonInCourseModule(courseId, lessonId, data) {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return { success: false, error: "Course not found." };
    const course = courses[courseIndex];
    let updated = false;
    course.modules.forEach(mod => {
      const lesIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lesIdx > -1) {
        mod.lessons[lesIdx] = {
          ...mod.lessons[lesIdx],
          title: data.title.trim(),
          duration: data.duration ? data.duration.trim() : mod.lessons[lesIdx].duration,
          videoUrl: data.videoUrl.trim(),
          description: data.description ? data.description.trim() : ""
        };
        updated = true;
      }
    });
    if (!updated) return { success: false, error: "Lesson not found." };
    courses[courseIndex] = course;
    this.setItemAndSync("cubaze_courses", courses);
    return { success: true };
  }

  // ============================================================
  // STUDENT SUPPORT MESSAGING SYSTEM
  // ============================================================

  async getSupportConversations() {
    if (this.sb) {
      try {
        const cu = this.getCurrentUser();
        if (!cu) return [];
        let query = this.sb.from('cubaze_support_conversations').select('*');
        if (cu.role !== 'admin') {
          query = query.eq('student_username', cu.username);
        }
        const { data, error } = await query.order('last_reply_at', { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase conversations fetch failed, using fallback:", error);
      } catch (err) {
        console.warn("Supabase conversations fetch error, using fallback:", err);
      }
    }
    // Fallback
    const cu = this.getCurrentUser();
    if (!cu) return [];
    const convs = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    if (cu.role === 'admin') {
      return convs.sort((a,b) => new Date(b.last_reply_at) - new Date(a.last_reply_at));
    } else {
      return convs.filter(c => c.student_username === cu.username).sort((a,b) => new Date(b.last_reply_at) - new Date(a.last_reply_at));
    }
  }

  async getSupportMessages(conversationId) {
    if (this.sb) {
      try {
        const cu = this.getCurrentUser();
        if (!cu) return [];
        let query = this.sb.from('cubaze_support_messages').select('*').eq('conversation_id', conversationId);
        if (cu.role !== 'admin') {
          query = query.eq('is_internal', false);
        }
        const { data, error } = await query.order('created_at', { ascending: true });
        if (!error && data) return data;
        console.warn("Supabase messages fetch failed, using fallback:", error);
      } catch (err) {
        console.warn("Supabase messages fetch error, using fallback:", err);
      }
    }
    // Fallback
    const cu = this.getCurrentUser();
    if (!cu) return [];
    const allMsgs = JSON.parse(localStorage.getItem("cubaze_support_messages") || "[]");
    let msgs = allMsgs.filter(m => m.conversation_id === conversationId);
    if (cu.role !== 'admin') {
      msgs = msgs.filter(m => !m.is_internal);
    }
    return msgs.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  }

  async createSupportConversation(subject, category, priority, messageText, fileData = null, externalLink = '') {
    const cu = this.getCurrentUser();
    if (!cu) return { success: false, error: "Not logged in" };

    const convId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'conv_' + Math.floor(Date.now() + Math.random() * 1000000);
    const msgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg_' + Math.floor(Date.now() + Math.random() * 1000000);
    const nowStr = new Date().toISOString();

    const conversation = {
      id: convId,
      student_username: cu.username,
      subject: subject.trim(),
      category: category,
      priority: priority,
      status: 'Open',
      created_at: nowStr,
      last_reply_at: nowStr,
      last_reply_by: 'student',
      unread_by_admin: true,
      unread_by_student: false
    };

    const message = {
      id: msgId,
      conversation_id: convId,
      sender: cu.username,
      message: messageText.trim(),
      file_url: fileData ? fileData.url : null,
      file_name: fileData ? fileData.name : null,
      file_type: fileData ? fileData.type : null,
      external_link: externalLink ? externalLink.trim() : null,
      is_internal: false,
      created_at: nowStr,
      seen: false
    };

    if (this.sb) {
      try {
        const { error: cErr } = await this.sb.from('cubaze_support_conversations').insert(conversation);
        if (cErr) throw cErr;

        const { error: mErr } = await this.sb.from('cubaze_support_messages').insert(message);
        if (mErr) throw mErr;

        return { success: true, conversationId: convId };
      } catch (err) {
        console.warn("Supabase conversation creation failed, falling back to LocalStorage:", err);
      }
    }

    // Fallback
    const conversations = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    const messages = JSON.parse(localStorage.getItem("cubaze_support_messages") || "[]");

    conversations.push(conversation);
    messages.push(message);

    localStorage.setItem("cubaze_support_conversations", JSON.stringify(conversations));
    localStorage.setItem("cubaze_support_messages", JSON.stringify(messages));

    return { success: true, conversationId: convId };
  }

  async sendSupportMessage(conversationId, messageText, fileData = null, externalLink = '', isInternal = false) {
    const cu = this.getCurrentUser();
    if (!cu) return { success: false, error: "Not logged in" };

    const msgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg_' + Math.floor(Date.now() + Math.random() * 1000000);
    const nowStr = new Date().toISOString();

    const message = {
      id: msgId,
      conversation_id: conversationId,
      sender: cu.username,
      message: messageText.trim(),
      file_url: fileData ? fileData.url : null,
      file_name: fileData ? fileData.name : null,
      file_type: fileData ? fileData.type : null,
      external_link: externalLink ? externalLink.trim() : null,
      is_internal: isInternal,
      created_at: nowStr,
      seen: false
    };

    const isStudent = cu.role !== 'admin';
    const updates = {
      last_reply_at: nowStr
    };

    if (isStudent) {
      updates.last_reply_by = 'student';
      updates.unread_by_admin = true;
      updates.status = 'Open';
    } else {
      if (!isInternal) {
        updates.last_reply_by = 'admin';
        updates.unread_by_student = true;
        updates.unread_by_admin = false;
      }
    }

    if (this.sb) {
      try {
        const { error: mErr } = await this.sb.from('cubaze_support_messages').insert(message);
        if (mErr) throw mErr;

        const { error: cErr } = await this.sb.from('cubaze_support_conversations').update(updates).eq('id', conversationId);
        if (cErr) throw cErr;

        return { success: true };
      } catch (err) {
        console.warn("Supabase message sending failed, falling back to LocalStorage:", err);
      }
    }

    // Fallback
    const conversations = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    const messages = JSON.parse(localStorage.getItem("cubaze_support_messages") || "[]");

    messages.push(message);

    const convIdx = conversations.findIndex(c => c.id === conversationId);
    if (convIdx > -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        ...updates
      };
    }

    localStorage.setItem("cubaze_support_conversations", JSON.stringify(conversations));
    localStorage.setItem("cubaze_support_messages", JSON.stringify(messages));

    return { success: true };
  }

  async markConversationStatus(conversationId, status) {
    const updates = { status: status, last_reply_at: new Date().toISOString() };
    
    if (this.sb) {
      try {
        const { error } = await this.sb.from('cubaze_support_conversations').update(updates).eq('id', conversationId);
        if (!error) return { success: true };
        console.warn("Supabase status update failed, using fallback:", error);
      } catch (err) {
        console.warn("Supabase status update error, using fallback:", err);
      }
    }

    // Fallback
    const conversations = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    const convIdx = conversations.findIndex(c => c.id === conversationId);
    if (convIdx > -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        ...updates
      };
      localStorage.setItem("cubaze_support_conversations", JSON.stringify(conversations));
      return { success: true };
    }
    return { success: false, error: "Conversation not found" };
  }

  async rateSupportConversation(conversationId, rating, feedback = '') {
    const updates = { rating: parseInt(rating), feedback: feedback.trim() };

    if (this.sb) {
      try {
        const { error } = await this.sb.from('cubaze_support_conversations').update(updates).eq('id', conversationId);
        if (!error) return { success: true };
        console.warn("Supabase rating failed, using fallback:", error);
      } catch (err) {
        console.warn("Supabase rating error, using fallback:", err);
      }
    }

    // Fallback
    const conversations = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    const convIdx = conversations.findIndex(c => c.id === conversationId);
    if (convIdx > -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        ...updates
      };
      localStorage.setItem("cubaze_support_conversations", JSON.stringify(conversations));
      return { success: true };
    }
    return { success: false, error: "Conversation not found" };
  }

  async markMessagesAsSeen(conversationId, role) {
    const cu = this.getCurrentUser();
    if (!cu) return;

    if (this.sb) {
      try {
        if (role === 'admin') {
          await this.sb.from('cubaze_support_messages')
            .update({ seen: true })
            .eq('conversation_id', conversationId)
            .neq('sender', cu.username);

          await this.sb.from('cubaze_support_conversations')
            .update({ unread_by_admin: false })
            .eq('id', conversationId);
        } else {
          await this.sb.from('cubaze_support_messages')
            .update({ seen: true })
            .eq('conversation_id', conversationId)
            .neq('sender', cu.username);

          await this.sb.from('cubaze_support_conversations')
            .update({ unread_by_student: false })
            .eq('id', conversationId);
        }
        return;
      } catch (err) {
        console.warn("Supabase seen update failed, using fallback:", err);
      }
    }

    // Fallback
    const conversations = JSON.parse(localStorage.getItem("cubaze_support_conversations") || "[]");
    const messages = JSON.parse(localStorage.getItem("cubaze_support_messages") || "[]");

    let updatedMsgs = false;
    messages.forEach(m => {
      if (m.conversation_id === conversationId && m.sender !== cu.username && !m.seen) {
         m.seen = true;
         updatedMsgs = true;
      }
    });

    let updatedConvs = false;
    const convIdx = conversations.findIndex(c => c.id === conversationId);
    if (convIdx > -1) {
      if (role === 'admin' && conversations[convIdx].unread_by_admin) {
        conversations[convIdx].unread_by_admin = false;
        updatedConvs = true;
      } else if (role !== 'admin' && conversations[convIdx].unread_by_student) {
        conversations[convIdx].unread_by_student = false;
        updatedConvs = true;
      }
    }

    if (updatedMsgs) localStorage.setItem("cubaze_support_messages", JSON.stringify(messages));
    if (updatedConvs) localStorage.setItem("cubaze_support_conversations", JSON.stringify(conversations));
  }

  async uploadSupportAttachment(file) {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit.");
    }

    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'pdf', 'zip', 'rar', 'mp4', 'webm', 'mov', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      throw new Error("Unsupported file type.");
    }

    if (this.sb) {
      try {
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `support-attachments/${fileName}`;

        const { data, error } = await this.sb.storage
          .from('cubaze-attachments')
          .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = this.sb.storage
          .from('cubaze-attachments')
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          name: file.name,
          type: file.type
        };
      } catch (err) {
        console.warn("Supabase storage upload failed, falling back to data URL:", err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result,
          name: file.name,
          type: file.type
        });
      };
      reader.onerror = err => reject(new Error("Failed to read file local fallback."));
      reader.readAsDataURL(file);
    });
  }

  subscribeToSupportRealtime(callback) {
    if (!this.sb) return null;
    
    const channel = this.sb.channel('realtime:support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cubaze_support_messages' }, payload => {
        callback({ type: 'message', payload });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cubaze_support_conversations' }, payload => {
        callback({ type: 'conversation', payload });
      })
      .subscribe();

    return channel;
  }

  // ============================================================
  // STUDENT-TUTOR MESSAGING
  // ============================================================
  getTutorsForStudent(studentUsername) {
    const student = this.getUsers().find(u => u.username === studentUsername);
    if (!student || !student.enrolledCourses || student.enrolledCourses.length === 0) return [];

    const allTutors = this.getUsers().filter(u => u.role === 'instructor');
    const result = [];

    const mockStatuses = [
      { online: true, active: 'Active now' },
      { online: false, active: 'Last active 15m ago' },
      { online: false, active: 'Last active 2h ago' },
      { online: true, active: 'Active now' }
    ];

    for (const courseId of student.enrolledCourses) {
      const course = this.getCourseById(courseId);
      if (!course) continue;

      const assignedTutors = allTutors.filter(t => t.assignedCourses && t.assignedCourses.includes(courseId));
      for (const tutor of assignedTutors) {
        const existing = result.find(r => r.username === tutor.username);
        if (existing) {
          if (!existing.courses.includes(course.title)) {
            existing.courses.push(course.title);
          }
        } else {
          const hash = tutor.username.charCodeAt(0) % mockStatuses.length;
          const status = mockStatuses[hash];

          result.push({
            username: tutor.username,
            name: tutor.name,
            bio: tutor.authorBio || 'Expert Instructor',
            photo: null,
            online: status.online,
            lastActive: status.active,
            courses: [course.title],
            courseId: courseId
          });
        }
      }
    }
    return result;
  }

  async getTutorConversations() {
    const cu = this.getCurrentUser();
    if (!cu) return [];

    if (this.sb) {
      try {
        let query = this.sb.from('cubaze_tutor_conversations').select('*');
        if (cu.role === 'student') {
          query = query.eq('student_username', cu.username);
        } else if (cu.role === 'instructor') {
          query = query.eq('tutor_username', cu.username);
        }
        const { data, error } = await query.order('last_reply_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase tutor conversations query error, using fallback:", err);
      }
    }

    const list = JSON.parse(localStorage.getItem("cubaze_tutor_conversations") || "[]");
    if (cu.role === 'student') {
      return list.filter(c => c.student_username === cu.username).sort((a,b) => new Date(b.last_reply_at) - new Date(a.last_reply_at));
    } else if (cu.role === 'instructor') {
      return list.filter(c => c.tutor_username === cu.username).sort((a,b) => new Date(b.last_reply_at) - new Date(a.last_reply_at));
    } else {
      return list.sort((a,b) => new Date(b.last_reply_at) - new Date(a.last_reply_at));
    }
  }

  async getTutorMessages(convId) {
    const cu = this.getCurrentUser();
    if (!cu) return [];

    if (this.sb) {
      try {
        const { data, error } = await this.sb.from('cubaze_tutor_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });
        if (!error && data) {
          if (cu.role === 'student') {
            return data.filter(m => !m.is_internal);
          }
          return data;
        }
      } catch (err) {
        console.warn("Supabase tutor messages query error, using fallback:", err);
      }
    }

    const list = JSON.parse(localStorage.getItem("cubaze_tutor_messages") || "[]");
    const msgs = list.filter(m => m.conversation_id === convId);
    if (cu.role === 'student') {
      return msgs.filter(m => !m.is_internal);
    }
    return msgs;
  }

  async createTutorConversation(tutorUsername, courseId, subject, category) {
    const cu = this.getCurrentUser();
    if (!cu) return { success: false, error: "Not logged in" };

    const convId = 'tconv_' + Math.random().toString(36).substring(2, 11);
    const newConv = {
      id: convId,
      student_username: cu.username,
      tutor_username: tutorUsername,
      course_id: courseId,
      subject: subject,
      category: category,
      status: 'Open',
      unread_by_student: false,
      unread_by_tutor: true,
      last_reply_at: new Date().toISOString(),
      last_reply_by: 'student',
      created_at: new Date().toISOString()
    };

    if (this.sb) {
      try {
        const { error } = await this.sb.from('cubaze_tutor_conversations').insert(newConv);
        if (error) throw error;
        return { success: true, conversation: newConv };
      } catch (err) {
        console.warn("Supabase create tutor conversation failed, using fallback:", err);
      }
    }

    const list = JSON.parse(localStorage.getItem("cubaze_tutor_conversations") || "[]");
    list.push(newConv);
    localStorage.setItem("cubaze_tutor_conversations", JSON.stringify(list));
    return { success: true, conversation: newConv };
  }

  async sendTutorMessage(convId, messageText, fileData = null, externalLink = '', isInternal = false) {
    const cu = this.getCurrentUser();
    if (!cu) return { success: false, error: "Not logged in" };

    const msgId = 'tmsg_' + Math.random().toString(36).substring(2, 11);
    const newMsg = {
      id: msgId,
      conversation_id: convId,
      sender: cu.username,
      message: messageText,
      file_url: fileData ? fileData.url : null,
      file_name: fileData ? fileData.name : null,
      external_link: externalLink || null,
      is_internal: isInternal,
      seen: false,
      created_at: new Date().toISOString()
    };

    const nowStr = new Date().toISOString();
    const isStudent = cu.role === 'student';
    
    const convUpdates = {
      last_reply_at: nowStr,
      last_reply_by: isStudent ? 'student' : 'tutor',
      unread_by_student: !isStudent && !isInternal,
      unread_by_tutor: isStudent
    };

    if (this.sb) {
      try {
        const { error: msgErr } = await this.sb.from('cubaze_tutor_messages').insert(newMsg);
        if (msgErr) throw msgErr;

        await this.sb.from('cubaze_tutor_conversations')
          .update(convUpdates)
          .eq('id', convId);

        return { success: true, message: newMsg };
      } catch (err) {
        console.warn("Supabase send tutor message failed, using fallback:", err);
      }
    }

    const list = JSON.parse(localStorage.getItem("cubaze_tutor_messages") || "[]");
    list.push(newMsg);
    localStorage.setItem("cubaze_tutor_messages", JSON.stringify(list));

    const conversations = JSON.parse(localStorage.getItem("cubaze_tutor_conversations") || "[]");
    const convIdx = conversations.findIndex(c => c.id === convId);
    if (convIdx > -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        ...convUpdates
      };
      localStorage.setItem("cubaze_tutor_conversations", JSON.stringify(conversations));
    }

    return { success: true, message: newMsg };
  }

  async markTutorConversationResolved(convId, isResolved) {
    const status = isResolved ? 'Resolved' : 'Open';
    const updates = { status };

    if (this.sb) {
      try {
        const { error } = await this.sb.from('cubaze_tutor_conversations')
          .update(updates)
          .eq('id', convId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.warn("Supabase mark resolved error, using fallback:", err);
      }
    }

    const conversations = JSON.parse(localStorage.getItem("cubaze_tutor_conversations") || "[]");
    const convIdx = conversations.findIndex(c => c.id === convId);
    if (convIdx > -1) {
      conversations[convIdx] = {
        ...conversations[convIdx],
        ...updates
      };
      localStorage.setItem("cubaze_tutor_conversations", JSON.stringify(conversations));
      return { success: true };
    }
    return { success: false, error: "Conversation not found" };
  }

  async markTutorMessagesAsSeen(convId, role) {
    const cu = this.getCurrentUser();
    if (!cu) return;

    if (this.sb) {
      try {
        if (role === 'tutor') {
          await this.sb.from('cubaze_tutor_messages')
            .update({ seen: true })
            .eq('conversation_id', convId)
            .neq('sender', cu.username);

          await this.sb.from('cubaze_tutor_conversations')
            .update({ unread_by_tutor: false })
            .eq('id', convId);
        } else {
          await this.sb.from('cubaze_tutor_messages')
            .update({ seen: true })
            .eq('conversation_id', convId)
            .neq('sender', cu.username);

          await this.sb.from('cubaze_tutor_conversations')
            .update({ unread_by_student: false })
            .eq('id', convId);
        }
        return;
      } catch (err) {
        console.warn("Supabase seen update failed, using fallback:", err);
      }
    }

    const conversations = JSON.parse(localStorage.getItem("cubaze_tutor_conversations") || "[]");
    const messages = JSON.parse(localStorage.getItem("cubaze_tutor_messages") || "[]");

    let updatedMsgs = false;
    messages.forEach(m => {
      if (m.conversation_id === convId && m.sender !== cu.username && !m.seen) {
         m.seen = true;
         updatedMsgs = true;
      }
    });

    let updatedConvs = false;
    const convIdx = conversations.findIndex(c => c.id === convId);
    if (convIdx > -1) {
      if (role === 'tutor' && conversations[convIdx].unread_by_tutor) {
        conversations[convIdx].unread_by_tutor = false;
        updatedConvs = true;
      } else if (role !== 'tutor' && conversations[convIdx].unread_by_student) {
        conversations[convIdx].unread_by_student = false;
        updatedConvs = true;
      }
    }

    if (updatedMsgs) localStorage.setItem("cubaze_tutor_messages", JSON.stringify(messages));
    if (updatedConvs) localStorage.setItem("cubaze_tutor_conversations", JSON.stringify(conversations));
  }

  async uploadTutorAttachment(file) {
    return this.uploadSupportAttachment(file);
  }

  subscribeToTutorRealtime(callback) {
    if (!this.sb) return null;
    
    const channel = this.sb.channel('realtime:tutor_chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cubaze_tutor_messages' }, payload => {
        callback({ type: 'message', payload });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cubaze_tutor_conversations' }, payload => {
        callback({ type: 'conversation', payload });
      })
      .subscribe();

    return channel;
  }

  // --- BATCH MANAGEMENT SYSTEM APIs ---

  getBatches() {
    return JSON.parse(localStorage.getItem("cubaze_batches")) || [];
  }

  getBatchById(id) {
    return this.getBatches().find(b => b.id === id);
  }

  handleAutomaticEnrollment(username, courseId) {
    const batches = this.getBatches();
    // Find the first "Enrollment Open" batch for this course
    let openBatch = batches.find(b => b.courseId === courseId && b.status === "Enrollment Open");
    
    if (!openBatch) {
      // Create a new batch
      const courseBatches = batches.filter(b => b.courseId === courseId);
      const nextNumber = courseBatches.length + 1;
      const course = this.getCourseById(courseId);
      const courseTitle = course ? course.title : courseId;
      
      openBatch = {
        id: `B-${courseId.substring(0,4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${courseTitle} - Batch ${nextNumber}`,
        courseId: courseId,
        tutorIds: [],
        maxStudents: 50,
        currentEnrollment: 0,
        startDate: "",
        endDate: "",
        classDays: [],
        classTime: "",
        googleMeetLink: "",
        googleDriveFolder: "",
        whatsappLink: "",
        status: "Enrollment Open"
      };
      batches.push(openBatch);
      this.setItemAndSync("cubaze_batches", batches);
    }
    
    // Enroll the student
    this.enrollUserInBatch(username, courseId, openBatch.id);
    
    // Check if the batch is now full
    const updatedBatches = this.getBatches();
    const updatedBatch = updatedBatches.find(b => b.id === openBatch.id);
    if (updatedBatch && updatedBatch.currentEnrollment >= updatedBatch.maxStudents) {
      updatedBatch.status = "Full";
      this.setItemAndSync("cubaze_batches", updatedBatches);
    }
  }

  saveBatch(batchData) {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === batchData.id);
    
    // Count actual enrollment
    const users = this.getUsers();
    const enrollmentCount = users.filter(u => u.role === 'student' && u.enrolledBatches && u.enrolledBatches[batchData.courseId] === batchData.id).length;
    batchData.currentEnrollment = enrollmentCount;

    // 1. Validation for Active batch status
    if (batchData.status === 'Active') {
      if (!batchData.tutorIds || batchData.tutorIds.length === 0) {
        return { success: false, error: "Assign Tutor/Mentor is required before activating the batch." };
      }
      if (!batchData.startDate || batchData.startDate.trim() === '') {
        return { success: false, error: "Start Date is required before activating the batch." };
      }
      if (!batchData.endDate || batchData.endDate.trim() === '') {
        return { success: false, error: "End Date is required before activating the batch." };
      }
    }

    // 2. Capacity checks
    if (batchData.maxStudents < enrollmentCount) {
      return { success: false, error: `Cannot reduce capacity below current enrollment of ${enrollmentCount} students.` };
    }

    // 3. Validate WhatsApp invite link
    if (batchData.whatsappLink && batchData.whatsappLink.trim() !== '') {
      const waRegex = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/;
      if (!waRegex.test(batchData.whatsappLink.trim())) {
        return { success: false, error: "Invalid WhatsApp Group invite link. Must start with https://chat.whatsapp.com/" };
      }
    }

    // 4. Validate that only ONE Enrollment Open batch exists for this course
    if (batchData.status === 'Enrollment Open') {
      const hasOtherOpen = batches.some(b => b.courseId === batchData.courseId && b.status === 'Enrollment Open' && b.id !== batchData.id);
      if (hasOtherOpen) {
        return { success: false, error: "Every course can have only ONE batch with the status 'Enrollment Open' at a time." };
      }
    }

    // 5. Automatic reopening of Full batches
    if (index > -1) {
      const oldBatch = batches[index];
      if (oldBatch.status === 'Full' && batchData.maxStudents > enrollmentCount) {
        const hasOtherOpen = batches.some(b => b.courseId === batchData.courseId && b.status === 'Enrollment Open' && b.id !== batchData.id);
        if (!hasOtherOpen) {
          batchData.status = 'Enrollment Open';
        }
      }
      batches[index] = { ...batches[index], ...batchData };
    } else {
      batches.push(batchData);
    }
    
    this.setItemAndSync("cubaze_batches", batches);
    return { success: true, batch: batchData };
  }

  deleteBatch(id) {
    let batches = this.getBatches();
    const len = batches.length;
    batches = batches.filter(b => b.id !== id);
    if (batches.length < len) {
      this.setItemAndSync("cubaze_batches", batches);
      return { success: true };
    }
    return { success: false, error: "Batch not found." };
  }

  duplicateBatch(id) {
    const batch = this.getBatchById(id);
    if (!batch) return { success: false, error: "Batch not found." };
    const newBatch = {
      ...batch,
      id: `B-${batch.courseId.substring(0,4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${batch.name} (Copy)`,
      currentEnrollment: 0,
      status: "Upcoming"
    };
    return this.saveBatch(newBatch);
  }

  archiveBatch(id) {
    const batch = this.getBatchById(id);
    if (!batch) return { success: false, error: "Batch not found." };
    batch.status = "Archived";
    return this.saveBatch(batch);
  }

  // --- ANNOUNCEMENTS ---
  getAnnouncements() {
    return JSON.parse(localStorage.getItem("cubaze_announcements")) || [];
  }

  getAnnouncementsByBatchOrCourse(courseId, batchId) {
    const anns = this.getAnnouncements();
    return anns.filter(a => {
      // announcements for this batch, or announcements for this course with no batch (entire course)
      return (a.batchId === batchId) || (a.courseId === courseId && !a.batchId);
    });
  }

  saveAnnouncement(ann) {
    const anns = this.getAnnouncements();
    const index = anns.findIndex(a => a.id === ann.id);
    if (index > -1) {
      anns[index] = ann;
    } else {
      anns.push(ann);
    }
    this.setItemAndSync("cubaze_announcements", anns);
    return { success: true };
  }

  deleteAnnouncement(id) {
    let anns = this.getAnnouncements();
    const len = anns.length;
    anns = anns.filter(a => a.id !== id);
    if (anns.length < len) {
      this.setItemAndSync("cubaze_announcements", anns);
      return { success: true };
    }
    return { success: false };
  }

  // --- ASSIGNMENTS ---
  getAssignments() {
    return JSON.parse(localStorage.getItem("cubaze_assignments")) || [];
  }

  getAssignmentsByBatchOrCourse(courseId, batchId) {
    const asgs = this.getAssignments();
    return asgs.filter(a => {
      return (a.batchId === batchId) || (a.courseId === courseId && !a.batchId);
    });
  }

  saveAssignment(asg) {
    const asgs = this.getAssignments();
    const index = asgs.findIndex(a => a.id === asg.id);
    if (index > -1) {
      asgs[index] = asg;
    } else {
      asgs.push(asg);
    }
    this.setItemAndSync("cubaze_assignments", asgs);
    return { success: true };
  }

  deleteAssignment(id) {
    let asgs = this.getAssignments();
    const len = asgs.length;
    asgs = asgs.filter(a => a.id !== id);
    if (asgs.length < len) {
      this.setItemAndSync("cubaze_assignments", asgs);
      return { success: true };
    }
    return { success: false };
  }

  // --- RESOURCES ---
  getResources() {
    return JSON.parse(localStorage.getItem("cubaze_resources")) || [];
  }

  getResourcesByBatchOrCourse(courseId, batchId) {
    const ress = this.getResources();
    return ress.filter(r => {
      return (r.batchId === batchId) || (r.courseId === courseId && !r.batchId);
    });
  }

  saveResource(res) {
    const ress = this.getResources();
    const index = ress.findIndex(r => r.id === res.id);
    if (index > -1) {
      ress[index] = res;
    } else {
      ress.push(res);
    }
    this.setItemAndSync("cubaze_resources", ress);
    return { success: true };
  }

  deleteResource(id) {
    let ress = this.getResources();
    const len = ress.length;
    ress = ress.filter(r => r.id !== id);
    if (ress.length < len) {
      this.setItemAndSync("cubaze_resources", ress);
      return { success: true };
    }
    return { success: false };
  }

  // --- ATTENDANCE ---
  getAttendance(batchId) {
    const atts = JSON.parse(localStorage.getItem("cubaze_attendance")) || [];
    return atts.filter(a => a.batchId === batchId);
  }

  markAttendance(batchId, classDate, username, status, joinTime = '') {
    const atts = JSON.parse(localStorage.getItem("cubaze_attendance")) || [];
    const existingIndex = atts.findIndex(a => a.batchId === batchId && a.classDate === classDate && a.username === username);
    const attObj = {
      id: existingIndex > -1 ? atts[existingIndex].id : `ATT-${batchId}-${username}-${Date.now().toString().slice(-4)}`,
      batchId,
      classDate,
      username,
      status,
      joinTime
    };

    if (existingIndex > -1) {
      atts[existingIndex] = attObj;
    } else {
      atts.push(attObj);
    }
    
    this.setItemAndSync("cubaze_attendance", atts);
    return { success: true };
  }

  // --- STUDENT BATCH ENROLLMENT ---
  enrollUserInBatch(username, courseId, batchId) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (index > -1) {
      // Enroll in course if not already
      if (!users[index].enrolledCourses) users[index].enrolledCourses = [];
      if (!users[index].enrolledCourses.includes(courseId)) {
        users[index].enrolledCourses.push(courseId);
      }
      
      // Link to batch
      if (!users[index].enrolledBatches) users[index].enrolledBatches = {};
      users[index].enrolledBatches[courseId] = batchId;

      this.setItemAndSync("cubaze_users", users);
      
      // Sync currentUser in local storage
      const cu = this.getCurrentUser();
      if (cu && cu.username.toLowerCase() === username.toLowerCase()) {
        cu.enrolledCourses = users[index].enrolledCourses;
        cu.enrolledBatches = users[index].enrolledBatches;
        this.setCurrentUser(cu);
      }
      
      // Update batch enrollment count
      const batches = this.getBatches();
      const bIdx = batches.findIndex(b => b.id === batchId);
      if (bIdx > -1) {
        batches[bIdx].currentEnrollment = users.filter(u => u.role === 'student' && u.enrolledBatches && u.enrolledBatches[courseId] === batchId).length;
        this.setItemAndSync("cubaze_batches", batches);
      }
      
      return { success: true };
    }
    return { success: false, error: "User not found." };
  }

  unenrollUserFromBatch(username, courseId, batchId) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (index > -1) {
      if (users[index].enrolledCourses) {
        users[index].enrolledCourses = users[index].enrolledCourses.filter(cid => cid !== courseId);
      }
      if (users[index].enrolledBatches) {
        delete users[index].enrolledBatches[courseId];
      }
      this.setItemAndSync("cubaze_users", users);
      
      const cu = this.getCurrentUser();
      if (cu && cu.username.toLowerCase() === username.toLowerCase()) {
        cu.enrolledCourses = users[index].enrolledCourses;
        cu.enrolledBatches = users[index].enrolledBatches;
        this.setCurrentUser(cu);
      }

      // Update batch enrollment count
      const batches = this.getBatches();
      const bIdx = batches.findIndex(b => b.id === batchId);
      if (bIdx > -1) {
        batches[bIdx].currentEnrollment = users.filter(u => u.role === 'student' && u.enrolledBatches && u.enrolledBatches[courseId] === batchId).length;
        this.setItemAndSync("cubaze_batches", batches);
      }

      return { success: true };
    }
    return { success: false, error: "User not found." };
  }

  // --- COMMON MEETINGS SYSTEM APIs ---

  getCommonMeetings() {
    return JSON.parse(localStorage.getItem("cubaze_common_meetings")) || [];
  }

  getCommonMeetingById(id) {
    return this.getCommonMeetings().find(m => m.id === id);
  }

  saveCommonMeeting(meetingData) {
    const meetings = this.getCommonMeetings();
    const index = meetings.findIndex(m => m.id === meetingData.id);
    if (index > -1) {
      meetings[index] = { ...meetings[index], ...meetingData };
    } else {
      meetings.push(meetingData);
    }
    this.setItemAndSync("cubaze_common_meetings", meetings);
    return { success: true, meeting: meetingData };
  }

  deleteCommonMeeting(id) {
    let meetings = this.getCommonMeetings();
    const len = meetings.length;
    meetings = meetings.filter(m => m.id !== id);
    if (meetings.length < len) {
      this.setItemAndSync("cubaze_common_meetings", meetings);
      return { success: true };
    }
    return { success: false, error: "Meeting not found." };
  }

  duplicateCommonMeeting(id) {
    const meeting = this.getCommonMeetingById(id);
    if (!meeting) return { success: false, error: "Meeting not found." };
    const newMeeting = {
      ...meeting,
      id: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
      title: `${meeting.title} (Copy)`,
      status: "Upcoming"
    };
    return this.saveCommonMeeting(newMeeting);
  }

  getCommonMeetingsForUser(username) {
    const user = this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
    const meetings = this.getCommonMeetings();
    if (!user) return [];
    
    // Admin has full control and sees all
    if (user.role === 'admin') return meetings;
    
    return meetings.filter(m => {
      const type = m.access.type;
      if (type === 'everyone') return true;
      
      if (user.role === 'student') {
        if (type === 'all_students' || type === 'all_students_tutors') return true;
        if (type === 'selected_courses') {
          return (m.access.courseIds || []).some(cid => (user.enrolledCourses || []).includes(cid));
        }
        if (type === 'selected_batches') {
          return (m.access.batchIds || []).some(bid => Object.values(user.enrolledBatches || {}).includes(bid));
        }
      }
      
      if (user.role === 'instructor') {
        if (type === 'all_tutors' || type === 'all_students_tutors') return true;
        if (type === 'selected_courses') {
          return (m.access.courseIds || []).some(cid => (user.assignedCourses || []).includes(cid));
        }
        if (type === 'selected_batches') {
          const tutorBatches = this.getBatches().filter(b => (b.tutorIds || []).includes(username)).map(b => b.id);
          return (m.access.batchIds || []).some(bid => tutorBatches.includes(bid));
        }
      }
      
      if (user.role === 'admission_counselor') {
        if (type === 'admission_counselors') return true;
      }
      
      return false;
    });
  }

  // --- POSTERS CRUD ---
  getPosters() {
    return JSON.parse(localStorage.getItem("cubaze_posters")) || [];
  }

  savePoster(posterData) {
    const posters = this.getPosters();
    const index = posters.findIndex(p => p.id === posterData.id);
    posterData.updatedAt = new Date().toISOString();
    if (index > -1) {
      posters[index] = { ...posters[index], ...posterData };
    } else {
      posterData.createdAt = posterData.createdAt || new Date().toISOString();
      posters.push(posterData);
    }
    this.setItemAndSync("cubaze_posters", posters);
    return { success: true, poster: posterData };
  }

  async deletePoster(id) {
    let posters = this.getPosters();
    const len = posters.length;
    posters = posters.filter(p => p.id !== id);
    if (posters.length < len) {
      this.setItemAndSync("cubaze_posters", posters);
      if (this.sb) {
        try {
          await this.sb.from('cubaze_posters').delete().eq('id', id);
        } catch (err) {
          console.warn("Failed to delete poster from Supabase:", err);
        }
      }
      return { success: true };
    }
    return { success: false, error: "Poster not found." };
  }
}

window.db = new CubazeDB();
console.log("✅ Cubaze Academy DB v3.0 Initialized — Full LMS Edition.");

