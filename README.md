# Thiqa | ثقة

A commitment-scoring platform for cash-on-delivery (COD) orders.

COD is the dominant payment method in the region, but merchants carry the risk: customers reject or fail to receive orders after the merchant has already paid for shipping and handling. Thiqa gives every customer a commitment score based on their COD order history, so merchants can decide who to ship to before the cost is sunk.

Graduation project — Arab Open University, Computer Science, 2026-2027.

## Overview

The platform has two sides:

**Customer app** — customers see their own commitment score, the order history behind it, and what raises or lowers it.

**Merchant dashboard** — merchants see incoming orders with the customer's score attached, filter and review order history, and set a minimum score threshold for accepting COD orders.

## Tech stack

**Frontend** (this repo)
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** — component layer

**Backend**
- **Spring Boot** — REST API
- **Spring Security** — JWT authentication
- **Spring Data JPA** — persistence
- **PostgreSQL**

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/thiqa.git
cd thiqa
npm install
npm run dev
```

Open http://localhost:3000

## Project structure
