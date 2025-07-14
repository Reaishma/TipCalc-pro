# TipCalc Pro - Smart Tip Calculator

## Overview

TipCalc Pro is a modern, responsive tip calculator web application built with React and TypeScript. It features a clean, animated interface with multi-currency support and Progressive Web App (PWA) capabilities. The application uses a full-stack architecture with an Express.js backend and a React frontend, styled with Tailwind CSS and shadcn/ui components.



## Recent Changes

### January 12, 2025 - Project Completion
- Fixed text visibility issues (black text on dark background)
- Created proper PWA icons and manifest files
- Generated complete standalone HTML file with embedded CSS/JS
- Created comprehensive README documentation
- All features working: multi-currency, animations, PWA installation, mobile responsive

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for PowerPoint-style animations
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Style**: REST API with JSON responses
- **Development**: Hot reload with tsx for development server

### Database & Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon serverless)
- **Development Storage**: In-memory storage for development
- **Migration**: Drizzle Kit for schema migrations


## Key Components

### Core Functionality
- **Real-time Tip Calculation** - Instant calculations as you type
- **Multi-Currency Support** - 7 major currencies (USD, EUR, GBP, CAD, AUD, JPY, CHF)
- **Split Bill Feature** - Calculate amount per person (1-50 people)
- **Quick Tip Selection** - Preset buttons for 15%, 18%, 20%, 25%
- **Custom Tip Percentage** - Enter any custom percentage
- **Visual Breakdown** - Animated progress bars showing bill vs tip ratio


### UI Components
- **shadcn/ui**: Comprehensive component library for consistent design
- **Animations**: Smooth transitions and PowerPoint-style slide-in effects
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback for actions and errors

### API Endpoints
- `POST /api/calculate` - Calculate tip and store calculation
- `GET /api/calculations` - Retrieve recent calculations history

## Data Flow

1. **User Input**: User enters bill amount, tip percentage, and people count
2. **Validation**: Client-side validation using Zod schemas
3. **API Call**: TanStack Query manages server requests
4. **Calculation**: Server calculates tip amounts and stores in database
5. **Response**: Results displayed with animations
6. **History**: Previous calculations available for reference

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Animation**: Framer Motion
- **Forms**: React Hook Form, Hookform resolvers
- **HTTP Client**: TanStack Query with fetch API
- **Utilities**: date-fns, lucide-react icons

### Backend Dependencies
- **Server**: Express.js with middleware
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Validation**: Zod for schema validation
- **Session**: connect-pg-simple for session storage
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict mode
- **Linting**: ESLint configuration
- **Database**: Drizzle Kit for migrations

## Deployment Strategy

### Development Environment
- **Server**: Development server with hot reload using tsx
- **Client**: Vite dev server with HMR
- **Database**: In-memory storage for development

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Database**: PostgreSQL with Drizzle migrations
- **Deployment**: Single server deployment with static file serving

### PWA Features
- **Service Worker**: Caches resources for offline functionality
- **Web App Manifest**: Enables installation on mobile devices
- **Icons**: Multiple icon sizes for different platforms
- **Offline Support**: Basic offline functionality with cached resources

The application follows modern web development best practices with TypeScript throughout, responsive design, and progressive enhancement. The architecture supports both development and production environments with appropriate tooling and build processes.

