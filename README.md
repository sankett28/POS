# Retail Boss - Next.js Application

AI-Powered Retail Management System for Indian Kirana Stores & Cafes, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 **Dashboard**: Real-time insights and KPIs
- 📦 **Inventory Management**: AI-powered stock tracking & forecasting
- 🧾 **Billing**: GST-compliant instant invoicing
- 🎤 **Voice AI**: Multi-language voice assistant (Hindi, Tamil, Telugu, English)
- 📈 **Analytics**: Demand forecasting & business insights

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Backend**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── billing/
│   │   ├── analytics/
│   │   ├── voice/
│   │   └── notifications/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── Navbar.tsx
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Billing.tsx
│   ├── VoiceAI.tsx
│   ├── Analytics.tsx
│   ├── NotificationPanel.tsx
│   └── SuccessModal.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Endpoints

- `GET /api/dashboard` - Get dashboard data
- `GET /api/inventory` - Get inventory data
- `POST /api/inventory` - Update inventory
- `GET /api/billing` - Get recent bills
- `POST /api/billing` - Create new bill
- `GET /api/analytics` - Get analytics data
- `POST /api/voice` - Process voice command
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark notification as read

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The current implementation uses mock data. In a production environment, you would:
  - Connect to a database (PostgreSQL, MongoDB, etc.)
  - Implement authentication & authorization
  - Add real-time updates (WebSockets)
  - Integrate with payment gateways
  - Add proper error handling & validation
  - Implement voice recognition APIs
  - Add data persistence

## License

MIT

