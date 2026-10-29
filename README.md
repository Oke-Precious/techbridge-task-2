# TechBridge Web Development Internship — Task 8: Final Full-Stack Project
## TechBridge Intern Management Platform

A production-grade, full-stack intern platform unifying the TechBridge Homepage, Task 6 Intern Dashboard, Task 7 Task Management REST API, and Task 5 Challenge Hub into an integrated web application powered by Node.js, Express, and JSON file persistence.

---

## 1. Project Overview & Primary Objectives

The **TechBridge Intern Management Platform** is the capstone integration project (Task 8) for the TechBridge Practical Web Development Internship. It integrates the complete progression of tasks into a cohesive multi-page platform:

1. **Professional Homepage (`index.html`)**: The front entrance highlighting platform capabilities, the 5 core intern value points, platform feature cards, and the 4-step intern learning workflow.
2. **Task 6 Intern Dashboard (`dashboard.html`)**: Interactive dashboard featuring live KPI summary statistics, circular milestone progress visualization, keyword search, status filtering, and dark/light theme switching.
3. **Task 7 Task Management REST API (`/api/tasks`)**: Node.js and Express REST API supporting tasks 1–8 with full JSON persistence to `backend/data/tasks.json`, status transitions, atomic file writes, and health checks.
4. **Task 5 Challenge Hub (`challenges.html`)**: Hands-on challenge explorer powered by the new Challenge REST API (`/api/challenges` and `/api/challenges/:id`) with track filtering, difficulty pills, live keyword search, and detailed specification modals.
5. **Progress Tracking**: Continuous state synchronization calculating completion percentages across all 8 internship milestones.

---

## 2. Technology Stack

- **Frontend**:
  - Semantic **HTML5** with accessibility landmarks and ARIA attributes
  - Modern **CSS3** with custom properties (CSS variables), Flexbox, CSS Grid, and Dark/Light modes
  - **Vanilla JavaScript (ES6+)** with modular state management and event delegation
  - Standard browser **Fetch API** with abort controllers, 12s timeout handling, and offline resilience
- **Backend**:
  - **Node.js** runtime environment
  - **Express.js** web application framework
  - **RESTful API** design with standardized JSON payloads and semantic HTTP status codes
  - **JSON File Persistence** via Node.js `fs/promises` with atomic `.tmp` file renaming
- **Cloud Deployment**:
  - Hosted production backend and full-stack service on **Render**: `https://techbridge-task-api-23lb.onrender.com/`

---

## 3. Project Directory Structure

```
techbridge-final-project/
│
├── frontend/                       # Client-side user interface
│   ├── index.html                  # Unified platform homepage
│   ├── dashboard.html              # Intern Task Management Dashboard
│   ├── challenges.html             # Challenge Hub technical scenarios
│   ├── programs.html               # Learning tracks (Web Dev & Data Analytics)
│   ├── internship-tasks.html       # 30-Day internship roadmap
│   ├── challenges.js               # Challenge Hub API client, filters & modals
│   ├── dashboard.js                # Task Management API client & dashboard UI
│   ├── style.css                   # Unified design system & responsive styling
│   ├── css/
│   │   └── style.css               # Mirrored stylesheet for sub-path imports
│   ├── js/
│   │   ├── dashboard.js            # Mirrored dashboard script
│   │   └── challenges.js           # Mirrored challenges script
│   └── images/
│       └── techbridge-logo.png     # Official TechBridge brand logo
│
├── backend/                        # Server-side API and persistence engine
│   ├── server.js                   # Express REST API and static asset router
│   ├── package.json                # Backend dependency and script configuration
│   ├── test-api.js                 # Automated API test suite (tasks & challenges)
│   └── data/
│       ├── tasks.json              # Persistent JSON store for 8 internship tasks
│       └── challenges.json         # Persistent JSON store for 8 technical challenges
│
├── index.html                      # Root entry point (served directly by Express)
├── dashboard.html                  # Root dashboard entry point
├── challenges.html                 # Root challenge hub entry point
├── challenges.js                   # Root challenge client script
├── dashboard.js                    # Root dashboard client script
├── style.css                       # Root styling design system
├── package.json                    # Workspace npm package configuration
├── .gitignore                      # Git exclusion rules
├── metadata.json                   # AI Studio applet metadata
└── README.md                       # Comprehensive platform documentation
```

