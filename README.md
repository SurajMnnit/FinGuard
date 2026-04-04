# FinGuard API Backend 🛡️

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://finguard-s4r4.onrender.com/)
[![API Docs](https://img.shields.io/badge/API-Docs-blue)](https://finguard-s4r4.onrender.com/api-docs)

A production-ready robust backend system for Finance Data Processing and Access Control, built using Node.js, Express, PostgreSQL, and Prisma ORM.

**Live URL**: [https://finguard-s4r4.onrender.com/](https://finguard-s4r4.onrender.com/)


## Features

- **User & Role Management**: Register, Authenticate, and manage multiple roles (Viewer, Analyst, Admin).
- **Role-Based Access Control (RBAC)**: Strict permission enforcement on APIs using middleware.
- **Financial Records**: Complete CRUD functionality handling transactions (Income, Expense). Filtered and secured according to user role.
- **Dashboard Analytics**: Real-time SQL aggregation utilizing Prisma (Total Income, Total Expense, Net Balance, Category-wise totals, Monthly Trends, Recent Transactions).
- **Validation**: Strict schema validation using Joi for payloads and types.
- **Swagger Documentation**: Interactive API documentation.
- **Containerized**: Pre-configured Dockerfile for rapid deployments.

## Tech Stack

- Node.js & Express.js
- PostgreSQL
- Prisma ORM
- TypeScript
- JWT Authentication
- Bcrypt
- Joi Validation
- Swagger UI (YAML)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SurajMnnit/FinGuard.git
   cd FinGuard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file from the provided setup:
   ```bash
   # .env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1d
   DATABASE_URL="postgresql://username:password@localhost:5432/finguard"
   ```

4. Database Migration:
   Run Prisma migrations to set up the DB schemas.
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the Server:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000`.

---

## Deployment Guide (Render / Railway)

You can deploy the backend securely using platforms like Render or Railway. 

### Render Manual Deployment Steps:
1. Connect your GitHub repository to Render and create a new **Web Service**.
2. **Build Command**: `npm run render:build`
3. **Start Command**: `npm run render:start`
4. **Environment Variables**:
   Add `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`.

---

## API Documentation

The project includes an interactive UI for exploring APIs via Swagger.
Navigate to the docs route after starting up:

**Production:** [https://finguard-s4r4.onrender.com/api-docs](https://finguard-s4r4.onrender.com/api-docs)
**Local:** `http://localhost:5000/api-docs`

---

## Scripts

- `npm run start` - Starts the compiled Node.js server.
- `npm run dev` - Runs the server in development mode using Nodemon.
- `npm run build` - Compile the TypeScript code to plain JavaScript.
- `npm run render:build` - Build command optimized for Render (installs devDeps for compilation).
- `npm run render:start` - Start command optimized for Render (ensures DB schema is pushed).
- `npm run prisma:migrate` - Applies outstanding Prisma migrations on Production.

---

> FinGuard API Built with ❤️
