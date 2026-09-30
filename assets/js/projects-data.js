/**
 * Muhammad Muzammil - Portfolio Project Data Registry
 * Drive Works Integration:
 * 01 - SILVER UNITED PROJECT LLC (SUP)
 * 02 - ABBA PERFUME — ZANOTTI
 * 03 - ABBA FUEGO
 * 04 - MIMIO SUSHI (RESTAURANT COMMERCIAL)
 * 05 - AIORA MEDIA
 * 06 - LUXURY OUD / ATTAR
 * 07 - INSPIREGO
 * 08 - EDEXORA
 */

const projectsData = [
  {
    id: "sup-project",
    number: "01",
    title: "SILVER UNITED PROJECT LLC (SUP)",
    category: "DIGITAL BRANDING & COMMERCIAL",
    filterCategory: "product-ads",
    isFeatured: true,
    gridSize: "large",
    description: "A high-impact brand commercial and digital presentation created for Silver United Project LLC (SUP) combining modern visual language, dynamic lighting, and commercial storytelling.",
    tags: ["BRAND COMMERCIAL", "AI VIDEO", "DIGITAL CREATIVE", "CORPORATE AD"],
    videoUrl: "assets/videos/sup-video.mp4",
    posterUrl: "assets/images/sup-thumb.jpg",
    year: "2026",
    creativeApproach: [
      "Corporate & Tech Visual Direction",
      "Dynamic Brand Motion Design",
      "High-Impact Lighting & Color Dynamics",
      "Modern Commercial Positioning"
    ],
    tools: ["Generative AI Video", "Prompt Engineering", "CapCut Pro", "Video Editing"]
  },
  {
    id: "abba-perfume",
    number: "02",
    title: "ABBA PERFUME — ZANOTTI",
    category: "LUXURY PERFUME COMMERCIAL",
    filterCategory: "product-ads",
    isFeatured: true,
    gridSize: "medium",
    description: "A cinematic luxury fragrance film focused on premium product presentation, atmospheric lighting, close-up product details and visual storytelling.",
    tags: ["AI VIDEO", "PRODUCT COMMERCIAL", "LUXURY VISUALS", "AI CONTENT"],
    videoUrl: "assets/videos/abba-perfume.mp4",
    posterUrl: "assets/images/abba-perfume-thumb.jpg",
    year: "2026",
    creativeApproach: [
      "Product Cinematography",
      "Luxury Visual Language",
      "AI-Generated Video Synthesis",
      "Atmospheric Lighting & Color Grading",
      "Close-Up Storytelling"
    ],
    tools: ["Midjourney v6", "Runway Gen-2 / Luma", "CapCut Pro", "Prompt Engineering"]
  },
  {
    id: "abba-fuego",
    number: "03",
    title: "ABBA FUEGO",
    category: "CREATIVE BRAND COMMERCIAL",
    filterCategory: "product-ads",
    isFeatured: true,
    gridSize: "medium",
    description: "An intense, high-energy cinematic commercial crafted for ABBA Fuego featuring bold motion aesthetics and vibrant product presentation.",
    tags: ["AI VIDEO", "BRAND AD", "MOTION DESIGN", "CINEMATIC VISUALS"],
    videoUrl: "assets/videos/abba-fuego.mov",
    posterUrl: "assets/images/abba-fuego-thumb.jpg",
    year: "2026",
    creativeApproach: [
      "Dynamic Motion Graphics",
      "High Contrast Energy Lighting",
      "Cinematic Product Angles",
      "Sound & Visual Synchronization"
    ],
    tools: ["Generative AI", "CapCut Pro", "Color Grading", "Visual Editing"]
  },
  {
    id: "mimio-sushi",
    number: "04",
    title: "MIMIO SUSHI",
    category: "RESTAURANT & FOOD COMMERCIAL",
    filterCategory: "product-ads",
    isFeatured: true,
    gridSize: "medium",
    description: "A visually rich restaurant and food commercial designed around close-up product presentation, appetizing visuals and cinematic advertising aesthetics.",
    tags: ["AI VIDEO", "RESTAURANT AD", "FOOD VISUALS", "CREATIVE DIRECTION"],
    videoUrl: "assets/videos/mimio-sushi.mp4",
    posterUrl: "assets/images/mimio-sushi-thumb.jpg",
    year: "2026",
    creativeApproach: [
      "Appetizing Visual Composition",
      "Dynamic Camera Movement Simulation",
      "Macro Food Detail Rendering",
      "Commercial Motion Rhythms"
    ],
    tools: ["Stable Diffusion XL", "Runway / Pika", "CapCut", "Prompt Engineering"]
  },
  {
    id: "aiora-media",
    number: "05",
    title: "AIORA MEDIA",
    category: "DIGITAL MEDIA & AGENCY AD",
    filterCategory: "product-ads",
    isFeatured: true,
    gridSize: "medium",
    description: "A sleek digital agency promo video designed for Aiora Media, highlighting modern creative strategy and high-converting visual production.",
    tags: ["AGENCY PROMO", "AI VIDEO", "DIGITAL MARKETING", "CREATIVE AD"],
    videoUrl: "assets/videos/aiora-media.mp4",
    posterUrl: "assets/images/aiora-media-thumb.jpg",
    year: "2026",
    creativeApproach: [
      "Modern Agency Storytelling",
      "Sleek UI Motion Overlay",
      "Dynamic Transition Pacing",
      "Premium Brand Identity"
    ],
    tools: ["Generative AI", "Prompt Engineering", "CapCut Pro", "Motion Design"]
  },
  {
    id: "luxury-oud",
    number: "06",
    title: "LUXURY OUD / ATTAR",
    category: "CINEMATIC PRODUCT ADVERTISEMENT",
    filterCategory: "product-ads",
    isFeatured: false,
    gridSize: "wide",
    description: "A premium fragrance-focused visual concept combining product storytelling, cinematic atmosphere, luxury aesthetics and AI-generated visuals.",
    tags: ["AI VIDEO", "PRODUCT AD", "VISUAL STORYTELLING", "LUXURY BRANDING"],
    videoUrl: "assets/videos/luxury-oud.mov",
    posterUrl: "assets/images/luxury-oud-thumb.svg",
    year: "2026",
    creativeApproach: [
      "Deep Crimson & Gold Aesthetic",
      "Liquid & Vapor Particle Dynamics",
      "High-Contrast Editorial Lighting",
      "Heritage Brand Tone"
    ],
    tools: ["Google Flow / AI Video Tools", "Claude", "CapCut Pro"]
  },
  {
    id: "inspirego",
    number: "07",
    title: "INSPIREGO",
    category: "TRAVEL DIGITAL EXPERIENCE",
    filterCategory: "web-digital",
    isFeatured: false,
    gridSize: "medium",
    isWebProject: true,
    description: "A modern travel agency website concept designed around immersive destination visuals, interactive experiences and a fresh contemporary travel-focused interface.",
    tags: ["WEB DESIGN", "UI/UX", "TRAVEL", "DIGITAL EXPERIENCE"],
    videoUrl: null,
    posterUrl: "assets/images/inspirego-mockup.svg",
    year: "2026",
    creativeApproach: [
      "Immersive Destination Showcase",
      "Dark-Mode Modern UI Architecture",
      "Seamless Interactive Booking Journeys",
      "Mobile-First Responsive Layout"
    ],
    tools: ["Vibe Coding", "Figma / Web Design", "AI-Assisted Development"]
  },
  {
    id: "edexora",
    number: "08",
    title: "EDEXORA",
    category: "ONLINE EDUCATION PLATFORM",
    filterCategory: "web-digital",
    isFeatured: false,
    gridSize: "medium",
    isWebProject: true,
    description: "An online education platform concept designed for students, teachers and administrators, combining learning management, classes, assessments, progress tracking and administrative tools into one digital experience.",
    tags: ["WEB APP", "EDTECH", "UI/UX", "AI-ASSISTED DEVELOPMENT"],
    videoUrl: null,
    posterUrl: "assets/images/edexora-mockup.svg",
    year: "2026",
    features: {
      student: ["Classes & Live Sessions", "Recorded Lessons Library", "Quizzes & Interactive Tests", "Real-Time Progress Tracking"],
      teacher: ["Class & Schedule Management", "Interactive Teaching Dashboard", "Student Assessment Tools"],
      admin: ["User Management (Student/Teacher)", "Analytics & Financial Reporting", "Platform Governance"]
    },
    creativeApproach: [
      "Multi-Role Interface Architecture",
      "Dashboard UX for Complex Workflows",
      "Gamified Student Progress Visualization",
      "Clean Modular Design System"
    ],
    tools: ["Vibe Coding", "UI/UX Design", "AI Development Tools"]
  }
];
