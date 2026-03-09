# 🍦 IScream

**IScream** is a full-stack, membership-based ice cream recipe sharing and merchandise platform. Members unlock premium recipes, order ice cream books and products, submit their own recipes for community review, and leave feedback — all backed by a secure, role-based API.

---

## ✨ Features

- **Authentication & Roles** — JWT-based login and registration with `MEMBER` and `ADMIN` roles
- **Subscription / Membership** — Tiered membership plans gate access to premium recipe content
- **Recipe Catalog** — Browse and read ice cream recipes; full ingredients and steps unlocked for active members
- **E-Commerce** — Order ice cream books and merchandise with full order and shipment tracking
- **Payments** — Create, confirm, and handle payment failures; memberships auto-activate on successful payment
- **Recipe Submissions (UGC)** — Users submit their own recipes; admins approve or reject them with optional rewards
- **Feedback** — General feedback form with admin read/management workflow
- **Admin Dashboard** — Manage users, recipes, orders, submissions, and feedback through a dedicated admin UI

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| **Backend** | Azure Functions v4, C# 13, .NET 10 |
| **Database** | SQL Server (Azure SQL or LocalDB) — raw ADO.NET, no ORM |
| **Authentication** | JWT (System.IdentityModel.Tokens.Jwt) + BCrypt password hashing |
| **API Docs** | OpenAPI / Swagger (auto-generated) |
| **Deployment** | Azure Static Web Apps (frontend) + Azure Functions (backend) |
| **CI/CD** | GitHub Actions |

---

## 🗂 Project Structure

```
IScream/
├── backend/                  # Azure Functions (.NET 10) API
│   ├── Database/             # SQL setup scripts
│   ├── Functions/            # HTTP-triggered function endpoints
│   ├── Services/             # Business logic layer
│   ├── Data/                 # Repository pattern (ADO.NET)
│   └── Models/               # Entities and DTOs
├── frontend/                 # Next.js application
│   └── src/
│       ├── app/              # Pages (App Router)
│       ├── components/       # Reusable UI components
│       ├── services/         # API client service functions
│       ├── types/            # TypeScript type definitions
│       └── config/           # API endpoints and route constants
└── .github/workflows/        # CI/CD pipelines
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Required for the frontend |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0 | Required for the backend |
| [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) | v4 | `npm install -g azure-functions-core-tools@4` |
| [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) | latest | Local Azure Storage emulator — `npm install -g azurite` |
| SQL Server | any | [LocalDB](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb) (Windows) or [SQL Server Developer](https://www.microsoft.com/sql-server/sql-server-downloads) |

> **Windows users:** LocalDB ships with Visual Studio and SQL Server Express. Check it's available with `sqllocaldb info`.

---

### Step 1 — Set up the database

Create the database and run the schema setup script (from the repo root):

```bash
# Create the database
sqlcmd -S "(localdb)\mssqllocaldb" -Q "IF DB_ID('IceCreamRecipeDB') IS NULL CREATE DATABASE IceCreamRecipeDB"

# Create schema, tables, and seed default membership plans
sqlcmd -S "(localdb)\mssqllocaldb" -d IceCreamRecipeDB -i backend/Database/001_CreateSchema.sql
```

> **Using SQL Server Management Studio (SSMS) or Azure Data Studio?**
> Connect to `(localdb)\mssqllocaldb`, create `IceCreamRecipeDB`, then open and execute `backend/Database/001_CreateSchema.sql`.

> **Using Azure SQL?** Replace `(localdb)\mssqllocaldb` with your server address and add `-U <user> -P <password>` to the commands above.

---

### Step 2 — Configure the backend

Create `backend/local.settings.json` (this file is gitignored and never committed):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "SqlConnectionString": "Server=(localdb)\\mssqllocaldb;Database=IceCreamRecipeDB;Integrated Security=true;TrustServerCertificate=true;",
    "JwtSecretKey": "replace-this-with-a-random-secret-at-least-32-chars!!",
    "JwtIssuer": "iscream-api",
    "JwtAudience": "iscream-client"
  }
}
```

> ⚠️ `JwtSecretKey` **must be at least 32 characters long**. The application will refuse to start if it is missing or too short. Generate a strong random value — for example:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

> ⚠️ `AzureWebJobsStorage` is set to `UseDevelopmentStorage=true`, which requires **Azurite** to be running (see Step 3).

---

### Step 3 — Start Azurite (local Azure Storage emulator)

The Azure Functions runtime requires a storage emulator even when your code does not use Blob or Queue storage.

```bash
# In a separate terminal, start Azurite
azurite --silent
```

---

### Step 4 — Start the backend API

```bash
cd backend
func start
```

The API starts on **http://localhost:7071**. Verify with:

```bash
curl http://localhost:7071/api/health
# → {"status":"healthy","timestamp":"..."}
```

**Swagger UI** (interactive API docs): http://localhost:7071/api/swagger/ui

---

