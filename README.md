# VoltEdge

Storefront, admin panel and API for VoltEdge.

| App | Folder | Stack | Dev URL |
| --- | --- | --- | --- |
| Storefront | `client/` | Next.js 16, React 19, Tailwind v4 | http://localhost:3000 |
| Admin panel | `admin/` | Next.js 16, React 19, Tailwind v4 | http://localhost:3001 |
| API | `server/` | Node, Express 4, Mongoose 8, Zod, JWT | http://localhost:4000/api |

The storefront and the admin panel both talk to the same API and the same MongoDB database.

## Run it locally

You need Node.js 20+ and a MongoDB. For a local one: `cd server && docker compose up -d`.

```bash
# 1. API
cd server
cp .env.example .env        # set JWT_SECRET (a random one is already filled in if .env exists)
npm install
npm run seed                # sample products, customers, orders, repairs + the admin login
npm run dev                 # http://localhost:4000/api

# 2. Storefront
cd ../client
cp .env.local.example .env.local
npm install && npm run dev  # http://localhost:3000

# 3. Admin panel
cd ../admin
cp .env.local.example .env.local
npm install && npm run dev  # http://localhost:3001
```

Admin login after seeding: `admin@voltedge.co.za` / `voltedge123` (change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before seeding, and never keep the defaults in production).

`npm run seed` only adds what is missing. `npm run seed:reset` wipes the database first.

## Using MongoDB Atlas

Put the connection string in `server/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/voltedge?retryWrites=true&w=majority
```

Then run `npm run seed` once to create the admin user and starter data. Add the deployed storefront and admin origins to `CORS_ORIGINS`.

## How the pieces connect

- **Storefront → API (public):** product catalogue and store settings are loaded on the server in `client/src/app/layout.tsx`. Checkout, repair booking, trade-in requests, the contact form, the newsletter and order tracking call `/api/store/*`. Prices and stock are always checked on the server; the browser's prices are ignored.
- **Admin → API (JWT):** sign in at `/login`; the token is kept in the browser and sent on every request. Everything under `/api/admin/*` needs it. The panel refreshes itself every 30 seconds so new website orders appear.
- **Stock:** placing an order reserves stock atomically; cancelling an order in the admin returns it.
- **Tracking:** a customer needs the order/repair reference **and** the email used, so references cannot be guessed.

## API overview

All responses are `{ data }`; errors are `{ error: { message, details? } }`.

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/login`, `GET /auth/me` |
| Storefront (public) | `GET /store/products`, `GET /store/products/:id`, `GET /store/config`, `POST /store/orders`, `POST /store/repairs`, `POST /store/trade-ins/estimate`, `POST /store/trade-ins`, `POST /store/contact`, `POST /store/newsletter`, `GET /store/track` |
| Admin (JWT) | `GET /admin/bootstrap`, `PATCH /admin/orders/:id/status`, `POST/PATCH/DELETE /admin/products`, `POST/PATCH /admin/repairs`, `PATCH /admin/trade-ins/:id/status`, `PUT /admin/settings`, `PATCH /admin/messages/:id` |

`npm run smoke` (inside `server/`) checks routing, validation, auth and CORS without needing a database.

## Not built yet

- **Online payments.** Checkout creates the order as "Pending payment" and no card details are collected. Connect a gateway (Payflex, Yoco, PayFast, …) before taking real payments.
- **Emails / WhatsApp messages** to customers (order confirmations, "repair ready").
- Discount codes (the field in checkout is visual only) and product image upload in the admin (new products use a placeholder image).
