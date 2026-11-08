# West Bengal AI Smart Bus Booking Platform
> **Sprint 0: Walking Skeleton** — End-to-End Hello World on Java 25, Spring Boot 4.1, Neon PostgreSQL 18, and React 19.

---

## 🚌 Overview
An AI-assisted intercity bus search and booking platform for West Bengal commuters and students. Designed to compare government (WBTC, SBSTC, NBSTC) and private operators, stage concurrency-safe bookings, and deliver disruption alerts.

---

## 🛠 Technology Stack
- **Language & Runtime:** Java 25 (LTS) with Virtual Threads enabled
- **Backend Framework:** Spring Boot 4.1.x with Maven Wrapper (`./mvnw` / `mvnw.cmd`)
- **Modules:** Spring Web, Spring Validation, Spring Security, Spring Data JPA, Flyway, Actuator, springdoc-openapi
- **Database:** PostgreSQL 18 with `pgvector` on Neon Free Tier (cloud SSL connection)
- **Cache & Locks:** Redis (Upstash Free in cloud / Docker local fallback)
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query
- **CI/CD:** Docker, GitHub Actions, Testcontainers

---

## 🚀 Onboarding Guide for Teammates (Cross-Platform)

Welcome to the team! Whether you are on **macOS** or **Windows**, follow the instructions below to get your local environment running in minutes.

### Method A: The Fast 1-Click Setup using Docker (Recommended for Windows)
If you have **Docker Desktop** installed, you do **not** need to install Java 25, Maven, or configure environment paths! Docker will run everything inside an identical Linux container.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Soumabha100/Smart-Bus-App.git
   cd Smart-Bus-App
   ```
2. **Create your `.env` file:**
   * On Mac/Linux: `cp .env.example .env`
   * On Windows (PowerShell): `Copy-Item .env.example .env`
   * Fill in your Neon PostgreSQL 18 credentials.
3. **Start the backend with Docker:**
   ```bash
   docker compose up --build backend
   ```
4. **Start the frontend (in a separate terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. **Verify:**
   * Backend Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   * Frontend App: [http://localhost:5173](http://localhost:5173)

---

### Method B: Native Setup (Without Docker)

#### 1. Prerequisites
- **Java 25 (LTS):** Verify with `java -version`
- **Node.js 20+ or 22+:** Verify with `node -v`

#### 2. Configure Environment (`.env`)
In the root directory, create `.env` from `.env.example`:
```env
PORT=8080
DB_HOST=ep-steep-pine-azpymfz5-pooler.c-3.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=your_neon_password
DB_SSL_MODE=require
```

#### 3. Run Backend (Spring Boot)
* **On macOS / Linux:**
  ```bash
  cd backend
  chmod +x ./mvnw
  export $(grep -v '^#' ../.env | xargs) && ./mvnw spring-boot:run
  ```
* **On Windows (PowerShell):**
  ```powershell
  cd backend
  Get-Content ..\.env | Where-Object { $_ -notmatch '^#' -and $_ -match '=' } | ForEach-Object { $var = $_.Split('=', 2); [System.Environment]::SetEnvironmentVariable($var[0], $var[1]) }
  .\mvnw.cmd spring-boot:run
  ```

#### 4. Run Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🏛 Architecture & Layering Rules (From `AGENTS.md`)
1. **Strict Layering:** `Controller -> Service -> Repository`.
   - **Controllers:** HTTP validation, route mapping, zero business logic.
   - **Services:** Business logic, transaction boundaries (`@Transactional`).
   - **Repositories:** Pure Spring Data JPA interfaces.
2. **DTOs:** All request and response objects MUST be immutable Java `record` types.
3. **No Hardcoded Secrets:** All credentials must come from environment variables.
4. **DPDP 2025 Privacy:** Never pass passenger PII (names, phone numbers, emails) to AI models.
