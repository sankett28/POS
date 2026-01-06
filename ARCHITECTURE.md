# Application Architecture

This document provides a detailed overview of the Retail Boss application's architecture, including its components, data flow, and interactions.

## High-Level Architecture

The Retail Boss application follows a client-server architecture, with a Next.js frontend consuming APIs provided by a FastAPI Python backend. Supabase serves as the primary database and authentication provider.

```mermaid
graph TD
    User[Client Application (Browser)] --> |HTTP/S requests| Frontend(Next.js React App)
    Frontend --> |API calls (proxied by Next.js)| Backend(FastAPI Python App)
    Backend --> |Database Queries/Mutations| SupabaseDB[Supabase (PostgreSQL)]
    Backend --> |Auth/Storage/Functions| SupabaseServices[Supabase Services]

    subgraph ExternalServices
        SupabaseServices
        GoogleSpeechToText[Google Speech-to-Text API]
        Dialogflow[Dialogflow CX (NLU)]
        GoogleTextToSpeech[Google Text-to-Speech API]
        WhatsAppAPI[WhatsApp Business API]
        ProphetARIMA[Prophet/ARIMA (ML Models)]
    end

    Backend --> |Voice Processing| GoogleSpeechToText
    Backend --> |Natural Language Understanding| Dialogflow
    Backend --> |Text-to-Speech| GoogleTextToSpeech
    Backend --> |Messaging| WhatsAppAPI
    Backend --> |Demand Forecasting| ProphetARIMA

    Frontend --o CSS(Tailwind CSS)
    Frontend --o Charts(Chart.js)

    style Frontend fill:#f9f,stroke:#333,stroke-width:2px
    style Backend fill:#ccf,stroke:#333,stroke-width:2px
    style SupabaseDB fill:#cfc,stroke:#333,stroke-width:2px
    style SupabaseServices fill:#cfc,stroke:#333,stroke-width:2px
    style ExternalServices fill:#eee,stroke:#999,stroke-dasharray: 5 5
```

## Frontend (Next.js Application)

The frontend is a Next.js application built with React and TypeScript. It utilizes the App Router for routing and Tailwind CSS for styling. All user interactions and data visualization occur within the frontend.

-   **Framework**: Next.js 14 (React)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Charting**: Chart.js with react-chartjs-2
-   **API Communication**: Fetches data from the FastAPI backend via Next.js API rewrites.

### Frontend Folder Structure

-   `frontend/app/`: Contains the main application routes and pages, managed by Next.js App Router.
-   `frontend/components/`: Houses reusable React components such as `Navbar`, `Dashboard`, `Inventory`, etc.
-   `frontend/next.config.js`: Configures Next.js, including the crucial API proxy to the backend.

## Backend (FastAPI Application)

The backend is a Python FastAPI application responsible for handling business logic, data persistence, and integration with external AI/ML services.

-   **Framework**: FastAPI
-   **Language**: Python
-   **Database**: Supabase (PostgreSQL)
-   **Environment Management**: `python-dotenv`
-   **Validation**: Pydantic

### Backend Folder Structure

-   `backend/app/main.py`: The entry point for the FastAPI application, where routers are included, and middleware is configured.
-   `backend/app/core/`: Contains core application configurations and utilities:
    -   `config.py`: Defines environment variables and application settings.
    -   `db.py`: Initializes the Supabase client for database interactions.
-   `backend/app/modules/`: Organizes the application into feature-specific modules:
    -   `inventory/`: Handles inventory-related logic (routes, service).
    -   `sales/`: Manages sales, billing, and related operations.
    -   `products/`: Provides CRUD operations for product data.
    -   `dashboard/`: Aggregates data for dashboard displays.
    -   `analytics/`: Implements data analytics and forecasting functionalities.
    -   `voice/`: Processes voice commands and integrates with external speech APIs.
    -   `notifications/`: Manages system notifications.
-   `backend/app/migrations/`: Stores SQL migration scripts for managing the Supabase PostgreSQL schema.
-   `backend/app/utils/`: Contains general utility functions:
    -   `barcode.py`: Functions for barcode generation and validation.
    -   `bill_number.py`: Logic for generating unique bill numbers.

## Database (Supabase)

Supabase is used as the primary backend-as-a-service (BaaS), providing:

-   **PostgreSQL Database**: For storing all application data (products, sales, inventory logs, notifications, etc.).
-   **Authentication**: User authentication (if implemented).
-   **Edge Functions**: Serverless functions (can be used for complex logic).
-   **Realtime**: Realtime capabilities for data synchronization.

Database schema changes are managed through SQL migration files located in `backend/app/migrations/`.

## API Endpoints

The backend exposes a set of RESTful API endpoints, prefixed with `/api/`, which the frontend consumes. The Next.js configuration handles proxying these requests to the FastAPI server.

-   `GET /api/dashboard`: Retrieve key performance indicators and insights.
-   `GET /api/inventory`: Fetch current inventory status and product details.
-   `POST /api/inventory`: Update product stock levels.
-   `GET /api/billing`: Get a list of recent sales/bills.
-   `POST /api/billing`: Create a new sales transaction and update inventory.
-   `GET /api/products`: Retrieve all products.
-   `GET /api/products/{product_id}`: Retrieve details for a specific product.
-   `POST /api/products`: Create a new product.
-   `PUT /api/products/{product_id}`: Update an existing product.
-   `DELETE /api/products/{product_id}`: Delete a product.
-   `GET /api/analytics`: Obtain sales forecasts, customer behavior insights, and peak hours data.
-   `POST /api/voice`: Process voice commands for various actions.
-   `GET /api/notifications`: Fetch user notifications.
-   `PUT /api/notifications`: Mark notifications as read.

## External Service Integrations

The backend integrates with several external AI/ML services to provide advanced functionalities:

-   **Google Speech-to-Text API**: For converting spoken language into text for voice commands.
-   **Dialogflow CX**: For Natural Language Understanding (NLU) to interpret user intents from voice commands.
-   **Google Text-to-Speech API**: For generating spoken responses from the AI assistant.
-   **WhatsApp Business API**: For sending automated notifications and engaging with customers.
-   **Prophet/ARIMA (ML Models)**: Utilized for demand forecasting to optimize inventory and sales strategies.

