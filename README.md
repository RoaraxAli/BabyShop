# BabyShop

BabyShop is the standalone Next.js website version of BabyShopHub. It lives beside the existing Flutter project and is designed as the public website, documentation site, downloads hub, and web app entry point.

## What Is Included

- Public BabyShopHub homepage
- About page
- Contact page
- Downloads page for Flutter and web build targets
- Firebase login at `/login`
- Customer shop at `/shop`
- Admin panel at `/admin`
- Product category and catalog sections for signed-in customers
- Documentation hub at `/documentation`
- 20+ dedicated documentation pages
- Shared navigation and footer components
- Local content model in `lib/data.ts`
- Documentation content model in `lib/docs.ts`
- Modern CSS design system in `app/globals.css`

## Project Location

```text
C:\Users\Muhammad Ali\Downloads\BabyShopHub\BabyShop
```

This is intentionally not inside:

```text
C:\Users\Muhammad Ali\Downloads\BabyShopHub\BabyShopHub
```

## Folder Structure

```text
BabyShop/
  app/
    docs/
      developer/page.tsx
      user/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    Footer.tsx
    Nav.tsx
  lib/
    data.ts
  public/
  package.json
  next.config.mjs
  tsconfig.json
```

## Setup

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start production build:

```bash
npm run start
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public BabyShopHub homepage |
| `/about` | Product/company overview |
| `/contact` | Contact and support entry page |
| `/downloads` | Android, iOS, web, desktop, and Next.js build target page |
| `/login` | Firebase email/password and Google login |
| `/register` | Firebase account creation |
| `/shop` | Customer shopping web app |
| `/admin` | Admin panel for admin users |
| `/documentation` | Documentation home |
| `/documentation/[slug]` | Full documentation pages |
| `/docs/user` | Legacy user docs route |
| `/docs/developer` | Legacy developer docs route |

## Recommended Domain Plan

Use these production domains:

```text
web.yourdomain.com   -> BabyShop website, login, shop, and admin
docs.yourdomain.com  -> BabyShop documentation
```

You can serve both from this same Next.js project. For a later production split, deploy the same project twice and route the docs domain to `/documentation`.

## User Documentation Summary

The documentation covers:

- Product overview
- Getting started
- Installation
- Domain strategy
- Downloads and platform builds
- Accounts
- Browsing products
- Shopping
- Cart and checkout
- AI assistant
- Orders
- Shipping
- Returns and refunds
- Architecture
- Frontend
- Backend
- Data model
- Deployment
- Testing
- Security
- Admin operations
- Troubleshooting
- Maintenance

## Content Editing

Update product, category, trust, workflow, and documentation link content in:

```text
lib/data.ts
```

Update documentation pages in:

```text
lib/docs.ts
```

Update visual styling in:

```text
app/globals.css
```

## Production Notes

- Move important images into `public/` before launch.
- Do not commit secrets or API keys.
- Add real cart, auth, inventory, and checkout APIs before accepting live orders.
- Use `next/image` with configured remote patterns if remote images stay in production.
- Run `npm run build` before deployment.
