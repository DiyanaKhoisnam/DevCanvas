# DevCanvas - Interactive Software Architecture Designer

**DevCanvas** is a production-quality SaaS application designed for developers, architects, and engineering teams to visually build, document, validate, and export software architectures.

---

## 🌟 Key Features

1. **Interactive Visual Canvas**:
   - Built on top of **React Flow** and **Zustand** with high-performance viewport rendering.
   - Multi-tier drag-and-drop component library (Frontend, API Gateway, Microservices, Relational DBs, Redis Caches, Message Queues, Object Storage, Security Servers).
   - Custom nodes with port anchors, health status, tech stack tags, and monthly cloud cost metrics.
   - Animated bezier data flow connections with protocol markers (`HTTPS`, `gRPC`, `TCP 5432`, `RESP`).

2. **Real-Time Architecture Health Linter**:
   - Automated rule-based diagnostic engine.
   - Detects direct database exposure to client tiers, isolated nodes, single points of failure, and insecure network traffic.
   - Real-time **Health Score** gauge (e.g. 92/100) with diagnostic recommendations.

3. **Data Flow Packet Simulator**:
   - Interactive simulation mode that animates visual data packets along edge pathways.

4. **Multi-Format Export & IaC Code Generator**:
   - **Terraform (HCL)** generator: Converts visual nodes directly into production-ready AWS Terraform configuration.
   - **Markdown Documentation**: Auto-generates complete architectural specifications with component catalogs and connection matrices.
   - **High-DPI PNG** and **PDF Document** rasterization.
   - **JSON Blueprint** export/import schema.

5. **Security & Authentication**:
   - JWT access tokens in memory combined with **HTTP-Only, SameSite, Secure Refresh Cookies**.
   - Token family rotation and revocation tracking backed by PostgreSQL.

6. **Pre-Built Starter Templates**:
   - Microservices Architecture, Serverless Event-Driven System, and Monolithic patterns.

---

## 🛠 Tech Stack

### Frontend (`/apps/client` or `/client`)
- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Glassmorphism design system
- **Canvas Engine**: `@xyflow/react` (React Flow)
- **State Management**: Zustand, React Query (`@tanstack/react-query`)
- **Animations & Icons**: Framer Motion, Lucide React
- **Exporting**: `html-to-image`, `jspdf`, `dagre`

### Backend (`/apps/server` or `/server`)
- **Runtime**: Node.js, Express.js, TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, Refresh Token Family Rotation, bcryptjs
- **Validation**: Zod schema validation
- **Architecture Linter**: Custom rule-based validation service

### Infrastructure & Deployment
- Docker, Docker Compose, Nginx

---

## 🚀 Getting Started

### 1. Local Development Mode

#### Backend Setup
```bash
cd server
npm install
# Set up your PostgreSQL connection string in .env
npx prisma generate
npx prisma db push # or npx prisma migrate dev
npm run dev
# Server running at http://localhost:5001
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
# Client running at http://localhost:5173
```

---

### 2. Docker Deployment

Launch PostgreSQL, Express Server, and Nginx Client with a single command:

```bash
docker-compose up --build -d
```

- **Frontend App**: `http://localhost`
- **Backend API**: `http://localhost:5001`
- **PostgreSQL Database**: `localhost:5432`

---

## 📁 Repository Structure

```
devcanvas/
├── docker-compose.yml
├── README.md
├── client/                 # Vite + React + TypeScript + React Flow + Tailwind
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── src/
│   │   ├── components/    # CanvasHeader, LibraryPanel, PropertyInspector, ValidationDrawer, ExportModal, Toolbar
│   │   ├── pages/         # LandingPage, LoginPage, RegisterPage, DashboardPage, CanvasWorkspacePage, TemplatesPage
│   │   ├── stores/        # useCanvasStore, useAuthStore, useUIStore
│   │   ├── services/      # Axios API client
│   │   ├── types/         # ArchitectureNode, ArchitectureEdge, ValidationIssue
│   │   ├── index.css      # Glassmorphism tokens & CSS variables
│   │   └── App.tsx
└── server/                 # Express + TypeScript + Prisma ORM + JWT Auth
    ├── Dockerfile
    ├── prisma/
    │   └── schema.prisma  # User, RefreshToken, Project, Diagram, Template models
    └── src/
        ├── controllers/   # auth, project, diagram, template, export controllers
        ├── middleware/    # authGuard
        ├── services/      # ArchitectureValidationService (rule engine)
        ├── utils/         # jwt helpers
        ├── app.ts
        └── index.ts
```

---

© 2026 DevCanvas. Production-Grade SaaS Architecture Designer.
