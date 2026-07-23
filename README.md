# TutorHub - Tutor Marketplace

A modern React-based tutor marketplace application for finding and hiring verified home tutors in Dhaka, Bangladesh.

## Features

- **Browse Tutors**: Search and filter tutors by subject, budget, and ratings
- **Tutor Profiles**: Detailed profiles with reviews, certificates, and availability
- **Dashboards**: Parent Dashboard, Tutor Dashboard, Admin Dashboard
- **Authentication**: Login and signup for parents and tutors
- **Cloudflare Pages Ready**: Configured with `_redirects`, `_headers`, and `wrangler.jsonc`

## Cloudflare Pages Deployment

### Option 1: Git Integration (Recommended)
1. Push this repository to GitHub.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
3. Click **Create Application** -> **Pages** -> **Connect to Git**.
4. Select the `tutorhub` repository.
5. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

### Option 2: Wrangler CLI Deployment
```bash
# Build the project
npm run build

# Deploy directly via Wrangler
npx wrangler pages deploy dist
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Preview production build locally:
```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy dist to Cloudflare Pages via Wrangler

## License

MIT

