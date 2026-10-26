# TechBridge Web Development Internship — Task 7: Task Management REST API & Dashboard

A production-grade, full-stack Task Management application upgrading the TechBridge Intern Dashboard from Task 6 into an interactive platform powered by a Node.js and Express REST API with persistent JSON file storage.

---

## 1. Project Architecture & Technologies

### Frontend
- **HTML5**: Semantic document structure, accessible ARIA roles, and modal dialogs.
- **CSS3**: Custom design system, responsive flex/grid layouts, subtle micro-interactions, and WCAG AAA Dark/Light theme system.
- **Vanilla JavaScript**: Pure ES6+ client logic, state management, and DOM manipulation (no React, Next.js, or external UI libraries).
- **Fetch API**: Asynchronous HTTP client communicating with backend endpoints.

### Backend
- **Node.js**: Cross-platform asynchronous JavaScript runtime environment.
- **Express.js**: Fast, minimalist web framework delivering REST API routes and serving static frontend assets.
- **RESTful API**: Standardized JSON endpoints with robust HTTP status codes (`200`, `201`, `400`, `404`, `500`).
- **JSON File Storage**: Asynchronous, atomic read and write persistence to `backend/data/tasks.json` without requiring an external database.

---

## 2. Project Directory Structure

```
techbridge-task-management/
│
├── frontend/                       # Client-side user interface
│   ├── index.html                  # TechBridge platform landing page
│   ├── dashboard.html              # Intern Task Management Dashboard
│   ├── programs.html               # Learning tracks (Web Dev & Data Analytics)
│   ├── internship-tasks.html       # 30-Day internship chronological roadmap
│   ├── challenges.html             # Challenge Hub technical scenarios
│   ├── challenges.js               # Challenge Hub filtering and modal script
│   ├── css/
│   │   └── style.css               # Unified styling and dark/light design system
│   ├── js/
│   │   └── dashboard.js            # Task 7 API client, DOM renderer, and UI handlers
│   └── images/
│       └── techbridge-logo.png     # Official TechBridge brand identity logo
│
├── backend/                        # Server-side API and persistence engine
│   ├── server.js                   # Express application, routes, and file I/O
│   ├── package.json                # Backend dependency configuration
│   ├── test-api.js                 # Automated 22-step API test suite
│   └── data/
│       └── tasks.json              # Persistent JSON data store for internship tasks
│
├── metadata.json                   # AI Studio application metadata
├── package.json                    # Workspace root scripts and dependencies
└── README.md                       # Complete documentation and setup guide
```

---

## 3. REST API Documentation

Base URL: `http://localhost:3000`

### Endpoints Table

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| **GET** | `/api/health` | Health check verifying server status and uptime | `200 OK` |
| **GET** | `/api/tasks` | Retrieves all eight TechBridge internship tasks | `200 OK`, `500 Internal Error` |
| **GET** | `/api/tasks/:id` | Retrieves a single task record by its numeric ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **PUT** | `/api/tasks/:id` | Updates a task status and persists to `tasks.json` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/tasks` | Creates a new task with unique numeric ID | `201 Created`, `400 Bad Request` |
| **DELETE** | `/api/tasks/:id` | Deletes a task by its numeric ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/tasks/reset` | Resets `tasks.json` to the initial 8 TechBridge tasks | `200 OK`, `500 Internal Error` |

---

### Allowed Task Status Values

The API enforces strict validation. The allowed status values are:

- `not_started` &rarr; Displayed in UI as **Not Started**
- `in_progress` &rarr; Displayed in UI as **In Progress**
- `completed` &rarr; Displayed in UI as **Completed**

*Note: For backwards compatibility, incoming values like `not-started` or `in-progress` are automatically normalized to `not_started` and `in_progress`.*

---

### Sample Requests & Responses

#### 1. Health Check
- **Request**: `GET /api/health`
- **Response** (`200 OK`):
```json
{
  "status": "healthy",
  "message": "TechBridge Task Management API is running",
  "timestamp": "2026-10-26T09:43:16.892Z",
  "uptimeSeconds": 4,
  "environment": "development"
}
```

