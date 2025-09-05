# Live Network Monitoring System - Frontend

*This project is frontend component of larger Network Monitoring System developed as Masters thesis @ Zagreb University of Applied Sciences. For more information, visit central repository.*

A modern React-based dashboard for monitoring network devices and system metrics in real-time. This application provides comprehensive monitoring capabilities with an intuitive interface for tracking network performance, device status, and system health metrics.

## Features

### Real-time Monitoring
- **Live System Metrics**: Real-time CPU, RAM, and temperature monitoring via WebSocket connections
- **Network Status Tracking**: Bandwidth, latency, packet loss, and jitter monitoring
- **Device Status**: Online/offline status tracking with automatic updates
- **Historical Data**: Trend analysis with customizable time ranges (6h, 12h, 24h)

### Security & Authentication
- **JWT Authentication**: Secure login system with token verification
- **Protected Routes**: Route-based access control with automatic redirects
- **Session Management**: Automatic token validation and cleanup
- **Private Route Protection**: Prevents unauthorized access to sensitive data

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with optimized layouts
- **Dark/Light Theme**: System preference detection with manual switching
- **Interactive Charts**: Beautiful data visualizations using Recharts
- **Component Library**: Built with Shadcn/ui components
- **Adaptive Sidebar**: Responsive sidebar that adapts to screen size

### Data Visualization
- **Real-time Charts**: Live updating line and bar charts
- **Radial Progress**: Circular progress indicators for system metrics
- **Network Status Cards**: Visual status indicators with color-coded badges
- **Historical Trends**: Time-series data with filtering capabilities

## Tech Stack

- **Frontend Framework**: React 18 with hooks and modern patterns
- **State Management**: Redux Toolkit for predictable state updates
- **Routing**: React Router v6 with protected routes
- **UI Components**: Shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Real-time**: Socket.io client for live updates
- **Build Tool**: Vite for fast development and optimized builds
- **Icons**: Lucide React for consistent iconography

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_BASE_URL=http://localhost:3000
   VITE_WS_URL=ws://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── app-sidebar.jsx         # Responsive sidebar navigation
│   ├── nav-main.jsx           # Main navigation component
│   ├── nav-user.jsx           # User profile navigation
│   ├── privateRoute/          # Route protection component
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── NodesStatus/       # Node status monitoring
│   │   └── networkStatus/     # Network metrics display
│   └── ui/                    # Reusable UI components
│       ├── sidebar.jsx        # Sidebar primitives
│       ├── chart.jsx          # Chart components
│       ├── card.jsx           # Card components
│       └── ...               # Other UI primitives
├── pages/
│   ├── metrics/              # System metrics dashboard
│   ├── networkStatus/        # Network monitoring page
│   └── profile/              # User profile management
├── service/
│   └── apiService.js         # API client and token management
├── store/
│   ├── slices/               # Redux slices
│   ├── actions/              # Async actions
│   └── index.js              # Store configuration
├── context/
│   └── themeProvider.jsx     # Theme management context
├── lib/
│   ├── socket.js             # WebSocket client configuration
│   └── utils.js              # Utility functions
└── App.jsx                   # Root application component
```

## Authentication Flow

- All routes except `/login` are protected by the `PrivateRoute` component
- Token validation occurs on every route access
- Automatic redirect to login for invalid/expired tokens
- Loading states prevent UI flash during authentication checks

## Theming & Styling

This project leverages Shadcn/ui, a component library built on principles of accessibility, composability, and customization, ensuring a consistent and user-friendly interface.

### Theme System
- CSS custom properties for dynamic theming
- System preference detection
- Manual theme toggle in user profile
- Consistent color palette across components

### Responsive Design
- Mobile-first CSS approach
- Breakpoint-based component behavior
- Adaptive sidebar (offcanvas → icon → expanded)
- Flexible chart sizing for all screen sizes

## Monitoring Capabilities

### System Metrics
- **CPU Usage**: Real-time percentage and temperature
- **Memory Usage**: RAM consumption tracking
- **Disk Usage**: Storage information and alerts
- **Network Interface**: Bandwidth utilization

### Network Health
- **Latency Monitoring**: Ping response times
- **Bandwidth Analysis**: Upload/download speeds
- **Packet Loss Detection**: Network reliability metrics
- **Jitter Measurement**: Connection stability tracking

### Device Status
- **Online/Offline Detection**: Based on last sync timestamp
- **Connection Quality**: Visual status indicators
- **Historical Uptime**: Long-term availability tracking

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for powerful data visualization
- [Lucide](https://lucide.dev/) for the comprehensive icon set
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
