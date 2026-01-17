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

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

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

The in-app chat calls a local API endpoint by default:

- **Endpoint**: `http://localhost:3008/api/chat/message`
- **Client**: `src/api/chat.ts`

If the chat service is not running, the UI gracefully shows a fallback response and keeps the session history in local storage.

## Integrating Real APIs

Replace mock calls in `src/api/endpoints.ts` with actual API calls:

```typescript
// Before (mock)
export async function getProducts(): Promise<Product[]> {
  return simulateApiCall(productsData as Product[]);
}

// After (real API)
export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  return response.json();
}
```

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