#### 2. Get All Tasks
- **Request**: `GET /api/tasks`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "order": 1,
      "title": "TechBridge Landing Page",
      "description": "Create the first version of the TechBridge website using HTML5 and CSS3.",
      "status": "completed",
      "day": "Day 1",
      "stage": "Stage 01 • Foundation",
      "milestone": "Foundation Milestone",
      "relatedUrl": "index.html",
      "urlLabel": "View Live Homepage",
      "skills": ["Semantic HTML5", "CSS3 Layouts", "Brand Styling", "Mobile Responsiveness"],
      "deliverable": "Complete responsive homepage with navigation, hero section, and curriculum previews.",
      "createdAt": "2026-10-01T09:00:00.000Z",
      "updatedAt": "2026-10-03T16:30:00.000Z"
    }
    // ... remaining tasks 2 through 8
  ]
}
```

#### 3. Update Task Status
- **Request**: `PUT /api/tasks/7`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "status": "completed"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "id": 7,
    "title": "Task Management API",
    "status": "completed",
    "updatedAt": "2026-10-26T09:43:17.102Z"
  }
}
```

#### 4. Invalid Status Error
- **Request**: `PUT /api/tasks/7`
- **Body**: `{ "status": "unknown_value" }`
- **Response** (`400 Bad Request`):
```json
{
  "success": false,
  "error": "Invalid status \"unknown_value\". Allowed values: not_started, in_progress, completed"
}
```

#### 5. Task Not Found Error
- **Request**: `GET /api/tasks/999`
- **Response** (`404 Not Found`):
```json
{
  "success": false,
  "error": "Task not found with ID 999"
}
```

---

## 4. Local Development & Setup Instructions

### Prerequisites
- **Node.js** version 18.0.0 or higher
- **npm** version 9.0.0 or higher

### Step-by-Step Setup

1. **Clone or Navigate to the Project Root**:
   ```bash
   cd techbridge-task-management
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express Full-Stack Server**:
   ```bash
   npm start
   ```
   *(Alternatively, `node backend/server.js` or `npm run dev`)*

4. **Open the Application**:
   - Intern Dashboard: [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
   - TechBridge Landing Page: [http://localhost:3000](http://localhost:3000)
   - API Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - API Tasks Endpoint: [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)

> **Important**: Do not open `frontend/dashboard.html` using a direct `file:///` browser path. Browsers block relative `fetch('/api/tasks')` requests over `file://` protocols due to Cross-Origin Security policies. Serving the frontend through Express at `http://localhost:3000` guarantees same-origin API communication.

---

## 5. Running Automated Verification Tests

A built-in test suite verifies all required endpoints, validation rules, error codes, and atomic file persistence:

```bash
node backend/test-api.js
```

### Verified Test Cases (22/22 Passing)
- `GET /api/health` returns HTTP 200 with timestamp and healthy status.
- `GET /api/tasks` returns HTTP 200 with all 8 internship task records.
- `GET /api/tasks/1` returns HTTP 200 with task 1 details.
- `GET /api/tasks/9999` returns HTTP 404 with structured error response.
- `GET /api/tasks/invalid-id` returns HTTP 400 for non-numeric ID.
- `PUT /api/tasks/7` updates status to `completed` with HTTP 200.
- Verified on disk: Status change persists to `backend/data/tasks.json` across server restarts.
- `PUT` rejects invalid status values with HTTP 400.
- `POST /api/tasks/reset` restores initial 8 tasks with HTTP 200.

---

## 6. Key Features & Frontend Enhancements

1. **Live Backend Connection Indicator**:
   - Visually indicates connection state (`Connected` with pulsing green dot, `Offline` with red dot).
   - Provides accessible text for screen readers (`role="status" aria-live="polite"`).
   - Includes a manual refresh/retry button to re-check `GET /api/health` without reloading the page.

2. **Polished Loading & Error States**:
   - Displays an animated loading spinner with clear copy while waiting for `GET /api/tasks`.
   - On connection failure, displays a clear error card with a dedicated **Retry Connection** button.

3. **Dynamic View Task Modal**:
   - Clicking "View Task" fetches fresh single-task data from `GET /api/tasks/:id`.
   - Displays title, description, stage, milestone, deliverable, and skill badges.
   - Includes full keyboard navigation and Escape key closure.

4. **Real-Time Mark as Completed**:
   - Sends a real `PUT /api/tasks/:id` request with `{ "status": "completed" }`.
   - Prevents duplicate clicks by displaying a loading state on the button.
   - Automatically recalculates KPI statistics, updates the progress percentage, refilters the task list, and displays a success toast.

5. **WCAG AAA Dark Mode Harmony**:
   - Re-tuned color tokens eliminate color clashes on cards, tags, and navigation.
   - Contrast ratios exceed WCAG AA and AAA accessibility standards across all components.

---

## 7. License
Developed for the TechBridge Practical Web Development Internship Assessment. © 2026 TechBridge by Baselink Services Limited.
