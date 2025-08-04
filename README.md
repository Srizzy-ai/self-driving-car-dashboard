# Self-Driving Car Monitoring Dashboard

A real-time monitoring dashboard for autonomous vehicles built with Vue.js and Node.js.

## 🚀 Live Demo

- **Frontend:** https://self-driving-car-dashboard.vercel.app/
- **Backend API:** https://self-driving-car-dashboard.onrender.com/api/vehicles

## 📋 Features

- Real-time car tracking with live GPS coordinates
- Interactive map visualization using Leaflet
- Car status monitoring (driving, charging, idle)
- Battery level and speed tracking
- Auto-updating dashboard every 3 seconds
- Responsive dark theme design

## 🛠 Tech Stack

**Frontend:**
- Vue.js 3
- Leaflet.js for maps
- Axios for API calls
- CSS3 with dark theme

**Backend:**
- Node.js
- Express.js
- CORS enabled
- Real-time data simulation

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup
```bash
cd backend
npm install
node server.js

Server runs on http://localhost:3000


Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173


🏗 System Architecture

┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    Real-time    ┌─────────────────┐
│   Vue.js        │◄──────────────► │   Express.js    │◄──────────────► │   Car Simulator │
│   Frontend      │                 │   Backend       │                 │   (Mock Data)   │
│                 │                 │                 │                 │                 │
│ • Dashboard     │                 │ • REST API      │                 │ • 4 Cars        │
│ • Map View      │                 │ • /api/vehicles │                 │ • GPS Updates   │
│ • Auto-refresh  │                 │ • CORS Support  │                 │ • Status Change │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘

📊 Data Simulation Strategy

The backend simulates realistic autonomous vehicle behavior:


Movement Simulation: Cars move by slightly adjusting GPS coordinates every 2 seconds
Battery Management: Driving cars consume battery, charging cars gain battery
Status Transitions: Cars automatically switch between driving, charging, and idle states
Realistic Constraints: Speed limits (0-80 mph), battery levels (0-100%), logical state changes

🔄 API Endpoints

GET /api/vehicles - Returns all vehicle data
GET /api/vehicles/:id - Returns specific vehicle data

🚀 Deployment

Frontend: Deployed on Vercel with automatic GitHub integration
Backend: Deployed on Render with continuous deployment

🔮 Scaling Considerations

To manage a fleet of 1000+ vehicles at scale:


Data Ingestion:


Implement message queues (Redis/RabbitMQ) for high-throughput data processing
Use database sharding to distribute vehicle data across multiple databases
Implement data compression and batching for efficient network usage

Real-time Monitoring:


WebSocket connections for instant updates instead of polling
Implement data streaming with Apache Kafka for real-time analytics
Use CDN for global dashboard access with minimal latency

Distributed Command & Control:


Microservices architecture with separate services for tracking, commands, and analytics
Load balancers to distribute traffic across multiple server instances
Implement caching layers (Redis) for frequently accessed vehicle data
Database optimization with indexing on vehicle IDs and geographic coordinates

Infrastructure:


Container orchestration with Kubernetes for auto-scaling
Monitoring and alerting systems for system health
Backup and disaster recovery procedures
Security measures including API rate limiting and authentication


👨‍💻 Author

Built as a technical assessment demonstrating full-stack development skills with Vue.js and Node.js