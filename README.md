# 🔗 Linkly - URL Shortener

<div align="center">

A modern, production-ready URL shortener built with **Next.js 16**, **Prisma ORM**, and **Supabase PostgreSQL**. Transform long, unwieldy URLs into short, memorable links with just one click!

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

---

## 📸 Screenshots

<div align="center">
<table>
  <tr>
    <td align="center"><b>🏠 Home Page</b></td>
    <td align="center"><b>📊 Dashboard</b></td>
    <td align="center"><b>📈 Analytics</b></td>
  </tr>
  <tr>
    <td><img src="./public/Screenshot_1.png" width="300" alt="Home Page - Shorten URLs instantly"/></td>
    <td><img src="./public/Screenshot_2.png" width="300" alt="Dashboard - Manage all your links"/></td>
    <td><img src="./public/Screenshot_3.png" width="300" alt="Analytics - Track performance"/></td>
  </tr>
  <tr>
    <td align="center"><i>Shorten URLs instantly with custom codes & QR generation</i></td>
    <td align="center"><i>Manage all your links in one place</i></td>
    <td align="center"><i>Track clicks & analyze performance</i></td>
  </tr>
</table>
</div>

---

## 🎯 What is Linkly?

**Linkly** is a full-featured URL shortening service that helps you:

- **Simplify Sharing** — Convert long URLs into clean, shareable links
- **Track Performance** — Monitor clicks, referrers, and engagement in real-time
- **Brand Your Links** — Create custom short codes that reflect your brand
- **Generate QR Codes** — Instantly create downloadable QR codes for any link
- **Set Expiration** — Create temporary links that auto-expire when needed

Perfect for marketers, developers, content creators, and anyone who needs professional link management!

---

## ✨ Features

| Feature                    | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| 🔗 **URL Shortening**      | Transform long URLs into short, memorable links with a single click        |
| 📊 **Analytics Dashboard** | Track clicks, view popular links, and monitor performance metrics          |
| 📱 **QR Code Generation**  | Generate downloadable QR codes for any short URL — perfect for print media |
| 🔄 **Real-time Stats**     | View click counts and analytics updated in real-time                       |
| 🌙 **Dark Mode UI**        | Beautiful dark theme with glassmorphism design and smooth animations       |
| 📤 **Social Sharing**      | One-click sharing to Twitter, WhatsApp, Telegram, LinkedIn, and Email      |
| ⏰ **Link Expiration**     | Set optional expiration dates for time-sensitive campaigns                 |
| 🔒 **Custom Short Codes**  | Choose your own branded short codes (e.g., `yourdomain.com/sale2024`)      |
| 📈 **Click Tracking**      | Detailed analytics with referrer, user agent, and timestamp tracking       |
| 📋 **Copy to Clipboard**   | Instant copy functionality for quick sharing                               |
| 🗑️ **Link Management**     | Edit, delete, and organize your shortened URLs easily                      |

---

## 🛠️ Tech Stack

| Technology                                            | Purpose                      | Version |
| ----------------------------------------------------- | ---------------------------- | ------- |
| [Next.js](https://nextjs.org/)                        | React Framework (App Router) | 16.0.8  |
| [Supabase](https://supabase.com/)                     | PostgreSQL Database          | Latest  |
| [Prisma](https://www.prisma.io/)                      | Type-safe ORM                | 7.x     |
| [Tailwind CSS](https://tailwindcss.com/)              | Utility-first Styling        | 4.x     |
| [TypeScript](https://www.typescriptlang.org/)         | Type Safety                  | 5.x     |
| [Recharts](https://recharts.org/)                     | Analytics Charts             | Latest  |
| [node-qrcode](https://github.com/soldair/node-qrcode) | QR Code Generation           | Latest  |
| [Sonner](https://sonner.emilkowal.ski/)               | Toast Notifications          | Latest  |
| [Zod](https://zod.dev/)                               | Schema Validation            | Latest  |

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works!)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **Database**
3. Copy your connection strings (see below)

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database URLs (from Supabase Dashboard → Project Settings → Database)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Set Up the Database

Push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

Generate the Prisma client:

```bash
npm run db:generate
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

This project uses the `src/` directory convention with TypeScript path aliases (`@/*` → `./src/*`).

```
url-shortener/
├── src/
│   ├── app/
│   │   ├── [shortCode]/        # Dynamic redirect route
│   │   ├── actions/            # Server actions
│   │   │   ├── url.ts          # URL CRUD operations
│   │   │   └── analytics.ts    # Analytics & click tracking
│   │   ├── analytics/          # Analytics page
│   │   ├── api/                # API routes
│   │   │   └── cleanup/        # Expired URL cleanup endpoint
│   │   ├── dashboard/          # Dashboard page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Shared UI components
│   │   ├── ConfirmDialog.tsx
│   │   ├── Navbar.tsx
│   │   ├── QRCodeModal.tsx
│   │   ├── ShareButtons.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── UrlTable.tsx
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       ├── supabase.ts         # Supabase client
│       └── utils/
│           ├── qrcode.ts       # QR code generation
│           └── url.ts          # URL utilities & validation
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── .env.example                # Environment template
├── tsconfig.json               # TypeScript config (paths: @/* → ./src/*)
└── package.json
```

## 📊 Database Schema

### Url Model

| Field       | Type      | Description               |
| ----------- | --------- | ------------------------- |
| id          | UUID      | Primary key               |
| originalUrl | String    | The original long URL     |
| shortCode   | String    | Unique 6-8 character code |
| clicks      | Int       | Total click count         |
| createdAt   | DateTime  | Creation timestamp        |
| expiresAt   | DateTime? | Optional expiration       |
| userId      | String?   | Optional user ID          |

### Click Model (Analytics)

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | UUID     | Primary key        |
| urlId     | String   | Foreign key to Url |
| timestamp | DateTime | Click timestamp    |
| referrer  | String?  | HTTP referrer      |
| userAgent | String?  | Browser user agent |

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-pooler-connection-string
DIRECT_URL=your-direct-connection-string
NEXT_PUBLIC_BASE_URL=https://your-domain.com
CRON_SECRET=your-secure-random-string
```

### Setting Up Cron Jobs (Optional)

To automatically clean up expired URLs, set up a cron job to call:

```
GET https://your-domain.com/api/cleanup?secret=YOUR_CRON_SECRET
```

**Vercel Cron** (vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/cleanup?secret=YOUR_CRON_SECRET",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## 🔒 Supabase Connection Types

### Connection Pooler (Port 6543)

- Use for: Production deployments, serverless functions
- Features: Connection pooling via PgBouncer
- Add `?pgbouncer=true` to connection string

### Direct Connection (Port 5432)

- Use for: Prisma migrations, local development
- Features: Direct PostgreSQL connection
- Required for schema changes

## 📝 API Reference

### Server Actions

#### `createShortUrl(originalUrl, expiresAt?, userId?)`

Creates a new short URL.

#### `getUrlByShortCode(shortCode)`

Retrieves URL and increments click count.

#### `getAllUrls()`

Returns all URLs sorted by creation date.

#### `deleteUrl(id)`

Deletes a URL by ID.

#### `getAnalytics()`

Returns comprehensive analytics data.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Prisma](https://prisma.io/) - Next-generation Node.js ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">

### ⭐ Star this repo if you find it useful!

Built with ❤️ by [DevStitch](https://github.com/devstitch)

**[Live Demo](https://url-shortener-devstitch.vercel.app)** · **[Report Bug](https://github.com/devstitch/url-shortener/issues)** · **[Request Feature](https://github.com/devstitch/url-shortener/issues)**

</div>