---

## 4. REST API Documentation

### Live Cloud Endpoints (Render)
- **Base URL**: `https://techbridge-task-api-23lb.onrender.com`
- **Local Dev URL**: `http://localhost:3000`

### Complete Endpoint Reference

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| **GET** | `/api/health` | Health check verifying server status and uptime | `200 OK` |
| **GET** | `/api/tasks` | Retrieves all 8 internship tasks from `tasks.json` | `200 OK`, `500 Error` |
| **GET** | `/api/tasks/:id` | Retrieves a single task record by numeric ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **PUT** | `/api/tasks/:id` | Updates task status with atomic write to `tasks.json` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/tasks` | Creates a new task with unique numeric ID | `201 Created`, `400 Bad Request` |
| **DELETE** | `/api/tasks/:id` | Deletes a task by numeric ID from `tasks.json` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/tasks/reset` | Resets `tasks.json` to initial 8 TechBridge tasks | `200 OK`, `500 Error` |
| **GET** | `/api/challenges` | Returns all challenges with query filters (`track`, `difficulty`, `search`) | `200 OK`, `500 Error` |
| **GET** | `/api/challenges/:id` | Returns single challenge by string ID (`data-1`) or numericId | `200 OK`, `404 Not Found` |

---

### Challenge Hub Query Parameters (`GET /api/challenges`)

- `track` *(optional)*: Filter by track identifier (e.g. `web-development`, `data-analytics`, or `all`).
- `difficulty` *(optional)*: Filter by difficulty level (`beginner`, `intermediate`, `advanced`, or `all`).
- `search` *(optional)*: Case-insensitive search matching challenge title, description, skills, and tools.

---

### Sample Requests & Responses

#### 1. Challenge Hub API: Get All Challenges
- **Request**: `GET /api/challenges`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "data-1",
      "numericId": 1,
      "name": "Sales Data Cleanup",
      "track": "Data Analytics",
      "trackId": "data-analytics",
      "difficulty": "Beginner",
      "difficultyId": "beginner",
      "shortDescription": "Clean a small sales dataset by fixing missing values, duplicate records and inconsistent formatting.",
      "expectedOutcome": "A clean and organized dataset ready for analysis.",
      "objective": "Prepare messy business data for accurate analysis.",
      "skills": ["Data cleaning", "Spreadsheet organization", "Identifying duplicates", "Handling missing values"],
      "tools": ["Google Sheets", "Microsoft Excel"],
      "deliverable": "A cleaned version of the supplied sales dataset.",
      "estimatedTime": "45–60 minutes",
      "expectedResult": "A consistent dataset with obvious errors corrected."
    }
  ]
}
```

#### 2. Single Challenge Retrieval
- **Request**: `GET /api/challenges/web-1`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "web-1",
    "numericId": 5,
    "name": "Responsive Landing Page",
    "track": "Web Development",
    "trackId": "web-development",
    "difficulty": "Beginner",
    "difficultyId": "beginner",
    "shortDescription": "Build a clean landing page that adapts properly across desktop, tablet and mobile screens.",
    "skills": ["HTML5", "CSS3", "Flexbox/Grid", "Media queries"],
    "tools": ["VS Code", "Browser Developer Tools"],
    "deliverable": "A complete responsive landing page."
  }
}
```

