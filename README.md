# Retail Boss Application

This is the monorepo for the Retail Boss application, an AI-Powered Retail Management System for Indian Kirana Stores & Cafes. It consists of a Next.js frontend and a FastAPI (Python) backend.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Architecture](#architecture)
- [Features](#features)
- [License](#license)

## Overview

Retail Boss aims to revolutionize retail management for small and medium-sized businesses in India by providing a comprehensive, AI-driven solution. Key functionalities include inventory management, GST-compliant billing, voice AI assistance, demand forecasting, and analytics.

## Project Structure

```
POS/
├── backend/          # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py             # FastAPI application entry point
│   │   ├── core/               # Configuration, database setup
│   │   ├── modules/            # Feature-specific modules (inventory, sales, etc.)
│   │   ├── migrations/         # Supabase SQL migration files
│   │   └── utils/              # Utility functions (barcode, bill number)
│   └── requirements.txt        # Python dependencies
├── frontend/         # Next.js React Frontend
│   ├── app/                    # Next.js App Router components
│   ├── components/             # Reusable React components
│   ├── public/                 # Static assets
│   ├── styles/                 # Global styles
│   ├── package.json            # Node.js dependencies and scripts
│   └── next.config.js          # Next.js configuration (with API proxy)
├── .env.example      # Example environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Getting Started

Follow these steps to set up and run the application locally.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
    ```bash
    cp backend/.env.example backend/.env
    ```
    Fill in your Supabase project URL and API key.
    ```env
    SUPABASE_URL="YOUR_SUPABASE_URL"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    CORS_ORIGINS="http://localhost:3000"
    DEBUG=True
    ```
4.  **Run Supabase Migrations:**
    Apply the SQL migration files located in `backend/app/migrations/` to your Supabase project.
    You can do this manually via the Supabase Dashboard SQL Editor or using the Supabase CLI.
5.  **Start the Backend Server:**
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The backend will be running at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:3000`.
    API requests from the frontend to `/api/*` will be automatically proxied to the backend running on `http://localhost:8000`.

## Architecture

Refer to [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed overview of the application's architecture, including data flows and component interactions.

## Features

-   **Dashboard**: Real-time insights and KPIs.
-   **Inventory Management**: AI-powered stock tracking & forecasting.
-   **Billing**: GST-compliant instant invoicing.
-   **Voice AI**: Multi-language voice assistant (Hindi, Tamil, Telugu, English).
-   **Analytics**: Demand forecasting & business insights.
-   **Notifications**: Real-time alerts for low stock, high demand, etc.

## License

This project is licensed under the MIT License.
