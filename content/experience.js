export const experience = {
  org: "WiseTech Global",
  orgNote: "formerly Blume Global",
  when: "Aug 2023 – May 2026",
  team: "Search & Orchestration Platform",
  summary:
    "Shipment orchestration, business rules, charge processing, and the search and sync layer behind an enterprise logistics product. Backend services, and the React screens on top of them.",

  scope: [
    "Design → ship → operate",
    "7 applications",
    "Java · Spring · React",
    "Multi-tenant",
    "Promoted after 20 months",
  ],

  roles: [
    {
      title: "Software Engineer",
      when: "Apr 2025 – May 2026",
      bullets: [
        "Migrated the Elasticsearch integration to the native Java client with point-in-time pagination, cutting search latency **30–40%** and deep-pagination time in half.",
        "Re-architected the sync pipeline between MySQL and Elasticsearch with parallel batches and a real fetch plan: **10–15×** the throughput on **50–70%** fewer database queries.",
        "Broke a **900**-line query builder into readable modules, corrected the nested and boolean query semantics hiding inside it, and pinned the behaviour down with **68** test scenarios.",
        "Rebuilt the activity log and shipment detail screens in React, class components to hooks, with server-driven filters and infinite scroll. Shipped a new rail billing page front to back.",
        "Resolved **10+** critical production incidents across Kafka, authentication, shipment processing and Elasticsearch sync.",
      ],
    },
    {
      title: "Associate Software Engineer",
      when: "Aug 2023 – Mar 2025",
      bullets: [
        "Delivered charge-processing workflows with server-side defaulting and enrichment across REST and Kafka, measurably improving billing accuracy.",
        "Built shipment alerts and permission-based alert configuration, so each tenant sees only the events that concern them.",
        "Developed Spring Boot services and React modules for Activity Log, Shipment Alerts, Transit Stops and Rail Billing across **7** enterprise applications.",
        "Took automated coverage to **58%** with JUnit, Mockito and UI automation, turning a flaky release process into a predictable one.",
      ],
    },
  ],
};
