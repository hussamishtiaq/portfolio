/**
 * Case studies. Numbers come from the actual repositories (source LOC, models,
 * migrations, test files) — keep them honest; replace with business metrics
 * (users, uptime, revenue impact) when you have them.
 * "hardest" and "nextTime" are drafted narratives: rewrite them in your own words.
 */

export type DiagramNode = { id: string; label: string; sub?: string; x: number; y: number; tone?: "edge" | "core" | "store" };
export type DiagramEdge = { from: string; to: string; label?: string };
export type DiagramStep = { caption: string; edges: [string, string][] };

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  summary: string;
  year: string;
  role: string;
  team: string;
  status: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  problem: string;
  constraints: string[];
  diagram: { nodes: DiagramNode[]; edges: DiagramEdge[]; steps: DiagramStep[] };
  decisions: { title: string; body: string; rejected: string }[];
  hardest: { title: string; body: string };
  results: string[];
  nextTime: string;
};

export const projects: Project[] = [
  {
    slug: "schoolchat",
    name: "SchoolChat",
    kicker: "Realtime platform · Solo build",
    tagline: "Multi-tenant chat, announcements and video meetings for schools, with SDKs for six client platforms.",
    summary:
      "A realtime communication backbone for a school SaaS: tenant-isolated messaging, opt-in end-to-end encryption, child-safety moderation and LiveKit video meetings, consumed through one API contract by web, desktop and mobile apps.",
    year: "2026",
    role: "Architect & sole engineer",
    team: "Solo",
    status: "Feature-complete, pre-production",
    stack: [
      "NestJS",
      "PostgreSQL RLS",
      "Prisma",
      "Socket.IO",
      "LiveKit",
      "coturn",
      "RabbitMQ",
      "S3",
      "Caddy",
      "Docker",
      "Vitest",
      "Flutter/Dart",
    ],
    metrics: [
      { value: "83k", label: "lines of TypeScript & Dart" },
      { value: "59", label: "data models · 30 migrations" },
      { value: "6", label: "client SDK targets" },
      { value: "200+", label: "test files" },
    ],
    problem:
      "Schools needed a communication layer they could trust with children's data: teachers, parents and students talking in real time, scheduled parent-teacher meetings, read-acknowledged announcements, without ever leaking a message across schools.",
    constraints: [
      "Hard tenant isolation: one bug must not expose another school's conversations.",
      "Groups must follow the school roster automatically, with no manual membership management.",
      "Native clients on web, Electron, React Native and Flutter, maintained by one engineer.",
      "Safeguarding: moderation, retention and export rules that a school can audit.",
    ],
    diagram: {
      nodes: [
        { id: "clients", label: "Client SDKs", sub: "TS · React · Electron · RN · Flutter", x: 110, y: 200, tone: "edge" },
        { id: "gw", label: "Caddy", sub: "TLS · WebSocket upgrade", x: 300, y: 200 },
        { id: "api", label: "Chat API", sub: "NestJS · 22 modules", x: 490, y: 120, tone: "core" },
        { id: "rt", label: "Realtime", sub: "Socket.IO gateway", x: 490, y: 280, tone: "core" },
        { id: "pg", label: "Postgres", sub: "Row-Level Security", x: 690, y: 120, tone: "store" },
        { id: "mq", label: "RabbitMQ", sub: "outbox · roster sync", x: 690, y: 280, tone: "store" },
        { id: "lk", label: "LiveKit", sub: "SFU + TURN", x: 300, y: 340 },
      ],
      edges: [
        { from: "clients", to: "gw" },
        { from: "gw", to: "api" },
        { from: "gw", to: "rt" },
        { from: "api", to: "pg" },
        { from: "api", to: "mq" },
        { from: "rt", to: "mq" },
        { from: "clients", to: "lk" },
      ],
      steps: [
        {
          caption: "A parent sends a message from any client SDK; the typed contract is identical on every platform.",
          edges: [
            ["clients", "gw"],
            ["gw", "api"],
          ],
        },
        {
          caption:
            "The API sets the tenant on the database session; Postgres RLS makes cross-school reads impossible, not just unlikely.",
          edges: [["api", "pg"]],
        },
        {
          caption: "The write and its event commit together through a transactional outbox, then fan out over RabbitMQ.",
          edges: [
            ["api", "mq"],
            ["rt", "mq"],
          ],
        },
        {
          caption: "The realtime gateway pushes to every online member's socket within the same tenant room.",
          edges: [
            ["gw", "rt"],
            ["clients", "gw"],
          ],
        },
        {
          caption: "Meetings bypass the API entirely: media flows peer → LiveKit SFU, with coturn for locked-down networks.",
          edges: [["clients", "lk"]],
        },
      ],
    },
    decisions: [
      {
        title: "Isolation in the database, not the code",
        body: "Every tenant-scoped table carries a Row-Level Security policy keyed to a session variable. Application code can forget a WHERE clause; Postgres cannot.",
        rejected: "Schema-per-tenant (migration fan-out) and app-level filtering alone (one missed filter = data leak).",
      },
      {
        title: "Transactional outbox for every event",
        body: "Messages and their domain events are written in one transaction and relayed afterwards, so a crash can never produce a message that nobody was notified about, or a notification for a message that doesn't exist.",
        rejected: "Publishing to the broker inside the request: fast, but loses events on partial failure.",
      },
      {
        title: "One contract, six SDKs",
        body: "A vendored OpenAPI/event contract drives the TypeScript, React, Electron, React Native, Dart and Flutter packages, so a backend change breaks the SDK build, not a production app.",
        rejected: "Hand-written clients per app, which drift within weeks.",
      },
    ],
    hardest: {
      title: "Roster-synced groups without race conditions",
      body: "Class groups rebuild themselves when the school roster changes. Roster events can arrive out of order or twice, so membership sync is idempotent and versioned: replaying the whole stream converges to the same state.",
    },
    results: [
      "22 modules and 28 controllers covering chat, announcements with acknowledgement, polls, recurring meetings and parent-teacher conferences.",
      "Deploy script with pre-deploy backup, health check and automatic rollback; per-tenant export and import.",
      "Opt-in end-to-end encrypted conversations alongside moderated school channels.",
    ],
    nextTime:
      "Start with the contract-first SDK generator on day one. Retrofitting it after clients exist is always more expensive.",
  },
  {
    slug: "nuxused",
    name: "NuxusEd",
    kicker: "Multi-tenant SaaS · Team",
    tagline: "A school operating system for franchises and school groups: six services, four apps, one tenant model.",
    summary:
      "An event-driven education SaaS spanning admissions, academics, assessments, finance and payroll. I worked across the NestJS service layer and owned the Teacher and Student/Parent portals end to end.",
    year: "2025 – 2026",
    role: "Full-stack engineer · owner of Teacher & Student/Parent portals", // TODO: confirm exact role wording
    team: "Product team",
    status: "In production",
    stack: [
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "RabbitMQ",
      "Redis",
      "Stripe",
      "React",
      "TanStack Query",
      "Zustand",
      "Docker",
      "GitLab CI",
    ],
    metrics: [
      { value: "6", label: "microservices, database-per-service" },
      { value: "300+", label: "data models across services" },
      { value: "36k", label: "lines in the portals I own" },
      { value: "210", label: "backend test files" },
    ],
    problem:
      "School groups were running admissions, timetables, exams, fees and payroll in disconnected tools. A franchise owner had no single view of their branches, and every new school meant another manual setup.",
    constraints: [
      "Franchise → school → branch hierarchy with per-tenant plans, branding and feature flags.",
      "Money flows (Stripe, refunds, payroll) must be exactly-once, even when services restart.",
      "Teachers and parents mostly on mid-range phones over mobile data.",
    ],
    diagram: {
      nodes: [
        { id: "apps", label: "Portals", sub: "school · teacher · parent · platform", x: 110, y: 200, tone: "edge" },
        { id: "auth", label: "Auth", sub: "Argon2 · RBAC · tenants", x: 320, y: 90, tone: "core" },
        { id: "core", label: "School core", sub: "82 modules", x: 320, y: 200, tone: "core" },
        { id: "fin", label: "Finance", sub: "Stripe · payroll", x: 320, y: 310, tone: "core" },
        { id: "mq", label: "RabbitMQ", sub: "outbox · DLQ", x: 530, y: 200, tone: "store" },
        { id: "assess", label: "Assessment", sub: "exams · grading", x: 710, y: 110, tone: "core" },
        { id: "notify", label: "Notify & media", sub: "SMS · mail · S3", x: 710, y: 290, tone: "core" },
      ],
      edges: [
        { from: "apps", to: "auth" },
        { from: "apps", to: "core" },
        { from: "apps", to: "fin" },
        { from: "core", to: "mq" },
        { from: "fin", to: "mq" },
        { from: "mq", to: "assess" },
        { from: "mq", to: "notify" },
      ],
      steps: [
        {
          caption:
            "Every request carries a tenant-scoped token; permissions are keys, not hard-coded roles, so each school can shape its own staff hierarchy.",
          edges: [["apps", "auth"]],
        },
        {
          caption: "A teacher publishes marks in the portal; school-core owns the write in its own database.",
          edges: [["apps", "core"]],
        },
        {
          caption: "The change leaves through an outbox onto RabbitMQ, with idempotency keys and dead-letter queues.",
          edges: [["core", "mq"]],
        },
        {
          caption:
            "Assessment recalculates results and Notify messages the parents. Neither service can take down the portal if it's slow.",
          edges: [
            ["mq", "assess"],
            ["mq", "notify"],
          ],
        },
        {
          caption:
            "Fee payments follow the same path from Finance, so a Stripe webhook retry can never double-charge or double-credit.",
          edges: [
            ["apps", "fin"],
            ["fin", "mq"],
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Database per service",
        body: "Finance and academics evolve at different speeds and carry different risk. Separate databases keep a migration in one domain from locking another.",
        rejected: "A shared database with schemas, which is simpler on day one and couples every deploy afterwards.",
      },
      {
        title: "Server state in TanStack Query, UI state in Zustand",
        body: "The portals cache aggressively and invalidate on mutation, which makes them feel instant on slow mobile connections without hand-rolled loading flags.",
        rejected: "A single Redux store holding server data, which turns into a cache you have to invalidate by hand.",
      },
      {
        title: "Promotion-based CI",
        body: "Merge requests verify, main auto-deploys to test, and a tag plus a manual approval promotes to production. Nothing reaches schools without passing the same pipeline.",
        rejected: "Deploying production from main, where one bad merge goes straight to live schools.",
      },
    ],
    hardest: {
      title: "Teacher portal on a bad connection",
      body: "Attendance and marks entry had to survive flaky mobile data. Optimistic updates with rollback, request de-duplication and per-tenant brand tokens resolved at build time keep the portal usable on poor mobile connections.",
    },
    results: [
      "Teacher and Student/Parent portals (~36k LOC) delivered as the primary author.",
      "Per-tenant theming and feature flags, so onboarding a school needs configuration, not code.",
      "One-command local stack (Postgres, Redis, RabbitMQ, Mailpit, six services, gateway) for the whole team.",
    ],
    nextTime:
      "Introduce contract tests between services earlier; most of our integration bugs were schema drift on event payloads.",
  },
  {
    slug: "offline-pos",
    name: "Shop POS",
    kicker: "Offline-first desktop · Solo build",
    tagline: "A point of sale for phone and electronics shops that never stops selling when the internet does.",
    summary:
      "An Electron POS with a local-first database. One installer quietly boots its own Postgres, a sync service and a .NET API, then syncs to the cloud whenever the shop is online.",
    year: "2026",
    role: "Architect & sole engineer",
    team: "Solo",
    status: "Beta",
    stack: ["Electron", "React 19", "PowerSync", "SQLite", "ASP.NET Core 8", "PostgreSQL 17", "JWT"],
    metrics: [
      { value: "0 ms", label: "network latency on checkout" },
      { value: "1", label: "installer for the whole stack" },
      { value: "3", label: "runtimes under one supervisor" },
      { value: "IMEI", label: "level stock tracking" },
    ],
    problem:
      "Small electronics shops lose sales whenever their connection drops, and every cloud POS they tried froze at the till. They also can't run servers or hire IT.",
    constraints: [
      "Must work with no network for days, then reconcile without losing a sale.",
      "Shop owners install it themselves on a Windows PC: one download, no setup wizard full of ports.",
      "Every phone is tracked by IMEI, so stock must be exact across devices.",
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "Till UI", sub: "React 19", x: 110, y: 200, tone: "edge" },
        { id: "sqlite", label: "Local SQLite", sub: "PowerSync client", x: 300, y: 200, tone: "store" },
        { id: "sup", label: "Supervisor", sub: "Electron main", x: 300, y: 70 },
        { id: "ps", label: "PowerSync", sub: "sync service", x: 500, y: 200, tone: "core" },
        { id: "api", label: ".NET API", sub: "writes · JWT", x: 500, y: 330, tone: "core" },
        { id: "pg", label: "Postgres 17", sub: "embedded", x: 700, y: 260, tone: "store" },
        { id: "cloud", label: "Cloud backup", sub: "Postgres", x: 700, y: 100 },
      ],
      edges: [
        { from: "ui", to: "sqlite" },
        { from: "sup", to: "ps" },
        { from: "sqlite", to: "ps" },
        { from: "sqlite", to: "api" },
        { from: "api", to: "pg" },
        { from: "ps", to: "pg" },
        { from: "pg", to: "cloud" },
      ],
      steps: [
        {
          caption:
            "On launch, the supervisor boots embedded Postgres, then PowerSync, then the self-contained .NET API, with secrets generated per install.",
          edges: [["sup", "ps"]],
        },
        {
          caption: "A sale is written to local SQLite instantly. The till never waits on the network.",
          edges: [["ui", "sqlite"]],
        },
        {
          caption: "Queued writes upload through the .NET API, which validates and commits them to Postgres.",
          edges: [
            ["sqlite", "api"],
            ["api", "pg"],
          ],
        },
        {
          caption: "PowerSync streams the authoritative state back down to every till.",
          edges: [
            ["ps", "pg"],
            ["sqlite", "ps"],
          ],
        },
        { caption: "When online, the shop database is replicated to the cloud as an off-site backup.", edges: [["pg", "cloud"]] },
      ],
    },
    decisions: [
      {
        title: "Local-first, server-authoritative",
        body: "Reads and writes hit SQLite; the .NET API stays the single place where business rules are enforced on upload. That keeps the till fast and the books correct.",
        rejected: "Pure CRDT peer-to-peer, which is elegant but makes invariants like 'one IMEI sold once' very hard to enforce.",
      },
      {
        title: "Ship the server inside the app",
        body: "Embedding Postgres and a self-contained .NET runtime means a shop owner installs one file and never sees a port or a password.",
        rejected: "Requiring Docker or a separately installed database, which kills adoption in this market.",
      },
    ],
    hardest: {
      title: "Process orchestration on Windows",
      body: "Three runtimes must start in order, survive sleep and resume, and shut down cleanly so Postgres never corrupts. The supervisor health-checks each one and restarts it with back-off.",
    },
    results: [
      "Checkout runs at local speed regardless of connectivity.",
      "Per-install secrets and an off-site cloud backup without any setup by the shop owner.",
    ],
    nextTime: "Add a first-run setup flow and code signing earlier. Distribution polish is half the product in desktop software.",
  },
  {
    slug: "dashboard-desktop",
    name: "Dashboard Desktop",
    kicker: "Offline gateway · Solo build",
    tagline: "Took a large, online-only React dashboard offline without changing a single line of it.",
    summary:
      "An Electron container that wraps an existing ~950-file school dashboard. A local API gateway in the main process caches reads, serves them offline and queues writes in an encrypted outbox that replays on reconnect.",
    year: "2026",
    role: "Architect & sole engineer",
    team: "Solo",
    status: "Built & packaged",
    stack: ["Electron", "Node.js", "Encrypted SQLite", "electron-updater", "NSIS · AppImage · DMG"],
    metrics: [
      { value: "0", label: "lines changed in the web app" },
      { value: "8.6k", label: "lines of gateway code" },
      { value: "3", label: "OS installers" },
      { value: "At rest", label: "encrypted local store" },
    ],
    problem:
      "Schools in areas with unreliable power and internet couldn't use the dashboard during outages, but rewriting a 236k-line React app for offline use was off the table.",
    constraints: [
      "No changes to the React codebase. It ships to the web from the same repo.",
      "Data at rest on shared school PCs must be encrypted.",
      "Writes made offline must reach the server exactly once, in order.",
    ],
    diagram: {
      nodes: [
        { id: "app", label: "React app", sub: "unchanged", x: 110, y: 200, tone: "edge" },
        { id: "gw", label: "Local gateway", sub: "Electron main", x: 330, y: 200, tone: "core" },
        { id: "db", label: "SQLite", sub: "encrypted cache", x: 330, y: 340, tone: "store" },
        { id: "outbox", label: "Outbox", sub: "ordered replay", x: 540, y: 320, tone: "store" },
        { id: "api", label: "School APIs", sub: "cloud", x: 700, y: 200, tone: "core" },
      ],
      edges: [
        { from: "app", to: "gw" },
        { from: "gw", to: "db" },
        { from: "gw", to: "outbox" },
        { from: "gw", to: "api" },
        { from: "outbox", to: "api" },
      ],
      steps: [
        {
          caption:
            "The unchanged React app calls its normal API URL; the container points that at a gateway in the main process.",
          edges: [["app", "gw"]],
        },
        {
          caption: "Online, reads pass through to the cloud and are written to the encrypted cache on the way back.",
          edges: [
            ["gw", "api"],
            ["gw", "db"],
          ],
        },
        {
          caption: "Offline, the gateway answers reads from the cache and records writes in an ordered outbox.",
          edges: [
            ["gw", "db"],
            ["gw", "outbox"],
          ],
        },
        {
          caption:
            "On reconnect the replayer drains the outbox in order, with idempotency keys so a retry never duplicates a record.",
          edges: [["outbox", "api"]],
        },
      ],
    },
    decisions: [
      {
        title: "Intercept at the network boundary",
        body: "Putting offline behaviour behind the app's own HTTP contract means the web team keeps shipping features while desktop gets them for free.",
        rejected: "Forking the React app for desktop, which doubles the maintenance forever.",
      },
    ],
    hardest: {
      title: "Write conflicts after a long outage",
      body: "A record edited offline may have changed on the server too. The replayer detects version conflicts and surfaces them instead of silently overwriting someone's work.",
    },
    results: [
      "The dashboard stays usable through outages, with auto-updates on Windows, Linux and macOS.",
      "The web codebase remains the single source of truth.",
    ],
    nextTime: "Expose sync state in the UI from day one; users trust offline mode far more when they can see the queue.",
  },
  {
    slug: "presence",
    name: "Proof of Presence",
    kicker: "Security engineering · Solo build",
    tagline: "Office attendance that can't be faked from home, using cryptographically signed LAN presence.",
    summary:
      "An attendance system for a software house. Each laptop holds an Ed25519 identity, and a tiny office gateway signs short-lived presence tokens that only exist on the office network. The server decides, not the client.",
    year: "2026",
    role: "Architect & sole engineer",
    team: "Solo",
    status: "Built · 83 tests",
    stack: ["Electron", "React 19", "Supabase", "Postgres RLS", "Edge Functions", "Ed25519", "Docker"],
    metrics: [
      { value: "83", label: "tests: protocol, RLS, e2e" },
      { value: "Ed25519", label: "device identity" },
      { value: "0", label: "trust in the client clock" },
      { value: "0", label: "runtime deps in the gateway" },
    ],
    problem:
      "Check-in buttons and GPS are trivially spoofed. The company wanted attendance that proves a device is physically on the office network, without invasive tracking.",
    constraints: [
      "Must not rely on anything the employee's device asserts about itself.",
      "Gateway must run on any office box with no maintenance.",
      "Row-level security so employees only ever see their own records.",
    ],
    diagram: {
      nodes: [
        { id: "dev", label: "Laptop", sub: "Ed25519 key", x: 120, y: 200, tone: "edge" },
        { id: "gw", label: "Office gateway", sub: "LAN only", x: 360, y: 90, tone: "core" },
        { id: "edge", label: "Edge Function", sub: "verifies", x: 520, y: 260, tone: "core" },
        { id: "db", label: "Postgres", sub: "RLS", x: 710, y: 260, tone: "store" },
      ],
      edges: [
        { from: "dev", to: "gw" },
        { from: "dev", to: "edge" },
        { from: "edge", to: "db" },
      ],
      steps: [
        {
          caption: "The laptop asks the gateway, reachable only on the office LAN, for a short-lived presence token.",
          edges: [["dev", "gw"]],
        },
        { caption: "It submits the gateway token, countersigned with its own device key.", edges: [["dev", "edge"]] },
        {
          caption: "The server verifies both signatures and the freshness window, then records attendance under RLS.",
          edges: [["edge", "db"]],
        },
      ],
    },
    decisions: [
      {
        title: "Two signatures, server time",
        body: "The gateway proves location, the device key proves identity, and the server's clock decides freshness. Spoofing it means compromising two keys and the LAN.",
        rejected: "GPS or IP checks, which are easy to fake and invasive.",
      },
    ],
    hardest: {
      title: "Replay resistance",
      body: "A captured token must be useless an hour later or on another device. Tokens bind the device public key, a nonce and a short expiry, and each one is consumed exactly once.",
    },
    results: [
      "Documented architecture, threat model and deployment guides alongside the code.",
      "83 automated tests spanning protocol, gateway, SQL policies and end-to-end flows.",
    ],
    nextTime: "Add hardware-backed key storage (TPM / Secure Enclave) for the device identity.",
  },
  {
    slug: "clinic",
    name: "Clinic Suite",
    kicker: "Production desktop · Team",
    tagline: "Clinic management used daily since 2024, built to keep running on a single PC with patchy internet.",
    summary:
      "An Electron + Express desktop suite for patients, appointments, doctors, stock and billing. PouchDB replicates live to CouchDB, so every clinic workstation works offline and converges when back online.",
    year: "2024 – 2026",
    role: "Full-stack engineer", // TODO: confirm exact role wording
    team: "Small team",
    status: "In production since 2024",
    stack: ["Electron", "Express", "React", "Tailwind", "PouchDB", "CouchDB", "NSIS · DMG"],
    metrics: [
      { value: "2+ yrs", label: "in daily production use" },
      { value: "42k", label: "lines of code" },
      { value: "18", label: "domain controllers" },
      { value: "680+", label: "commits shipped" },
    ],
    problem:
      "Clinics needed patient records, appointments, pharmacy stock and billing on reception PCs that lose internet regularly, with no on-site IT.",
    constraints: [
      "Every workstation fully usable offline.",
      "Reports must stay fast as the data grows year over year.",
      "Installer-based updates for non-technical staff.",
    ],
    diagram: {
      nodes: [
        { id: "ui", label: "Reception UI", sub: "React", x: 120, y: 200, tone: "edge" },
        { id: "api", label: "Express", sub: "18 controllers", x: 330, y: 200, tone: "core" },
        { id: "pouch", label: "PouchDB", sub: "local", x: 530, y: 200, tone: "store" },
        { id: "couch", label: "CouchDB", sub: "clinic server", x: 710, y: 200, tone: "store" },
      ],
      edges: [
        { from: "ui", to: "api" },
        { from: "api", to: "pouch" },
        { from: "pouch", to: "couch" },
      ],
      steps: [
        { caption: "Reception books an appointment through the local Express layer inside Electron.", edges: [["ui", "api"]] },
        { caption: "It is written to PouchDB on the workstation, so it's instant and offline-safe.", edges: [["api", "pouch"]] },
        {
          caption: "Live two-way replication converges every workstation through CouchDB when the network returns.",
          edges: [["pouch", "couch"]],
        },
      ],
    },
    decisions: [
      {
        title: "Replication over request/response",
        body: "CouchDB's replication protocol gives multi-master sync with revision history out of the box, a better fit for clinics than a custom sync API.",
        rejected: "A central SQL server, which stops the clinic when the network drops.",
      },
    ],
    hardest: {
      title: "Keeping reports fast at scale",
      body: "As records grew, map/reduce views and replication became the bottleneck. I profiled view builds and replication filters and wrote a performance plan to restructure indexes and scope sync.",
    },
    results: [
      "In daily use since 2024 across patients, appointments, stock, transactions and reports.",
      "Architecture reused for a pharmacy management variant.",
    ],
    nextTime: "Design document keys and views for reporting from the start; it's much cheaper than re-indexing years of data.",
  },
];

export const moreWork = [
  {
    name: "Clean-Architecture Mail Service",
    stack: "ASP.NET Core 8 · EF Core · xUnit",
    note: "Domain / Application / Infrastructure layers, JWT, FluentValidation, Serilog, unit and integration tests.",
  },
  {
    name: "EduAgent",
    stack: "FastAPI · CrewAI · SQLAlchemy",
    note: "Multi-agent assistant (router, student, analytics, report agents) that generates PDF progress reports.",
  },
  {
    name: "Identity & IAM Portal",
    stack: "NestJS · Prisma · RabbitMQ · React",
    note: "Identity microservice and admin portal for users, roles and OAuth for a commerce platform.",
  },
  {
    name: "Platform Dev Stack",
    stack: "Docker Compose · nginx · Bash",
    note: "One command brings up 6 services, Postgres, Redis, RabbitMQ and Mailpit, seeded and health-checked.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
