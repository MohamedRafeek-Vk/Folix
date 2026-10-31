import { PortfolioData } from '../types/portfolio';

export const SAMPLE_RESUMES: Record<string, Partial<PortfolioData> & { label: string; roleDesc: string }> = {
  softwareEngineer: {
    label: "Mohamed Rafeek",
    roleDesc: "Senior Full Stack & AI Engineer",
    name: "Mohamed Rafeek",
    profession: "Senior Full Stack & AI Engineer",
    summary: "Senior Full Stack Engineer with 6+ years of experience designing scalable microservices, real-time web applications, and AI-powered developer tools. Passionate about clean system architecture, TypeScript, high-throughput backend systems, and delightful UX.",
    email: "rafeek.dev@example.com",
    phone: "+1 (555) 349-2810",
    location: "San Francisco, CA",
    skills: [
      "TypeScript", "React", "Next.js", "Node.js", "Go", "Python",
      "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL", "Tailwind CSS",
      "AWS", "OpenAI API", "System Design", "CI/CD"
    ],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://rafeek.tech",
      twitter: "https://twitter.com",
      email: "rafeek.dev@example.com"
    },
    experience: [
      {
        id: "exp-1",
        role: "Lead Full Stack Engineer",
        company: "Veloce Cloud Systems",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description: "Spearheaded the architecture of core collaborative analytics dashboard used by 120k+ daily developers. Improved p99 latency by 42% through query caching with Redis and optimistic UI updates.",
        highlights: [
          "Architected real-time WebSocket infrastructure handling 40,000 concurrent events",
          "Mentored a team of 8 engineers and introduced TypeScript strictness across 15 repositories",
          "Reduced cloud infrastructure costs by 28% through Docker container right-sizing"
        ]
      },
      {
        id: "exp-2",
        role: "Senior Software Engineer",
        company: "HyperScale Media",
        location: "Austin, TX",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Built scalable internal tools and automated media processing pipelines. Designed modern React component library and migrated legacy monolith services into decoupled Node.js microservices.",
        highlights: [
          "Developed distributed video transcoder pipeline processing 5TB+ daily media assets",
          "Created modular design system utilized across 4 customer-facing products"
        ]
      },
      {
        id: "exp-3",
        role: "Software Developer",
        company: "Nexus Labs",
        location: "Boston, MA",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Developed customer portal features, payment integrations with Stripe, and optimized PostgreSQL database queries for high transaction volumes.",
        highlights: [
          "Integrated Stripe Billing engine reducing customer churn by 14%",
          "Wrote automated end-to-end testing suites increasing test coverage to 91%"
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        startYear: "2014",
        endYear: "2018",
        fieldOfStudy: "Software Engineering & Distributed Systems",
        gpa: "3.85 / 4.0"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "OmniFlow AI Workflow Automation",
        description: "An open-source node-based automation engine that connects LLMs to API endpoints with sandboxed execution, real-time logging, and interactive flow canvas.",
        technologies: ["React", "TypeScript", "FastAPI", "Python", "Tailwind CSS"],
        link: "https://example.com/omniflow",
        githubUrl: "https://github.com/example/omniflow",
        featured: true
      },
      {
        id: "proj-2",
        title: "HyperKV Distributed In-Memory Store",
        description: "Lightweight, persistent key-value store with Raft consensus, zero-allocation serialization, and sub-millisecond read latency.",
        technologies: ["Go", "Raft", "gRPC", "Docker"],
        githubUrl: "https://github.com/example/hyperkv",
        featured: true
      },
      {
        id: "proj-3",
        title: "DevMetrics CLI & GitHub Action",
        description: "Command-line diagnostic tool that visualizes PR review bottlenecks, code churn, and test flakiness across distributed teams.",
        technologies: ["Node.js", "TypeScript", "GitHub API", "Ink"],
        link: "https://example.com/devmetrics",
        featured: false
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        id: "cert-2",
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation",
        date: "2022"
      }
    ]
  },
  productDesigner: {
    label: "Elena Rostova",
    roleDesc: "Principal Product & UX Designer",
    name: "Elena Rostova",
    profession: "Principal Product & UX Designer",
    summary: "Human-centered Product Designer with 7+ years shaping complex enterprise software, mobile experiences, and modern design systems. Focused on elevating usability through data-backed design, rapid prototyping, and polished micro-interactions.",
    email: "elena.design@example.com",
    phone: "+1 (555) 782-9901",
    location: "New York, NY",
    skills: [
      "Product Strategy", "Figma", "Design Systems", "UI Prototyping",
      "User Research", "Wireframing", "Interaction Design", "Usability Testing",
      "Information Architecture", "HTML/CSS", "Design Tokens", "Framer"
    ],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://elenarostova.design",
      twitter: "https://twitter.com",
      email: "elena.design@example.com"
    },
    experience: [
      {
        id: "exp-1",
        role: "Principal Product Designer",
        company: "Stratos Design Studio",
        location: "New York, NY",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: "Directing the end-to-end design lifecycle for flagship fintech B2B products. Established the company-wide design tokens library bridging Figma and React components.",
        highlights: [
          "Redesigned the portfolio dashboard resulting in a 38% increase in daily active user engagement",
          "Conducted 60+ user interviews uncovering key friction points in onboarding flows"
        ]
      },
      {
        id: "exp-2",
        role: "Senior UX Designer",
        company: "Aurora Health Tech",
        location: "Boston, MA",
        startDate: "2018",
        endDate: "2021",
        current: false,
        description: "Led patient portal UI redesign adhering to strict WCAG 2.1 AA accessibility guidelines. Partnered closely with clinical teams and mobile developers.",
        highlights: [
          "Decreased patient appointment scheduling drop-off by 29%",
          "Built interactive prototype tested across 12 medical facilities"
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.F.A. in Interaction Design",
        institution: "Rhode Island School of Design (RISD)",
        location: "Providence, RI",
        startYear: "2014",
        endYear: "2018",
        fieldOfStudy: "Digital Product & Visual Communications"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Aura Design System",
        description: "A comprehensive open design system with 200+ accessible components, dark/light themes, typography scales, and interactive Figma UI kit.",
        technologies: ["Figma", "Design Tokens", "Framer", "React"],
        link: "https://example.com/aura-system",
        featured: true
      },
      {
        id: "proj-2",
        title: "FinPulse Mobile Wealth Manager",
        description: "Personal investment iOS app focused on emotional financial wellness, automated budget goals, and intuitive wealth allocation charts.",
        technologies: ["iOS", "Figma", "Protopie", "User Research"],
        link: "https://example.com/finpulse",
        featured: true
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Nielsen Norman Group UX Master Certified",
        issuer: "NN/g",
        date: "2022"
      }
    ]
  }
};
