# 🌉 MargSetu (मार्गसेतु)

<div align="center">

![MargSetu Banner](https://img.shields.io/badge/MargSetu-North_Eastern_Region_Sentinel-indigo?style=for-the-badge&logo=compass)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**Real-Time Geospatial Accessibility, Dynamic Detour Routing & Disaster Hazard Sentinel for the North Eastern Region of India.**

*Developed by **NEXUSXLABS***

</div>

---

## 📖 Overview

**MargSetu (मार्गसेतु)** is a mission-critical geospatial accessibility platform and disaster hazard sentinel designed specifically for the complex topography and high-vulnerability road networks across the **8 North Eastern States of India** (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim).

During seasonal monsoons, landslides, flash floods, and seismic events, critical arterial highways (such as NH-27, NH-6, NH-10, NH-29) often suffer blockages. MargSetu provides real-time situational awareness, dynamic detour computation, and authority incident synchronization to keep emergency responders, logistics supply chains, and citizens moving safely.

---

## 🚀 Key Features

- 🛰️ **Real-Time Highway Sentinel**: Live status monitoring (Clear, Critical, Partial, Blocked) across vital NER corridors with GeoJSON coordinate tracking.
- 🔄 **Dynamic Detour Routing**: Automated calculation of alternative bypass routes and safety advisories when primary national highways are disrupted.
- ⚠️ **Multi-Hazard Alert Engine**: Instant broadcasting of landslide warnings, flood risks, roadwork disruptions, and extreme weather notices.
- 🗺️ **Interactive Geospatial Visualization**: High-performance interactive maps built on Leaflet with live color-coded telemetry and checkpoint data.
- 🏢 **Control Room Dashboard**: Administrative interface for verified emergency authorities, NHAI regional officers, and state disaster response forces.
- 📱 **Responsive & PWA Ready**: Optimized for low-bandwidth, mountainous terrain connectivity with offline fallback support.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 18](https://react.js.org/) + [Vite](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) |
| **Backend / API** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) |
| **Data Format** | PostGIS-aligned GeoJSON LineStrings & Point features |
| **Notifications & UX** | [Sonner Toast Notifications](https://sonner.emilkowal.ski/) |

---

## 📂 Project Structure

```bash
MARGSETU-BY-NEXUSXLABS/
├── backend/                # Express REST API & highway status sync service
│   ├── database/          # In-memory PostGIS-aligned dataset & seeds
│   └── index.js           # Server routes, hazard ingestion, and API handlers
├── src/                    # Frontend React application source code
│   ├── components/        # Reusable UI widgets, navigation & alerts
│   ├── context/           # React Context providers for global state
│   ├── data/              # Static geospatial metadata & fallback routes
│   ├── hooks/             # Custom React hooks for telemetry & APIs
│   ├── pages/             # Main application views & dashboard pages
│   ├── services/          # HTTP API client services
│   ├── App.jsx            # Core routing & application wrapper
│   ├── index.css          # Tailwind CSS global stylesheet
│   └── main.jsx           # React DOM root entrypoint
├── public/                 # Static assets, icons, and PWA manifest
├── .github/                # GitHub Actions workflows & issue templates
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules for clean repository
├── index.html              # HTML5 application shell
├── package.json            # Node.js dependencies and run scripts
├── tailwind.config.js      # Tailwind styling configuration
└── vite.config.js          # Vite build & bundler configuration
```

---

## ⚡ Quickstart & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/MARGSETU.git
cd MARGSETU
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```

### 4. Start Development Servers

#### Option A: Start Frontend & Backend concurrently
In Terminal 1 (Backend Server):
```bash
npm run dev:backend
# Server runs at http://localhost:4000
```

In Terminal 2 (Frontend Client):
```bash
npm run dev
# Client runs at http://localhost:5173
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/highways` | Fetch all monitored highways with real-time status |
| `GET` | `/api/highways/:id` | Get detailed telemetry and coordinates for a highway |
| `POST` | `/api/highways/report` | Submit road incident or hazard report |
| `GET` | `/api/alerts` | Retrieve active regional hazard and weather warnings |
| `GET` | `/api/health` | Service health status check |

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are highly welcomed! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on code standards and pull request workflows.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛡️ Security

For vulnerability disclosure or security issues, please review our [Security Policy](SECURITY.md).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for the North Eastern Region by <b>NEXUSXLABS</b></sub>
</div>
