# TutorNearMe - Full Stack Application

A platform connecting students with local tutors. Built with **Spring Boot** (backend) and **React** (frontend) using REST APIs.

## Architecture

```
┌─────────────────┐     REST APIs      ┌─────────────────┐
│  React Frontend │ ◄─────────────────► │ Spring Boot     │
│  (Port 3000)    │                     │ Backend (8080)  │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                          ┌──────▼──────┐
                                          │  H2 Database │
                                          │  (In-memory) │
                                          └─────────────┘
```

**Design Principles:**
- **Frontend-agnostic backend**: Business logic, validation, and data access are entirely in Spring Boot
- **RESTful API**: Clean interfaces for future mobile app integration
- **Modular structure**: Easy to extend with new features

---

## Features

- ✅ Register as a tutor (name, subject, location, rating, availability)
- ✅ Search tutors by location with optional filters (subject, min rating, availability)
- ✅ View tutor details in search results
- ✅ Form validation (frontend + backend)
- ✅ Error handling with user-friendly messages
- ✅ Responsive UI with modern design
- ✅ Swagger/OpenAPI documentation
- ✅ H2 database console for development

---

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.3.2**
- **Spring Data JPA** + **Hibernate**
- **H2 Database** (in-memory, dev)
- **MapStruct** (DTO mapping)
- **Lombok 1.18.34** (boilerplate reduction)
- **Springdoc OpenAPI** (Swagger UI)
- **Maven** (build tool)

### Frontend
- **React 18**
- **Vite** (build tool)
- **React Router** (routing)
- **Axios** (HTTP client)
- **CSS Variables** (theming)

---

## Prerequisites

- **Java 21** (JDK) - Required for Spring Boot 3.3.x
- **Maven 3.9+** (or use the included Maven wrapper `./mvnw`)
- **Node.js 18+** and **npm**

> **Note:** If you have multiple Java versions installed, ensure Java 21 is used. On macOS with Homebrew:
> ```bash
> export JAVA_HOME=$(/usr/libexec/java_home -v 21)
> ```

---

## Quick Start

### 1. Start the Backend

```bash
# Terminal 1
cd backend

# If using Java 21 explicitly (recommended):
export JAVA_HOME=$(/usr/libexec/java_home -v 21)  # macOS
# export JAVA_HOME=/usr/lib/jvm/java-21-openjdk  # Linux

./mvnw spring-boot:run
```

The backend will start at **http://localhost:8080**

- API Base URL: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- H2 Console: `http://localhost:8080/api/h2-console`
  - JDBC URL: `jdbc:h2:mem:tutornearme`
  - Username: `sa`
  - Password: (empty)

### 2. Start the Frontend

```bash
# Terminal 2
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will start at **http://localhost:3000** (Vite proxies `/api` to `localhost:8080`)

---

## Verified Test Commands

Once both servers are running, you can test the API:

```bash
# Health check
curl http://localhost:3000/api/tutors/health
# Or directly to backend: curl http://localhost:8080/api/tutors/health

# Register a tutor
curl -X POST http://localhost:3000/api/tutors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "subject": "Math",
    "location": "San Francisco",
    "rating": "4.5",
    "availability": "FLEXIBLE"
  }'

# Search tutors by location
curl "http://localhost:3000/api/tutors?location=San Francisco"

# Search with filters
curl "http://localhost:3000/api/tutors?location=San Francisco&subject=Math&minRating=4.0&availability=FLEXIBLE"

# Get all tutors
curl http://localhost:3000/api/tutors/all
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tutors` | Register a new tutor |
| `GET` | `/api/tutors` | Search tutors by location |
| `GET` | `/api/tutors/all` | Get all tutors |
| `GET` | `/api/tutors/{id}` | Get tutor by ID |
| `DELETE` | `/api/tutors/{id}` | Delete tutor |
| `GET` | `/api/tutors/health` | Health check |

### Search Parameters

```
GET /api/tutors?location=San Francisco&subject=Math&minRating=4.0&availability=FLEXIBLE
```

- `location` (required) - City or area to search
- `subject` (optional) - Filter by subject
- `minRating` (optional) - Minimum rating (0-5)
- `availability` (optional) - WEEKDAYS, WEEKENDS, FLEXIBLE, ONLINE_ONLY

---

## Project Structure

```
tutornearme/
├── backend/
│   ├── src/main/java/com/tutornearme/
│   │   ├── config/         # CORS, OpenAPI config
│   │   ├── controller/     # REST controllers
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── exception/      # Custom exceptions & global handler
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Spring Data JPA repositories
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.yml # Configuration
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API services (axios)
    │   ├── types/          # Type definitions & constants
    │   ├── App.jsx         # Main app with routing
    │   ├── main.jsx        # Entry point
    │   └── index.css       # Global styles
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Development

### Backend Development

```bash
cd backend

# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with hot reload (using spring-boot-devtools)
./mvnw spring-boot:run
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Extending for Mobile App

The backend is **completely frontend-agnostic**. To add a mobile app:

1. Create a new React Native / Flutter / native project
2. Point it to the same REST API endpoints
3. No backend changes needed!

Example mobile integration:
```javascript
// React Native example
const API_BASE = 'https://your-api-domain.com/api';

const tutorApi = {
  search: async (location, subject) => {
    const response = await fetch(`${API_BASE}/tutors?location=${location}&subject=${subject}`);
    return response.json();
  },
  register: async (tutorData) => {
    const response = await fetch(`${API_BASE}/tutors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorData)
    });
    return response.json();
  }
};
```

---

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Tutor profiles with photos/bio
- [ ] Student reviews & ratings
- [ ] Booking/scheduling system
- [ ] Payment integration
- [ ] Real-time chat
- [ ] Email notifications
- [ ] PostgreSQL for production
- [ ] Docker deployment
- [ ] CI/CD pipeline

---

## License

MIT License - feel free to use for learning or commercial projects.