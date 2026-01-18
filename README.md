# Zipto - Quick Commerce Web App

A production-ready, mobile-first React application for quick commerce, inspired by modern instant delivery platforms.

## Features

- **Complete Commerce Flow**: Browse categories, search products, add to cart, checkout, and track orders
- **Mobile-First Design**: Optimized for mobile (360-430px) with responsive desktop layouts
- **Real-time Cart**: Cart drawer with quantity steppers, bill breakdown, and savings display
- **OTP Authentication**: Simulated phone + OTP login flow
- **Address Management**: Save and manage multiple delivery addresses
- **Order Tracking**: Real-time order status updates with timeline visualization
- **Payment Options**: Multiple payment method UI (UPI, Cards, Wallets, Net Banking, COD)
- **In-app Support Chat**: Floating assistant with persistent message history
- **Footer Navigation**: Popular searches, top categories, and marketing pages

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and build
- **React Router v6** for navigation
- **TanStack Query** (React Query) for data fetching and caching
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Prerequisites

- Node.js **18+** (Node 20 LTS recommended for Vite 5)
- npm **9+** (bundled with recent Node versions)
- Optional: backend/API at `VITE_API_URL` and chat service at `VITE_API_BASE_URL`

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment (optional if you are okay with defaults): see **Environment Variables**
3. Start the dev server: `npm run dev` (Vite serves on http://localhost:5173)
4. Run quality checks (recommended):
   - Lint: `npm run lint`
   - Type check: `npm run typecheck`
5. Build & preview production bundle:
   - Build: `npm run build`
   - Preview: `npm run preview`

## Environment Variables

Create a `.env` file in the project root if you want to override defaults:

```
VITE_API_URL=http://localhost:3008/api      # Commerce/product/category endpoints
VITE_API_BASE_URL=http://localhost:5000     # Chat service base URL
```

- `VITE_API_URL` powers `src/api/endpoints.ts` via `src/api/client.ts` for categories, products, banners, shelves, search, recommendations, and serviceability.
- `VITE_API_BASE_URL` powers `src/api/chat.ts` for chat and health checks; default is `http://localhost:5000`.
- If the chat service is down, the UI shows a fallback reply and keeps history in local storage.

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the repo |
| `npm run typecheck` | Run TypeScript type checks (`tsconfig.app.json`) |

## API & Data Sources

- The app expects a backend implementing the endpoints referenced in `src/api/endpoints.ts` (e.g., `/categories`, `/products`, `/products/:slug`, `/products/recommendations/:id`, `/banners`, `/shelves`, `/products/search`). Responses should follow the shapes defined in `src/api/client.ts`: `{ success: boolean, data: T, message?: string }` and, for paginated results, include `pagination`.
- **No backend yet?** For a UI-only demo, import from `src/api/endpoints-dummy.ts` (which reads from `src/mockData/`) instead of `src/api/endpoints.ts`, or temporarily re-export the dummy functions from `endpoints.ts` while developing the frontend.
- Mock data lives in `src/mockData/` and can be edited to adjust the catalog, banners, shelves, and footer content.

## Project Structure

```
src/
├── api/              # API adapter layer
│   ├── chat.ts       # Support chat API client
│   ├── client.ts     # API client with simulated delays
│   ├── endpoints.ts  # App endpoints
│   └── endpoints-dummy.ts # Local mock endpoints
├── components/
│   ├── cart/         # Cart drawer component
│   ├── chat/         # Chat drawer, messages, and FAB
│   ├── footer/       # Footer sections and top nav categories
│   ├── home/         # Home page components (banners, shelves)
│   ├── layout/       # Header, sidebar components
│   ├── modals/       # Login, address, location modals
│   ├── product/      # Product card component
│   └── ui/           # Reusable UI components
├── mockData/         # JSON mock data files
│   ├── categories.json
│   ├── products.json
│   ├── banners.json
│   ├── shelves.json
│   └── footerData.json
├── pages/            # Page components for each route
├── stores/           # Zustand stores
│   ├── uiStore.ts        # UI state (modals, cart open, toasts)
│   ├── authStore.ts      # Authentication state
│   ├── cartStore.ts      # Cart items and preferences
│   ├── chatStore.ts      # Support chat state (persisted)
│   ├── locationStore.ts  # Location and addresses
│   └── ordersStore.ts    # Order history
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with category strip, banners, and product shelves |
| `/c/:categorySlug` | Category listing page (PLP) |
| `/p/:productSlug` | Product detail page (PDP) |
| `/search` | Search results page |
| `/checkout` | Checkout page with order summary |
| `/payment` | Payment method selection |
| `/orders/:orderId/success` | Order confirmation page |
| `/orders/:orderId` | Order tracking page |
| `/orders` | Order history list |
| `/account` | User account management |
| `/help` | Help and FAQ page |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/refund-policy` | Refund policy |
| `/delivery-areas` | Serviceable locations |
| `/careers` | Careers landing page |
| `/press` | Press page |
| `/blog` | Blog listing page |
| `/sell` | Sell with Zipto |
| `/deliver-with-zipto` | Delivery partner page |
| `/franchise` | Franchise inquiry page |
| `/responsible-disclosure` | Security disclosure page |

## Mock Data

All data is stored in `src/mockData/` as JSON files. The API adapter layer (`src/api/`) simulates network delays (300-800ms) to mimic real API behavior.

### Modifying Mock Data

1. **Products**: Edit `src/mockData/products.json` to add/modify products
2. **Categories**: Edit `src/mockData/categories.json` for categories
3. **Banners**: Edit `src/mockData/banners.json` for promotional banners
4. **Shelves**: Edit `src/mockData/shelves.json` to configure home page shelves
5. **Footer**: Edit `src/mockData/footerData.json` for footer navigation content

## Local Support Chat (Optional)

The in-app chat calls the base URL defined by `VITE_API_BASE_URL` (default: `http://localhost:5000`):

- **Chat message**: `${VITE_API_BASE_URL}/api/chat/message`
- **Health check**: `${VITE_API_BASE_URL}/api/chat/health`
- **Client**: `src/api/chat.ts`

If the chat service is not running, the UI gracefully shows a fallback response and keeps the session history in local storage.

## Integrating Real APIs

`src/api/endpoints.ts` already targets real APIs through `src/api/client.ts`. Ensure your backend:
- Serves the endpoints listed in **API & Data Sources**
- Returns `{ success: boolean, data: T, message?: string }` (and `pagination` when paginated)
- Supports CORS for the dev origin (http://localhost:5173 by default)

## State Management

### Zustand Stores

- **`useUIStore`**: Modal states, cart visibility, toasts
- **`useAuthStore`**: Login state, user profile (persisted)
- **`useCartStore`**: Cart items, preferences (persisted)
- **`useChatStore`**: Support chat messages and session (persisted)
- **`useLocationStore`**: Selected location, addresses (persisted)
- **`useOrdersStore`**: Order history (persisted)

## Key Features

### Cart Calculations
- Item total (MRP and selling price)
- Discount on MRP
- Delivery fee (free above Rs 99)
- Handling fee (waived for members)
- Tip amount
- Total savings breakdown

### Mobile UX Patterns
- Sticky header with location chip
- Bottom sheet cart on mobile
- Full-screen search overlay
- Swipe-friendly product carousels

### Desktop Enhancements
- Category sidebar navigation
- Side-panel cart drawer
- Multi-column product grids
- Hover effects and micro-interactions