#### 3. Update Task Status
- **Request**: `PUT /api/tasks/8`
- **Body**: `{ "status": "completed" }`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "id": 8,
    "title": "Final Intern Management Platform",
    "status": "completed",
    "updatedAt": "2026-10-27T08:30:00.000Z"
  }
}
```

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd techbridge-final-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express full-stack server**:
   ```bash
   npm start
   ```
   *(Server starts on `http://localhost:3000`)*

4. **Access the application routes**:
   - Homepage: [http://localhost:3000](http://localhost:3000)
   - Intern Dashboard: [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
   - Challenge Hub: [http://localhost:3000/challenges.html](http://localhost:3000/challenges.html)
   - Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - Tasks API: [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)
   - Challenges API: [http://localhost:3000/api/challenges](http://localhost:3000/api/challenges)

---

## 6. Automated Verification Tests

The platform includes a built-in automated test script covering all REST API endpoints, validation logic, error handling, and JSON persistence:

```bash
node backend/test-api.js
```

### Verified Test Cases (All Passing):
- **Health Check**: `GET /api/health` returns HTTP 200 with `status: "healthy"` and server timestamp.
- **Get All Tasks**: `GET /api/tasks` returns HTTP 200 with exactly 8 structured tasks.
- **Get Single Task**: `GET /api/tasks/1` returns HTTP 200 with full task details.
- **404 Handling**: `GET /api/tasks/9999` returns HTTP 404 with structured error payload.
- **400 Validation**: `GET /api/tasks/invalid-id` returns HTTP 400 for non-numeric input.
- **Task Status Mutation**: `PUT /api/tasks/7` updates status to `completed` with HTTP 200.
- **File Persistence**: Confirms on-disk write to `backend/data/tasks.json`.
- **Status Validation**: `PUT` with invalid status value returns HTTP 400.
- **Task Reset**: `POST /api/tasks/reset` restores 8 initial tasks.
- **Get All Challenges**: `GET /api/challenges` returns HTTP 200 with 8 challenges.
- **Query Filter**: `GET /api/challenges?track=web-development` returns 4 web challenges.
- **Single Challenge**: `GET /api/challenges/data-1` returns HTTP 200 with correct challenge object.
- **Challenge 404**: `GET /api/challenges/unknown-999` returns HTTP 404.

---

## 7. Render Cloud Deployment Details

The backend API and static frontend assets are deployed as a unified Web Service on Render:

- **Service Type**: Web Service
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node backend/server.js` (or `npm start`)
- **Public URL**: `https://techbridge-task-api-23lb.onrender.com`

### Dual-Mode Connection Architecture:
The frontend client dynamically resolves its backend target:
1. When loaded from `localhost` or directly on Render, it communicates with the local origin (`/api/*`).
2. When viewed in an external static environment or iframe preview, it automatically points to `https://techbridge-task-api-23lb.onrender.com`.
3. If the remote service is spinning up or offline, the client seamlessly falls back to bundled in-memory datasets, ensuring the user experience never breaks.

---

## 8. Presentation & LinkedIn Submission Checklist

- [x] **Unified Platform Navigation**: Working links between Homepage, Dashboard, Challenges, Tasks, and Programs without broken 404s.
- [x] **TechBridge Branding**: Official logo proportions preserved across mobile, tablet, and desktop viewports.
- [x] **REST API Persistence**: Task status changes persist to `backend/data/tasks.json` across browser reloads.
- [x] **Challenge Hub Integration**: Dynamic fetching from `/api/challenges` with live filtering and modal previews.
- [x] **Progress Analytics**: Accurate mathematical calculation of completed tasks and percentage metrics.
- [x] **Automated Test Suite**: 13 comprehensive API assertions passing with 0 failures.
- [x] **Accessibility**: Semantic HTML5, keyboard trap in modals, Escape key support, and high-contrast color tokens.

---

## 9. License & Credits

Developed as part of the **TechBridge Web Development Internship** Assessment.  
© 2026 TechBridge by Baselink Services Limited. All rights reserved.
