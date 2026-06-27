# AeroDust-Shield Dashboard

[![CI/CD Pipeline](https://github.com/cecb-cg/aerodust-shield/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/cecb-cg/aerodust-shield/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](package.json)
[![Docker](https://img.shields.io/badge/Docker-Ready-success.svg)](Dockerfile)

A production-grade, highly performant, secure, and accessible executive dashboard built for the **Chhattisgarh Environment Conservation Board (CECB)** and **Ministry of Road Transport and Highways (MoRTH)**. It visualizes the adoption, physics simulation, and financial return (ROI) of the **AeroDust-Shield**—a retrofittable aerodynamic and triboelectric dust-mitigation system designed for heavy commercial vehicles (dumpers/tippers) operating in Indian mining and industrial belts.

---

## 🚀 Key Features

* **Interactive GIS Heat Map**: Programmatic vector rendering of Chhattisgarh districts (Korba, Raipur, Raigarh, etc.) overlaying live PM10, PM2.5, and heavy vehicle traffic densities.
* **Aerodynamic Fluid Dynamics Simulator**: An interactive 2D physics engine running on HTML5 Canvas. Models vehicle speed, road silt levels, and under-chassis air velocity to simulate dust particle lift-off, wake vortex suction, and AeroDust-Shield electro-static capture.
* **Financial & Public Health Planner**: Live calculators modeling CAPEX, annual diesel fuel savings (via aerodynamic drag reductions), payback progress metrics, CO₂ mitigations, and 5-Year Social ROI.
* **Technical Report Reader**: Embedded Markdown compiler with table of contents scroll anchoring to read the 16-section engineering design report.

---

## 🛠️ Technology Stack & Architecture

* **Frontend Framework**: React 18.x with TypeScript (strict-typing enabled).
* **Build Tooling**: Vite 5.x for hot module replacement (HMR), tree shaking, and rollup chunk optimization.
* **Styling System**: Modular Vanilla CSS with custom properties (CSS variables).
* **Testing Suite**: Vitest for unit test suites and math validation.
* **Containerization**: Multi-stage Dockerfile serving minified assets over a hardened non-root Nginx production configuration.

### Directory Structure

```text
project/
├── .github/                  # GitHub workflows, actions, & issue/PR templates
│   ├── ISSUE_TEMPLATE/       # Bug and Feature templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/            # CI/CD pipelines & Dependabot configurations
├── public/                   # Static public assets (icons, favicons)
├── src/                      # Application Source Code
│   ├── assets/               # SVG icons, vector assets
│   ├── components/           # Shared, reusable UI components
│   ├── constants/            # Static district, map coordinates, and timelines
│   ├── features/             # Feature-based folder division
│   │   ├── dashboard/        # Overview metrics & AQI comparison charts
│   │   ├── map/              # GIS Interactive map coordinates and sidebar
│   │   ├── planner/          # ROI calculations sliders
│   │   ├── report/           # Technical report markdown render target
│   │   └── simulator/        # Canvas render view
│   ├── hooks/                # Custom React hooks (useAeroSimulator, useRoiCalculator)
│   ├── lib/                  # Markdown compilers
│   ├── services/             # Mock API interfaces and telemetry dataLogger
│   ├── styles/               # Global resets and CSS variable tokens
│   ├── types/                # Strict TypeScript declaration types
│   ├── utils/                # Mathematical physics/financial formulas
│   ├── App.tsx               # Primary layout & state coordinator
│   └── main.tsx              # React mounting root entrypoint
├── tests/                    # Testing Suites
│   └── unit/                 # Vitest math and parser tests
├── .env.example              # Env template configs
├── .gitignore                # Blocked folders (node_modules, local secrets)
├── Dockerfile                # Multi-stage production container build
├── docker-compose.yml        # Orchestration setup
├── nginx.conf                # Secure headers and routing proxy
├── package.json              # Script runners and dependencies
└── tsconfig.json             # strict TypeScript compiler configurations
```

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v20.x or higher)
* **NPM** (v10.x or higher)

### Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/cecb-cg/aerodust-shield.git
   cd aerodust-shield
   ```
2. **Install Dependencies:**
   ```bash
   npm ci
   ```
3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env variables if integrating with CECB central node APIs
   ```
4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

5. **Run Linting & Formatting:**
   ```bash
   npm run lint
   npm run format
   ```
6. **Run Unit Tests:**
   ```bash
   npm run test
   ```

---

## 🐳 Docker Deployment (Production-Ready)

The dashboard is configured for immediate deployment using Docker containers serving assets over an Nginx reverse proxy hardened with secure headers:

### Deploy locally via Docker Compose:
```bash
docker-compose up -d --build
```
This builds the multi-stage image, strips devDependencies, compile-checks TypeScript, minifies assets, sets up non-root execution permissions, and binds the container port to `http://localhost:8080`.

### Nginx Security Configurations (`nginx.conf`):
* **Security Headers**: Injects `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a strict `Content-Security-Policy (CSP)`.
* **Caching**: Implements aggressive caching headers for minified JS/CSS (`immutable` 1 year) and images (10 days).
* **Gzip Compression**: Compresses files larger than 10KB on the fly.
* **Healthcheck**: Directs container status probes to `/health` returning `200 OK`.

---

## 🔒 Security Auditing

* **Input Sanitization**: Our lightweight compiler in `src/lib/markdownParser.ts` escapes brackets (`<` to `&lt;`) to sanitize inputs and prevent Cross-Site Scripting (XSS) injections in markdown viewing.
* **Credential Protection**: The telemetry logger (`src/services/dataLogger.ts`) dynamically redacts keys matching passwords, auth tokens, or API secrets, preventing leakage into log streams.
* **Container Hardening**: The Docker setup drops container privileges to `USER nginx` (non-root) to prevent escape exploits.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
