# 🚖 Rydex – Ride Hailing Application

Rydex is a full-stack ride-hailing application inspired by Uber, built to understand and implement real-world concepts such as geolocation, real-time communication, ride dispatching, and scalable backend architecture.

The project focuses on delivering a seamless experience for both riders and drivers while following modern software engineering practices.

> **Status:** 🚧 Under Active Development

---

# 📖 Table of Contents

- Overview
- Features
- Tech Stack
- Project Architecture
- Rider Workflow
- Driver Workflow
- Folder Structure
- Installation
- Environment Variables
- Database Schema
- API Overview
- Socket Events
- Future Enhancements
- Screenshots
- Learning Outcomes
- Resources
- License
- Author

---

# 🚀 Overview

Rydex is a cross-platform mobile application developed using **React Native (Expo)** and **Node.js**.

The application enables users to:

- Register/Login securely
- View their current location
- Select pickup and destination
- Request rides
- Match with nearby drivers
- Receive live ride updates
- Track rides in real time

The backend handles ride requests, authentication, driver discovery, and real-time communication using WebSockets.

---

# ✨ Features

## Rider

- User Authentication
- Current Location Detection
- Interactive Maps
- Destination Search
- Ride Booking
- Live Ride Status
- Ride History
- Profile Management

---

## Driver

- Driver Login
- Go Online / Offline
- Update Live Location
- Accept / Reject Requests
- Navigation Support
- Ride Completion

---

## Backend

- JWT Authentication
- PostgreSQL Database
- REST APIs
- WebSocket Communication
- Driver Matching
- Ride Management
- Secure Password Hashing
- Error Handling

---

# 🛠 Tech Stack

## Frontend

- React Native
- Expo
- JavaScript
- React Navigation

---

## Backend

- Node.js
- Express.js

---

## Database

- PostgreSQL

---

## Real-Time Communication

- Socket.IO

---

## Authentication

- JWT
- bcrypt

---

## APIs

- Google Maps API
- Geolocation API

---

## Tools

- Git
- GitHub
- Postman
- VS Code

---

# 🏗 Project Architecture

```
                Rider App
                     │
                     │
             REST API + Socket.IO
                     │
        ┌────────────────────────┐
        │      Express Server      │
        └────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
 Authentication   Ride Logic   Driver Matching
       │             │             │
       └─────────────┼─────────────┘
                     │
               PostgreSQL Database
```

---

# 📲 Rider Workflow

1. User signs in.
2. Current location is detected.
3. Rider selects pickup location.
4. Rider selects destination.
5. Ride request is sent.
6. Backend searches nearby drivers.
7. Driver receives request.
8. Driver accepts ride.
9. Rider receives confirmation.
10. Live ride tracking begins.
11. Ride completes.
12. Ride is stored in history.

---

# 🚗 Driver Workflow

1. Driver logs in.
2. Goes online.
3. Driver location updates continuously.
4. Receives nearby ride request.
5. Accepts or rejects.
6. Navigation begins.
7. Picks up rider.
8. Ride completed.
9. Earnings updated.

---

# 📁 Folder Structure

```
Rydex
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── sockets
│   ├── services
│   ├── utils
│   ├── app.js
│   └── server.js
│
├── frontend
│   ├── app
│   ├── assets
│   ├── components
│   ├── constants
│   ├── hooks
│   ├── screens
│   ├── services
│   ├── store
│   ├── utils
│   └── App.js
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/rydex.git
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npx expo start
```

---

# 🔐 Environment Variables

Backend

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

GOOGLE_MAPS_API_KEY=
```

Frontend

```env
EXPO_PUBLIC_API_URL=

EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

---

# 🗄 Database

Main tables include:

- Users
- Drivers
- Riders
- Rides
- Locations

Example Ride

| Field | Description |
|--------|-------------|
| id | Ride ID |
| rider_id | Rider |
| driver_id | Driver |
| pickup | Pickup location |
| destination | Destination |
| fare | Ride Fare |
| status | Pending / Accepted / Completed |

---

# 🔌 REST APIs

## Authentication

```
POST /auth/register

POST /auth/login
```

---

## Rider

```
POST /ride/request

GET /ride/history

GET /ride/:id
```

---

## Driver

```
POST /driver/status

POST /driver/location

POST /ride/accept

POST /ride/reject
```

---

# ⚡ Socket Events

### Rider

```
ride:request

ride:cancel

ride:status
```

---

### Driver

```
driver:online

driver:offline

driver:location

ride:accepted

ride:completed
```

---

# 🚀 Future Enhancements

- Live driver tracking
- ETA calculation
- Route optimisation
- Surge pricing
- Payment Gateway Integration
- Ratings & Reviews
- Push Notifications
- SOS Button
- Ride Scheduling
- Multi-language Support
- Admin Dashboard
- Driver Earnings Dashboard
- AI-based Driver Matching
- Trip Analytics
- Offline Support

---

# 📸 Screenshots

### Rider Home

> *(Add screenshot here)*

---

### Driver Dashboard

> *(Add screenshot here)*

---

### Ride Tracking

> *(Add screenshot here)*

---

# 📚 Learning Outcomes

This project helped me gain practical experience with:

- Mobile App Development
- REST APIs
- WebSocket Communication
- Authentication & Authorization
- PostgreSQL
- Database Design
- Geolocation Services
- State Management
- Real-Time Systems
- Client–Server Architecture
- Backend Development
- Software Engineering Best Practices

---

# 📖 Resources

- React Native Docs
- Expo Docs
- Express Documentation
- PostgreSQL Documentation
- Socket.IO Documentation
- Google Maps Platform
- MDN Geolocation API

---

# 🤝 Contributing

Contributions, feature suggestions, and bug reports are always welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Subha Shil**

- LinkedIn: https://www.linkedin.com/in/subha-shil
- GitHub: https://github.com/SUBHA-SHIL

---

⭐ If you found this project helpful, consider giving it a star!