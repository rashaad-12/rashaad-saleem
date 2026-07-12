export const projects = [
  {
    slug: "architecture-studio-website",
    name: "Architecture Studio Website",
    kind: "Client work",
    badge: "Live",
    description:
      "A production-ready website for an architecture practice, built with Next.js and live at its domain. While the studio's project catalogue is still being prepared, the application already includes a filterable gallery, a validated SMTP-powered contact form and a CMS-ready content structure awaiting client content. The site is fully server-rendered with SEO metadata, Open Graph support, optimized images and light/dark themes.",
    stack: [
      "Next.js",
      "React 19",
      "Tailwind",
      "Framer Motion",
      "MongoDB",
      "Vercel",
    ],
    liveUrl: "https://fawad-saleem-architects.vercel.app/",
    liveLabel: "Visit the site",
    sourceUrl: "https://github.com/rashaad-12/fawad-saleem-architects",
  },
  {
    slug: "restaurant-os",
    name: "RestaurantOS",
    kind: "Distributed restaurant platform",
    badge: null,
    description:
      "Five Spring Boot services and two shared libraries in one Gradle monorepo, each owning its own datastore: identity and menu on MongoDB, orders on MySQL, analytics read-only on Elasticsearch. Order changes leave MySQL through Debezium change-data-capture onto Kafka, where a sync worker enriches them and bulk-indexes into per-restaurant indices. Authentication is asymmetric: one service holds the RSA private key and issues tokens, every other service verifies with the public key and never trusts a shared secret.",
    stack: [
      "Java 17",
      "Spring Boot",
      "Kafka",
      "Debezium",
      "MySQL",
      "MongoDB",
      "Elasticsearch",
      "Docker",
    ],
    liveUrl: null,
    liveLabel: null,
    sourceUrl: "https://github.com/rashaad-12/restaurant-os",
  },
  {
    slug: "orchestrator",
    name: "Orchestrator",
    kind: "Workflow engine and visual editor",
    badge: null,
    description:
      "A work-order engine and the canvas that drives it. Transitions the business rules disallow are refused at a Spring StateMachine rather than in service code scattered across the app and each workflow's position is persisted to MySQL as it advances, so a restart never strands a job halfway through. The editor draws a workflow as a graph of typed nodes that are declared as configuration rather than as components, so adding a node type costs one config file and no new rendering code. Undo, redo, copy-paste and automatic graph layout are wired to the keyboard.",
    stack: [
      "Java",
      "Spring Boot",
      "Spring StateMachine",
      "Spring Data JPA",
      "MySQL",
      "React",
      "ReactFlow",
      "Zustand",
    ],
    liveUrl: null,
    liveLabel: null,
    sourceUrl: "https://github.com/rashaad-12/workflow-management-system",
  },
];

export const findProject = (slug) =>
  projects.find((project) => project.slug === slug);
