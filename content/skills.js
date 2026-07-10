export const skills = [
  {
    title: "What I work in every day",
    lead: true,
    items: [
      ["Java", "primary language, 3 yrs"],
      ["Spring Boot", "the whole platform, 3 yrs"],
      ["React", "7 enterprise apps, 3 yrs"],
      ["Elasticsearch", "search + sync layer, 3 yrs"],
      ["Kafka", "change events, ~1M a day"],
    ],
  },
  {
    title: "Backend & services",
    items: [
      ["Spring Data JPA", "fetch plans, batch sizing, N+1 hunts"],
      ["Spring Security", "JWT, per-role signing keys"],
      ["REST APIs", "public contracts across 7 apps"],
      ["Microservices", "shipment, sync and search services"],
    ],
  },
  {
    title: "Distributed systems",
    items: [
      ["Event-driven architecture", "Kafka consumers feeding a search index"],
      ["Async processing & backpressure", "thread-pool and queue design"],
      ["Saga pattern", "multi-leg shipment transactions"],
      ["Redis", "config and lookup caching"],
    ],
  },
  {
    title: "Data & storage",
    items: [
      ["MySQL", "system of record, 3 yrs"],
      ["SQL", "query analysis and optimisation"],
      ["MongoDB", "RestaurantOS, side projects"],
    ],
  },
  {
    title: "Frontend",
    items: [
      ["Redux · Redux Saga", "shared state across 7 apps"],
      ["Class → hooks refactors", "3 legacy screens, ~4k lines"],
      ["JavaScript", "daily"],
      ["Next.js", "two production sites"],
    ],
  },
  {
    title: "Testing & tooling",
    items: [
      ["JUnit 5 · Mockito", "coverage raised to 58%"],
      ["Jest · Playwright", "UI automation in CI"],
      ["Docker · GCP", "local stacks, hosted Elasticsearch"],
      ["Python", "call-graph tooling and analysis"],
      ["Kibana · Postman", "production diagnostics, daily"],
    ],
  },
];
