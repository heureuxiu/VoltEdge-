# VoltEdge — Tech Store Frontend

Modern, animated storefront for a phone & gadget shop (sales, repairs, trade-ins).
Frontend only — built with **Next.js (App Router)**, **Tailwind CSS v4** and **Motion**.

## Tech stack

| Purpose            | Library                                   |
| ------------------ | ----------------------------------------- |
| Framework          | `next` (App Router, TypeScript)           |
| Styling            | `tailwindcss` v4 (CSS-first `@theme`)     |
| Animation          | `motion` (`motion/react`, formerly Framer Motion) |
| Icons              | `lucide-react`                            |
| Class utilities    | `clsx` + `tailwind-merge` (`cn()` helper) |
| Fonts              | `next/font/google` — Inter + Space Grotesk |

## Getting started

```bash
npm install
npm run setup:images   # copies the downloaded product photos into public/images
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Pages (routes)

| Route              | Page                                              |
| ------------------ | ------------------------------------------------- |
| `/`                | Home — hero slider, 3D best-sellers carousel, sections |
| `/shop`            | Catalogue with search, type chips, brand filters, sort |
| `/shop/[slug]`     | Product detail — gallery, colour/condition/storage, tabs, related |
| `/cart`            | Cart → details → payment → confirmation flow      |
| `/repairs`         | Repair price list by device, process, FAQs        |
| `/repairs/book`    | 4-step repair booking wizard with live summary    |
| `/trade-in`        | Instant estimator, grading guide, checklist       |
| `/track`           | Order / repair tracking with status timeline      |
| `/contact`         | Contact channels, form, map, hours, service areas |

## Folder structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, info bar, header, footer, WhatsApp button
│   ├── page.tsx                # Home
│   ├── not-found.tsx
│   ├── globals.css             # Tailwind import, design tokens (@theme), keyframes
│   ├── shop/page.tsx
│   ├── shop/[slug]/page.tsx    # Statically generated for every product
│   ├── cart/page.tsx
│   ├── repairs/page.tsx
│   ├── repairs/book/page.tsx
│   ├── trade-in/page.tsx
│   ├── track/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/                 # AnnouncementBar, Header (active link), Footer, NewsletterForm, WhatsAppButton
│   ├── sections/               # Home page sections (one file each)
│   ├── product/ProductCard.tsx
│   ├── shop/                   # ShopCatalog, ProductDetail, ProductTabs, TrustStrip
│   ├── cart/CheckoutFlow.tsx
│   ├── repairs/                # RepairPriceList, BookingWizard
│   ├── trade-in/TradeInEstimator.tsx
│   ├── track/TrackOrder.tsx
│   ├── contact/ContactForm.tsx
│   └── ui/                     # Accordion, ButtonLink, ChoiceButton, Container, Field, Logo,
│                               # Marquee, PageHero (+Breadcrumbs), Reveal, SectionHeading, SuccessCheck
├── data/
│   ├── site.ts                 # Store details, routes, navigation, footer, hours
│   ├── products.ts             # Catalogue, colours, conditions, helpers
│   ├── content.ts              # Home page content
│   ├── repairs.ts              # Price list, process, FAQs, booking options
│   └── trade-in.ts             # Estimator questions, grades, checklist
├── lib/utils.ts                # cn(), wrapIndex(), circularOffset()
└── types/index.ts
public/images/                  # hero/ and products/ cut-outs
```

All links go through `routes` in `src/data/site.ts`, so a URL only ever changes in one place.
Forms, cart and tracking use demo data — look for `TODO` comments where your API plugs in.

## Customising

- **Store details** (name, phone, address, areas): `src/data/site.ts`
- **Products & prices**: `src/data/products.ts` — prices are `R [PRICE]` placeholders.
- **Colours, radii, animations**: the `@theme` block in `src/app/globals.css`
  (e.g. `--color-lime`, `--color-brand`).
- **Reviews**: replace the placeholders in `src/components/sections/Reviews.tsx`.

## Animations

- Scroll-reveal: `components/ui/Reveal.tsx` (`whileInView`).
- Hero slider & carousel: `AnimatePresence` + spring transitions in `motion/react`.
- Marquees, floating chips, rotating rings: CSS keyframes defined in `globals.css`.
- All motion respects `prefers-reduced-motion`.

## Image note

Product photos in `public/images` are manufacturer images (Apple, Samsung) used for
local development. Confirm usage rights with your supplier/distributor, or replace them
with your own photography, before going live.