### Step 5 — Configure the frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:7071/api
```

> `NEXT_PUBLIC_API_URL` **must be set**. The frontend will throw an error on startup if it is missing.

---

### Step 6 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at **http://localhost:3000**.

---

### Step 7 — Create an admin user (first-time setup)

Register a regular account through the app or API, then promote it to admin directly in the database:

```sql
UPDATE public_data.USERS
SET Role = 'ADMIN'
WHERE Username = 'your_username';
```

> Admin routes on the frontend are protected and only accessible with an `ADMIN` role JWT. Log out and back in after changing the role.

---

## 🔐 Environment Variables

### Backend — `backend/local.settings.json`

| Key | Required | Description |
|---|---|---|
| `SqlConnectionString` | ✅ Yes | SQL Server connection string |
| `JwtSecretKey` | ✅ Yes | JWT signing secret — **minimum 32 characters** |
| `JwtIssuer` | No | JWT issuer claim (default: `iscream-api`) |
| `JwtAudience` | No | JWT audience claim (default: `iscream-client`) |
| `AzureWebJobsStorage` | ✅ Yes | Set to `UseDevelopmentStorage=true` locally, or a real Azure Storage connection string |
| `FUNCTIONS_WORKER_RUNTIME` | ✅ Yes | Must be `dotnet-isolated` |

### Frontend — `.env.local`

| Key | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Base URL of the backend API (e.g. `http://localhost:7071/api`) |
| `NEXT_PUBLIC_SITE_URL` | No | Public URL of the frontend (e.g. `http://localhost:3000`) |

---

## 🗄 Database Schema

The backend uses a single SQL Server schema `public_data` with the following tables:

| Table | Description |
|---|---|
| `USERS` | User accounts — roles: `MEMBER`, `ADMIN` |
| `RECIPES` | Admin-managed ice cream recipes |
| `ITEMS` | Shop items / merchandise |
| `ITEM_ORDERS` | Customer orders (`PENDING → PAID → SHIPPED → DELIVERED`) |
| `PAYMENTS` | Payment records — types: `MEMBERSHIP`, `ORDER` |
| `MEMBERSHIP_PLANS` | Subscription plans (seeded: `MONTHLY`, `YEARLY`) |
| `MEMBERSHIP_SUBSCRIPTIONS` | Active/expired user memberships |
| `RECIPE_SUBMISSIONS` | Community recipe submissions (`PENDING → APPROVED/REJECTED`) |
| `FEEDBACKS` | User feedback messages |

---

## 🧪 Running Both Services Together

Open two terminal tabs from the repo root:

**Terminal 1 — Azurite + Backend:**
```bash
azurite --silent &
cd backend && func start
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

---

## 🔧 Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `InvalidOperationException: JwtSecretKey environment variable is required` | Missing or empty `JwtSecretKey` in `local.settings.json` | Add a 32+ character value |
| `InvalidOperationException: JwtSecretKey must be at least 32 characters` | `JwtSecretKey` is too short | Use a longer secret |
| `InvalidOperationException: SqlConnectionString is required` | Missing connection string | Add `SqlConnectionString` to `local.settings.json` |
| `Error: NEXT_PUBLIC_API_URL environment variable is required` | Missing frontend env var | Create `.env.local` from `.env.example` |
| `Cannot connect to SQL Server` | LocalDB not started or wrong instance | Run `sqllocaldb start MSSQLLocalDB` (Windows) |
| `Microsoft.Data.SqlClient.SqlException: Invalid object name 'public_data.USERS'` | Database tables not created | Run `backend/Database/001_CreateSchema.sql` |
| `Azure Functions Core Tools not found` | Missing runtime | Install: `npm install -g azure-functions-core-tools@4` |
| Azurite connection error | Azurite not running | Start with `azurite --silent` in a separate terminal |
| `func start` fails to load | Build error | Run `dotnet build` in `backend/` first to see compiler errors |

---

## 🚢 Deployment

The project is pre-configured for Azure deployment via GitHub Actions:

- **Backend** → Azure Functions App (workflow: `.github/workflows/main_iscream.yml`)
- **Frontend** → Azure Static Web Apps (workflow: `.github/workflows/azure-static-web-apps-purple-stone-0d019e200.yml`)

Both workflows deploy on push to `main`. The backend workflow only triggers when files under `backend/` change; the frontend workflow only triggers when files under `frontend/` change.

Required GitHub secrets for deployment:

| Secret | Used By |
|---|---|
| `AZUREAPPSERVICE_CLIENTID_*` | Backend workflow (OIDC) |
| `AZUREAPPSERVICE_TENANTID_*` | Backend workflow (OIDC) |
| `AZUREAPPSERVICE_SUBSCRIPTIONID_*` | Backend workflow (OIDC) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_*` | Frontend workflow |

---

## 📖 Additional Documentation

- [`backend/Database/001_CreateSchema.sql`](./backend/Database/001_CreateSchema.sql) — Full database schema and seed data
- [`BACKEND_SUMMARY.md`](./BACKEND_SUMMARY.md) — Backend architecture overview
- [`backend/DATABASE_SETUP.md`](./backend/DATABASE_SETUP.md) — Detailed database design guide

---

## 📄 License

This project is open-source. See [LICENSE](./LICENSE) for details (if present).
