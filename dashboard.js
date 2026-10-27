/**
 * TECHBRIDGE INTERN DASHBOARD — TASK 7
 * Full-Stack Task Management API & Frontend Integration
 * 
 * Features:
 * - Real-time communication with Node.js & Express REST API (/api/tasks, /api/health)
 * - Dynamic task loading with animated spinner and error recovery
 * - Live Backend Connection Status Indicator (Connected / Offline)
 * - Single-task fetching via GET /api/tasks/:id in accessible modal
 * - Persistent status updates via PUT /api/tasks/:id with tasks.json server persistence
 * - Client-side status filtering (All, Completed, In Progress, Not Started)
 * - Real-time title & description search
 * - Dynamic KPI statistics & progress continuum recalculation
 * - Theme switcher (Dark / Light mode) with WCAG AAA contrast harmony
 * - API documentation modal
 */

// ==========================================================================
// 1. CONSTANTS & APPLICATION STATE
// ==========================================================================
const THEME_STORAGE_KEY = "techbridgeDashboardTheme";
const LOCAL_STORAGE_TASKS_KEY = "techbridge_tasks_data";
const CUSTOM_API_STORAGE_KEY = "techbridge_custom_api_url";

// Official Live Deployed Render Backend API
const LIVE_RENDER_API_URL = "https://techbridge-task-api-23lb.onrender.com";

function resolveApiBaseUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryApi = urlParams.get("api");
    if (queryApi && queryApi.startsWith("http")) {
      const clean = queryApi.trim().replace(/\/$/, "");
      localStorage.setItem(CUSTOM_API_STORAGE_KEY, clean);
      return clean;
    }
    const savedApi = localStorage.getItem(CUSTOM_API_STORAGE_KEY);
    if (savedApi && savedApi.startsWith("http")) {
      return savedApi.trim().replace(/\/$/, "");
    }
  } catch (e) {
    console.warn("Could not read custom API URL", e);
  }

  // If local development on localhost or 127.0.0.1, prioritize local origin
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return window.location.origin;
  }

  // Default to live Render cloud service
  return LIVE_RENDER_API_URL;
}

let API_BASE_URL = resolveApiBaseUrl();

// Initial Seed Tasks (aligned with backend/data/tasks.json for static hosting resilience)
const DEFAULT_TASKS = [
  {
    "id": 1,
    "order": 1,
    "title": "TechBridge Landing Page",
    "description": "Create the first version of the TechBridge website using HTML5 and CSS3 with responsive layouts and brand styling.",
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
  },
  {
    "id": 2,
    "order": 2,
    "title": "Internship Tracks Experience",
    "description": "Create a Programs experience presenting TechBridge available learning tracks in Web Development and Data Analytics.",
    "status": "completed",
    "day": "Day 4",
    "stage": "Stage 01 • Foundation",
    "milestone": "Curriculum Presentation",
    "relatedUrl": "programs.html",
    "urlLabel": "View Programs Experience",
    "skills": ["Curriculum Architecture", "Card Component Systems", "Dual-Track Layouts", "CSS Interactions"],
    "deliverable": "Dedicated programs page showcasing Web Development and Data Analytics learning tracks.",
    "createdAt": "2026-10-04T09:00:00.000Z",
    "updatedAt": "2026-10-07T17:00:00.000Z"
  },
  {
    "id": 3,
    "order": 3,
    "title": "Internship Tasks Roadmap",
    "description": "Create an interactive interface presenting the TechBridge 30-day internship roadmap and milestone trajectory.",
    "status": "completed",
    "day": "Day 8",
    "stage": "Stage 02 • Progression",
    "milestone": "Roadmap Architecture",
    "relatedUrl": "internship-tasks.html",
    "urlLabel": "View Tasks Roadmap",
    "skills": ["Timeline Visualization", "Phase Modeling", "Process Architecture", "Content Hierarchy"],
    "deliverable": "Visual 30-day chronological timeline displaying the full 8-milestone trajectory.",
    "createdAt": "2026-10-08T09:00:00.000Z",
    "updatedAt": "2026-10-10T15:20:00.000Z"
  },
  {
    "id": 4,
    "order": 4,
    "title": "Interactive Task Tracker",
    "description": "Use JavaScript to make the internship task experience interactive and enable dynamic filtering and progress tracking.",
    "status": "completed",
    "day": "Day 11",
    "stage": "Stage 02 • Progression",
    "milestone": "Dynamic State",
    "relatedUrl": "internship-tasks.html",
    "urlLabel": "View Task Tracker",
    "skills": ["DOM Manipulation", "Event Handling", "State Management", "Data Filtering"],
    "deliverable": "Dynamic client-side interactivity enabling seamless filtering and status updates.",
    "createdAt": "2026-10-11T09:00:00.000Z",
    "updatedAt": "2026-10-14T18:00:00.000Z"
  },
  {
    "id": 5,
    "order": 5,
    "title": "Challenge Hub Experience",
    "description": "Create a hands-on Challenge Hub featuring real-world technical challenges, track tagging, and modal previews.",
    "status": "completed",
    "day": "Day 15",
    "stage": "Stage 03 • Application & Submission",
    "milestone": "Challenge Repository",
    "relatedUrl": "challenges.html",
    "urlLabel": "Explore Challenge Hub",
    "skills": ["Filter Pipelines", "Search Optimization", "Modal Windows", "Accessibility"],
    "deliverable": "10 interactive challenge cards with search, filtering, and detailed specification modal.",
    "createdAt": "2026-10-15T09:00:00.000Z",
    "updatedAt": "2026-10-18T16:45:00.000Z"
  },
  {
    "id": 6,
    "order": 6,
    "title": "Interactive Intern Dashboard",
    "description": "Build an intern dashboard unifying task metrics, progress milestones, task tracking, and modern technology explorations.",
    "status": "completed",
    "day": "Day 19",
    "stage": "Stage 03 • Application & Submission",
    "milestone": "Dashboard Architecture",
    "relatedUrl": "dashboard.html",
    "urlLabel": "Current Dashboard",
    "skills": ["SaaS Dashboard Design", "KPI Metric Aggregation", "Responsive Navigation", "Theme System"],
    "deliverable": "Interactive dashboard with KPI metrics, progress visualization, search & filters, and dark mode.",
    "createdAt": "2026-10-19T09:00:00.000Z",
    "updatedAt": "2026-10-21T14:10:00.000Z"
  },
  {
    "id": 7,
    "order": 7,
    "title": "Task Management API",
    "description": "Build a professional Node.js and Express REST API to power the Intern Dashboard with full CRUD persistence.",
    "status": "in_progress",
    "day": "Day 22",
    "stage": "Stage 04 • Platform Integration",
    "milestone": "Full-Stack API Integration",
    "relatedUrl": "dashboard.html",
    "urlLabel": "Live API Dashboard",
    "skills": ["Node.js", "Express.js", "RESTful Architecture", "JSON File Persistence", "HTTP Status Codes"],
    "deliverable": "Working Express API with GET, PUT, POST endpoints connected to tasks.json and frontend fetch().",
    "createdAt": "2026-10-22T09:00:00.000Z",
    "updatedAt": "2026-10-26T09:30:00.000Z"
  },
  {
    "id": 8,
    "order": 8,
    "title": "Complete Platform Integration",
    "description": "Combine the homepage, programs, tasks, challenges, and dashboard into a production-grade full-stack learning platform.",
    "status": "not_started",
    "day": "Day 26",
    "stage": "Stage 04 • Platform Integration",
    "milestone": "Platform Finale",
    "relatedUrl": "index.html",
    "urlLabel": "TechBridge Home",
    "skills": ["System Integration", "Cross-Page Navigation", "Production Polish", "Deployment Readiness"],
    "deliverable": "Unified multi-page platform integrating homepage, programs, tasks, challenges, and dashboard.",
    "createdAt": "2026-10-26T10:00:00.000Z",
    "updatedAt": "2026-10-26T10:00:00.000Z"
  }
];

function loadLocalTasks() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local tasks", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_TASKS));
}

function saveLocalTasks(tasksToSave) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasksToSave));
  } catch (e) {
    console.warn("Could not write local tasks", e);
  }
}

let tasks = [];
let activeTaskFilter = "all";
let taskSearchQuery = "";
let activeTechnology = "nextjs";
let focusedTriggerElement = null;
let isBackendConnected = false;
let isFetchingTasks = false;

// Educational Modern Web Technologies Explorer Data (Preserved from Task 6)
const technologyData = {
  nextjs: {
    name: "Next.js",
    category: "React Framework • Full-Stack Web Applications",
    tagline: "The React framework for production-grade full-stack web applications.",
    badge: "Frontend & Full-Stack",
    overview: "Next.js is an open-source React framework created by Vercel. It extends React with built-in server-side rendering (SSR), static site generation (SSG), file-system routing, and serverless API endpoints.",
    coreCapabilities: [
      {
        title: "Server-Side Rendering (SSR)",
        desc: "Renders pages on the server per request, boosting search engine optimization (SEO) and initial load performance."
      },
      {
        title: "File-System Based Routing",
        desc: "Organizes routes automatically through directory structure without complex router configurations."
      },
      {
        title: "Built-In Optimization",
        desc: "Automatic image, font, and script optimizations out of the box to maximize Core Web Vitals scores."
      },
      {
        title: "Server Actions & API Routes",
        desc: "Enables building backend API handlers directly alongside frontend UI components within the same project."
      }
    ],
    useCases: [
      "Large-scale e-commerce stores requiring fast SEO and dynamic pricing.",
      "Content-heavy publication platforms and marketing sites.",
      "SaaS dashboards requiring authenticated server-side data fetching."
    ],
    note: "Educational technology reference. TechBridge Task 7 uses Vanilla JavaScript and Express."
  },

  vue: {
    name: "Vue.js",
    category: "Progressive JavaScript Framework",
    tagline: "An approachable, performant, and versatile framework for building web user interfaces.",
    badge: "Reactive UI Framework",
    overview: "Vue.js is a progressive JavaScript framework designed for building interactive user interfaces. It features an intuitive Single-File Component (SFC) format combining HTML template, script, and scoped styles in one clean file.",
    coreCapabilities: [
      {
        title: "Declarative Reactivity",
        desc: "Deep reactivity system (Composition API and Options API) that automatically tracks state changes and updates DOM nodes efficiently."
      },
      {
        title: "Single-File Components (.vue)",
        desc: "Encapsulates markup, JavaScript logic, and CSS styles in a single unified component file."
      },
      {
        title: "Gentle Learning Curve",
        desc: "Can be introduced incrementally, from a simple script tag in standard HTML to a complete enterprise build toolchain."
      },
      {
        title: "Rich Official Ecosystem",
        desc: "First-class official companion libraries including Pinia (state management) and Vue Router."
      }
    ],
    useCases: [
      "Single-page applications (SPAs) requiring rapid prototyping and clean maintainability.",
      "Interactive data dashboards and customer-facing web tools.",
      "Gradual modernization of legacy server-rendered web applications."
    ],
    note: "Educational technology reference. TechBridge Task 7 uses Vanilla JavaScript and Express."
  },

  angular: {
    name: "Angular",
    category: "Enterprise Web Application Framework",
    tagline: "A structured, TypeScript-first application framework for large-scale enterprise solutions.",
    badge: "Enterprise Architecture",
    overview: "Angular is a comprehensive, open-source web application platform maintained by Google. It enforces strong architectural patterns, TypeScript by default, dependency injection, and integrated tooling for enterprise scale.",
    coreCapabilities: [
      {
        title: "TypeScript by Default",
        desc: "Strict type safety, modern language constructs, and rich IDE tooling across the entire codebase."
      },
      {
        title: "Built-In Dependency Injection",
        desc: "Hierarchical dependency injection system for modularity, code reuse, and testability."
      },
      {
        title: "Complete Tooling Suite",
        desc: "Includes routing, forms validation, HTTP client, and testing utilities within the core framework."
      },
      {
        title: "Signals & Reactive Primitives",
        desc: "Modern reactive primitives for fine-grained change detection and optimal runtime rendering performance."
      }
    ],
    useCases: [
      "Mission-critical enterprise software and banking/fintech portals.",
      "Complex multi-role organizational portals with large engineering teams.",
      "Internal administrative systems requiring strict coding conventions."
    ],
    note: "Educational technology reference. TechBridge Task 7 uses Vanilla JavaScript and Express."
  },

  backend: {
    name: "Node.js & Express REST API",
    category: "Server-Side Architecture & REST APIs",
    tagline: "The engine that powers data storage, task validation, business logic, and JSON file persistence.",
    badge: "Full-Stack Engine (Task 7)",
    overview: "Task 7 upgrades the TechBridge Intern Dashboard with a genuine Node.js and Express backend REST API. It handles incoming HTTP requests, performs strict status validation, serves endpoints (/api/tasks, /api/health), and asynchronously persists task state to backend/data/tasks.json.",
    coreCapabilities: [
      {
        title: "Node.js (JavaScript Runtime)",
        desc: "An event-driven, non-blocking asynchronous JavaScript runtime allowing developers to build fast, scalable network applications."
      },
      {
        title: "Express.js REST Framework",
        desc: "Minimalist web framework providing routing for GET, PUT, POST, DELETE endpoints, JSON body parsing, and CORS headers."
      },
      {
        title: "JSON File Persistence",
        desc: "Atomic, asynchronous file read/write operations ensuring task status updates survive server restarts."
      },
      {
        title: "Same-Origin Static Serving",
        desc: "Express simultaneously delivers the REST API and serves the production frontend on port 3000."
      }
    ],
    useCases: [
      "Task management dashboards requiring reliable status persistence across user sessions.",
      "Full-stack web engineering applications bridging frontend DOM with backend APIs.",
      "Educational platforms demonstrating client-server HTTP communication."
    ],
    note: "Currently active! Powered by backend/server.js and backend/data/tasks.json."
  }
};

// ==========================================================================
// ==========================================================================
// 2. BACKEND API SERVICE & RESILIENT FALLBACK (DUAL-MODE ARCHITECTURE)
// ==========================================================================

/**
 * Checks backend health via GET /api/health with timeout and static CDN detection
 */
async function checkBackendStatus() {
  const retryBtn = document.getElementById("btn-retry-backend");
  const staticNotice = document.getElementById("static-deployment-notice");

  if (retryBtn) retryBtn.classList.add("is-refreshing");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      isBackendConnected = true;
      const isRender = API_BASE_URL.includes("onrender.com");
      updateBackendUI(true, isRender ? "Backend Status: Connected (Render API)" : "Backend Status: Connected");
      if (staticNotice) staticNotice.style.display = "none";
      console.log("[Backend Health Check]: Connected to live Express REST API", data);
    } else {
      isBackendConnected = false;
      updateBackendUI(false, "Backend: Offline (Client Preview)");
      if (staticNotice) staticNotice.style.display = "flex";
    }
  } catch (error) {
    isBackendConnected = false;
    updateBackendUI(false, "Backend: Offline (Client Preview)");
    if (staticNotice) staticNotice.style.display = "flex";
    console.warn("[Backend Health Check]: Offline/Static host detected", error.message);
  } finally {
    if (retryBtn) {
      setTimeout(() => retryBtn.classList.remove("is-refreshing"), 400);
    }
  }
}

/**
 * Updates UI elements reflecting backend connection status
 */
function updateBackendUI(connected, label) {
  const dot = document.getElementById("backend-status-dot");
  const text = document.getElementById("backend-status-text");
  const mobileDot = document.getElementById("mobile-backend-status-dot");
  const mobileText = document.getElementById("mobile-backend-status-text");

  if (dot) {
    dot.className = `status-indicator-dot ${connected ? "dot-connected" : "dot-offline"}`;
  }
  if (text) {
    text.textContent = label;
  }
  if (mobileDot) {
    mobileDot.className = `status-indicator-dot ${connected ? "dot-connected" : "dot-offline"}`;
  }
  if (mobileText) {
    mobileText.textContent = connected ? "API Online" : "Client Preview";
  }
}

/**
 * Retrieves all tasks from GET /api/tasks with seamless fallback to client storage on static deployments
 */
async function fetchTasks() {
  if (isFetchingTasks) return;
  isFetchingTasks = true;

  const loadingEl = document.getElementById("tasks-loading-state");
  const errorEl = document.getElementById("tasks-error-state");
  const containerEl = document.getElementById("tasks-container");
  const emptyEl = document.getElementById("tasks-empty-state");
  const staticNotice = document.getElementById("static-deployment-notice");

  // Show loading indicator, hide error and cards
  if (loadingEl) loadingEl.style.display = "flex";
  if (errorEl) errorEl.style.display = "none";
  if (containerEl) containerEl.style.display = "none";
  if (emptyEl) emptyEl.style.display = "none";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result || !result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid API response format received from /api/tasks");
    }

    // Set tasks data from server
    tasks = result.data;
    saveLocalTasks(tasks);
    isBackendConnected = true;
    updateBackendUI(true, "Backend Status: Connected");
    if (staticNotice) staticNotice.style.display = "none";

    // Hide loading, show container
    if (loadingEl) loadingEl.style.display = "none";
    if (containerEl) containerEl.style.display = "grid";

    // Re-render UI
    renderTasks();
    updateDashboardStats();
    updateProgress();

    console.log(`[API Integration]: Successfully loaded ${tasks.length} tasks from GET /api/tasks`);
  } catch (error) {
    console.warn("[API Notice]: Live Express backend not reachable on this host (e.g., static CDN deployment). Gracefully switching to Client Preview Mode.", error.message);
    isBackendConnected = false;
    updateBackendUI(false, "Backend: Offline (Client Preview)");

    // Show the static deployment notice banner so the evaluator understands why
    if (staticNotice) staticNotice.style.display = "flex";

    // Gracefully load from local storage or DEFAULT_TASKS so the UI never breaks
    tasks = loadLocalTasks();

    if (loadingEl) loadingEl.style.display = "none";
    if (errorEl) errorEl.style.display = "none";
    if (containerEl) containerEl.style.display = "grid";

    renderTasks();
    updateDashboardStats();
    updateProgress();

    showToast("Running in Client Preview Mode (Backend offline on static host)", "info");
  } finally {
    isFetchingTasks = false;
  }
}

/**
 * Fetches single task details from GET /api/tasks/:id with fallback to local state
 */
async function fetchTaskById(taskId) {
  const numericId = parseInt(taskId, 10);
  if (isBackendConnected) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${numericId}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store"
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
    } catch (e) {
      console.warn(`[API]: Could not fetch task ${numericId} from API, falling back to local tasks`, e);
    }
  }

  // Fallback to local memory / tasks array
  const localTask = tasks.find(t => t.id === numericId);
  if (localTask) return localTask;
  throw new Error(`Task with ID ${numericId} not found`);
}

/**
 * Updates a task status via PUT /api/tasks/:id with fallback to client persistence
 */
async function updateTaskStatus(taskId, newStatus, buttonElement = null) {
  const originalButtonContent = buttonElement ? buttonElement.innerHTML : null;
  const numericId = parseInt(taskId, 10);

  if (buttonElement) {
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> <span>Saving...</span>`;
  }

  const validStatus = newStatus.replace(/-/g, "_");

  // Attempt live API update if connected
  if (isBackendConnected) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${numericId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ status: validStatus })
      });

      if (response.ok) {
        const result = await response.json();
        const updatedTask = result.data;

        // Update local task state from server response
        const index = tasks.findIndex(t => t.id === numericId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...updatedTask };
        }
        saveLocalTasks(tasks);

        // Refresh UI components
        renderTasks();
        updateDashboardStats();
        updateProgress();

        showToast(`Task ${numericId} marked as completed ✓`, "success");
        console.log(`[API Task Updated]: Task ${numericId} is now ${validStatus}`);
        return updatedTask;
      }
    } catch (error) {
      console.warn(`[API Update Error]: Backend update failed, saving locally:`, error);
    }
  }

  // Graceful fallback for static deployment / offline mode:
  const index = tasks.findIndex(t => t.id === numericId);
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      status: validStatus,
      updatedAt: new Date().toISOString()
    };
    saveLocalTasks(tasks);

    // Refresh UI components
    renderTasks();
    updateDashboardStats();
    updateProgress();

    showToast(`Task ${numericId} marked as completed (Client Preview Mode) ✓`, "success");
    if (buttonElement && originalButtonContent) {
      buttonElement.disabled = false;
      buttonElement.innerHTML = originalButtonContent;
    }
    return tasks[index];
  } else {
    showToast(`Task ${numericId} not found`, "error");
    if (buttonElement && originalButtonContent) {
      buttonElement.disabled = false;
      buttonElement.innerHTML = originalButtonContent;
    }
  }
}

/**
 * Resets tasks on backend via POST /api/tasks/reset with fallback to client persistence
 */
async function resetBackendTasks() {
  const confirmed = window.confirm(
    "Reset internship progress? This will reset all tasks back to default initial state."
  );
  if (!confirmed) return;

  if (isBackendConnected) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/reset`, {
        method: "POST",
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        await fetchTasks();
        showToast("Internship tasks reset to default state ✓", "info");
        return;
      }
    } catch (error) {
      console.warn("[API Reset Error]: Reset endpoint unreachable, resetting locally", error);
    }
  }

  // Fallback for static hosting / offline
  try {
    localStorage.removeItem(LOCAL_STORAGE_TASKS_KEY);
  } catch (e) {}
  tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  saveLocalTasks(tasks);
  renderTasks();
  updateDashboardStats();
  updateProgress();
  showToast("Internship tasks reset to default state (Client Preview Mode) ✓", "info");
}


// ==========================================================================
// 3. STATS & PROGRESS COMPUTATION
// ==========================================================================

function getProgressMetrics() {
  const total = tasks.length;
  if (total === 0) {
    return { total: 0, completed: 0, inProgress: 0, notStarted: 0, percentage: 0, currentTask: null };
  }

  const completed = tasks.filter(t => t.status === "completed").length;
  const inProgress = tasks.filter(t => t.status === "in_progress" || t.status === "in-progress").length;
  const notStarted = tasks.filter(t => t.status === "not_started" || t.status === "not-started").length;
  const rawPercentage = (completed / total) * 100;
  const percentage = Math.round(rawPercentage * 10) / 10;

  // Next active task
  let currentTask = tasks.find(t => t.status === "in_progress" || t.status === "in-progress");
  if (!currentTask && completed < total) {
    currentTask = tasks.find(t => t.status === "not_started" || t.status === "not-started");
  }

  return { total, completed, inProgress, notStarted, percentage, currentTask };
}

function updateDashboardStats() {
  const metrics = getProgressMetrics();

  const totalEl = document.getElementById("stat-total-tasks");
  const completedEl = document.getElementById("stat-completed-tasks");
  const remainingEl = document.getElementById("stat-remaining-tasks");
  const percentEl = document.getElementById("stat-progress-percent");
  const currentTaskNameEl = document.getElementById("stat-current-task-name");

  if (totalEl) totalEl.textContent = metrics.total;
  if (completedEl) completedEl.textContent = metrics.completed;
  if (remainingEl) remainingEl.textContent = metrics.total - metrics.completed;
  if (percentEl) percentEl.textContent = `${metrics.percentage}%`;

  if (currentTaskNameEl) {
    if (metrics.completed === metrics.total && metrics.total > 0) {
      currentTaskNameEl.textContent = "All 8 Tasks Completed! 🎉";
    } else if (metrics.currentTask) {
      currentTaskNameEl.textContent = `Task ${metrics.currentTask.id}: ${metrics.currentTask.title}`;
    } else {
      currentTaskNameEl.textContent = "No tasks in progress";
    }
  }

  // Header Current Task Indicator Badge
  const headerCurrentTaskEl = document.getElementById("header-current-task");
  if (headerCurrentTaskEl) {
    if (metrics.completed === metrics.total && metrics.total > 0) {
      headerCurrentTaskEl.textContent = "All Tasks Completed";
    } else if (metrics.currentTask) {
      const dayLabel = metrics.currentTask.day || `Day ${metrics.currentTask.id * 3}`;
      headerCurrentTaskEl.textContent = `Task ${metrics.currentTask.id} • ${dayLabel}`;
    }
  }

  // 100% Celebration Banner
  const celebrationBanner = document.getElementById("all-completed-banner");
  if (celebrationBanner) {
    celebrationBanner.style.display = (metrics.completed === metrics.total && metrics.total > 0) ? "flex" : "none";
  }
}

function updateProgress() {
  const metrics = getProgressMetrics();

  const progressBarLabel = document.getElementById("progress-bar-label");
  const progressBarTrack = document.getElementById("progress-bar-track");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressFraction = document.getElementById("progress-bar-fraction");

  if (progressBarLabel) progressBarLabel.textContent = `${metrics.percentage}%`;

  if (progressBarTrack) {
    progressBarTrack.setAttribute("aria-valuenow", metrics.percentage);
  }

  if (progressBarFill) {
    progressBarFill.style.width = `${metrics.percentage}%`;
  }

  if (progressFraction) {
    progressFraction.textContent = `${metrics.completed} of ${metrics.total} Tasks Completed`;
  }
}

// ==========================================================================
// 4. TASK FILTERING & SEARCH
// ==========================================================================

function getFilteredTasks() {
  return tasks.filter(task => {
    // Status Filter Matching
    let matchesStatus = true;
    const taskStatus = (task.status || "").replace(/-/g, "_");

    if (activeTaskFilter === "completed") {
      matchesStatus = taskStatus === "completed";
    } else if (activeTaskFilter === "in-progress" || activeTaskFilter === "in_progress") {
      matchesStatus = taskStatus === "in_progress";
    } else if (activeTaskFilter === "not-started" || activeTaskFilter === "not_started") {
      matchesStatus = taskStatus === "not_started";
    }

    // Search Query Matching across title, description, skills
    let matchesSearch = true;
    if (taskSearchQuery.trim() !== "") {
      const q = taskSearchQuery.toLowerCase();
      const titleMatch = (task.title || "").toLowerCase().includes(q);
      const descMatch = (task.description || "").toLowerCase().includes(q);
      const stageMatch = (task.stage || "").toLowerCase().includes(q);
      const skillsMatch = Array.isArray(task.skills) && task.skills.some(s => s.toLowerCase().includes(q));
      matchesSearch = titleMatch || descMatch || stageMatch || skillsMatch;
    }

    return matchesStatus && matchesSearch;
  });
}

function updateFilterButtonStates() {
  const filterButtons = document.querySelectorAll("[data-task-filter]");
  const counts = {
    all: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress" || t.status === "in-progress").length,
    notStarted: tasks.filter(t => t.status === "not_started" || t.status === "not-started").length
  };

  filterButtons.forEach(btn => {
    const filter = btn.getAttribute("data-task-filter");
    const isCurrent = filter === activeTaskFilter;
    btn.classList.toggle("active", isCurrent);
    btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");

    if (filter === "all") btn.textContent = `All (${counts.all})`;
    if (filter === "completed") btn.textContent = `Completed (${counts.completed})`;
    if (filter === "in-progress") btn.textContent = `In Progress (${counts.inProgress})`;
    if (filter === "not-started") btn.textContent = `Not Started (${counts.notStarted})`;
  });

  const countPill = document.getElementById("task-results-count");
  if (countPill) {
    const filteredCount = getFilteredTasks().length;
    countPill.textContent = `${filteredCount} of ${tasks.length} Tasks`;
  }
}

// ==========================================================================
// 5. RENDERING TASK CARDS (SAFE DOM CREATION)
// ==========================================================================

function renderTasks() {
  const container = document.getElementById("tasks-container");
  const emptyState = document.getElementById("tasks-empty-state");
  if (!container) return;

  const filtered = getFilteredTasks();
  updateFilterButtonStates();

  if (filtered.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  container.style.display = "grid";
  container.innerHTML = filtered.map(task => renderTaskCard(task)).join("");

  // Attach card event listeners
  filtered.forEach(task => {
    const viewBtn = document.getElementById(`btn-view-task-${task.id}`);
    if (viewBtn) {
      viewBtn.addEventListener("click", () => openTaskModal(task.id, viewBtn));
    }

    const completeBtn = document.getElementById(`btn-complete-task-${task.id}`);
    if (completeBtn) {
      completeBtn.addEventListener("click", () => updateTaskStatus(task.id, "completed", completeBtn));
    }
  });
}

function renderTaskCard(task) {
  const taskStatus = (task.status || "not_started").replace(/-/g, "_");
  const isCompleted = taskStatus === "completed";
  const isInProgress = taskStatus === "in_progress";
  const metrics = getProgressMetrics();
  const isCurrent = metrics.currentTask && metrics.currentTask.id === task.id;

  let badgeMarkup = "";
  if (isCompleted) {
    badgeMarkup = `
      <span class="task-status-badge badge-completed">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Completed</span>
      </span>
    `;
  } else if (isInProgress) {
    badgeMarkup = `
      <span class="task-status-badge badge-in-progress">
        <span class="status-pulse-dot" aria-hidden="true"></span>
        <span>In Progress</span>
      </span>
    `;
  } else {
    badgeMarkup = `
      <span class="task-status-badge badge-not-started">
        <span class="status-empty-dot" aria-hidden="true"></span>
        <span>Not Started</span>
      </span>
    `;
  }

  // Safe string escaping
  const safeTitle = escapeHtml(task.title || `Task ${task.id}`);
  const safeDesc = escapeHtml(task.description || "");
  const safeStage = escapeHtml(task.stage || "Stage 01 • Foundation");
  const safeDay = escapeHtml(task.day || `Day ${task.id * 3}`);

  const cardClasses = [
    "dashboard-task-card",
    isCompleted ? "status-completed" : "",
    isCurrent ? "is-current-task" : ""
  ].filter(Boolean).join(" ");

  return `
    <article class="${cardClasses}" id="task-card-${task.id}" data-task-id="${task.id}">
      <div class="task-card-header">
        <div class="task-badge-row">
          <span class="task-num-tag">Task 0${task.id}</span>
          <span class="task-day-tag">${safeDay}</span>
          ${isCurrent ? `<span class="current-task-pill">CURRENT TASK</span>` : ""}
        </div>
        ${badgeMarkup}
      </div>

      <h3 class="task-card-heading">${safeTitle}</h3>
      <p class="task-card-summary">${safeDesc}</p>

      <div class="task-meta-footer">
        <span class="task-stage-indicator">${safeStage}</span>
        ${task.relatedUrl ? `
          <a href="${task.relatedUrl}" class="task-related-link">
            <span>${escapeHtml(task.urlLabel || "View Page")}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        ` : `<span></span>`}
      </div>

      <div class="task-card-actions">
        <button type="button" class="btn-view-task-details" id="btn-view-task-${task.id}" aria-label="View Task ${task.id} details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>View Task</span>
        </button>

        ${isCompleted ? `
          <button type="button" class="btn-task-action btn-completed-check" disabled aria-label="Task ${task.id} is already completed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Done</span>
          </button>
        ` : `
          <button type="button" class="btn-task-action btn-mark-complete" id="btn-complete-task-${task.id}" aria-label="Mark Task ${task.id} as completed">
            <span>Mark Complete</span>
          </button>
        `}
      </div>
    </article>
  `;
}

// ==========================================================================
// 6. ACCESSIBLE MODALS (VIEW TASK VIA API & API DOCS)
// ==========================================================================

/**
 * Opens task modal by fetching fresh data from GET /api/tasks/:id
 */
async function openTaskModal(taskId, triggerBtn = null) {
  focusedTriggerElement = triggerBtn;
  const modal = document.getElementById("task-details-modal");
  if (!modal) return;

  const numEl = document.getElementById("modal-task-number");
  const dayEl = document.getElementById("modal-task-day");
  const statusEl = document.getElementById("modal-task-status");
  const titleEl = document.getElementById("modal-task-title");
  const descEl = document.getElementById("modal-task-desc");
  const stageEl = document.getElementById("modal-task-stage");
  const milestoneEl = document.getElementById("modal-task-milestone");
  const deliverableEl = document.getElementById("modal-task-deliverable");
  const skillsListEl = document.getElementById("modal-task-skills");
  const actionContainer = document.getElementById("modal-action-buttons");

  // Show placeholder while fetching from GET /api/tasks/:id
  if (numEl) numEl.textContent = `Task 0${taskId}`;
  if (titleEl) titleEl.textContent = "Loading task details from API...";
  if (descEl) descEl.textContent = "Fetching live record from GET /api/tasks/" + taskId;
  if (statusEl) statusEl.innerHTML = `<span class="loading-spinner" style="width: 12px; height: 12px; border-width: 2px;"></span> Loading...`;
  if (actionContainer) actionContainer.innerHTML = `<button type="button" class="btn btn-secondary" onclick="closeTaskModal()">Close</button>`;

  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  try {
    const task = await fetchTaskById(taskId);
    const taskStatus = (task.status || "not_started").replace(/-/g, "_");
    const isCompleted = taskStatus === "completed";
    const isInProgress = taskStatus === "in_progress";

    if (numEl) numEl.textContent = `Task 0${task.id}`;
    if (dayEl) dayEl.textContent = task.day || `Day ${task.id * 3}`;
    if (titleEl) titleEl.textContent = task.title;
    if (descEl) descEl.textContent = task.description;
    if (stageEl) stageEl.textContent = task.stage || "Stage 01 • Foundation";
    if (milestoneEl) milestoneEl.textContent = task.milestone || "Curriculum Milestone";
    if (deliverableEl) deliverableEl.textContent = task.deliverable || "Specified task deliverable.";

    // Render Status Badge
    if (statusEl) {
      if (isCompleted) {
        statusEl.className = "task-status-badge badge-completed";
        statusEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Completed`;
      } else if (isInProgress) {
        statusEl.className = "task-status-badge badge-in-progress";
        statusEl.innerHTML = `<span class="status-pulse-dot"></span> In Progress`;
      } else {
        statusEl.className = "task-status-badge badge-not-started";
        statusEl.innerHTML = `<span class="status-empty-dot"></span> Not Started`;
      }
    }

    // Render Skills Chips
    if (skillsListEl) {
      const skills = Array.isArray(task.skills) ? task.skills : ["HTML5", "CSS3", "JavaScript", "REST API"];
      skillsListEl.innerHTML = skills.map(skill => `
        <span class="tag-chip tag-skill">${escapeHtml(skill)}</span>
      `).join("");
    }

    // Modal Action Buttons
    if (actionContainer) {
      if (isCompleted) {
        actionContainer.innerHTML = `
          <button type="button" class="btn btn-secondary" onclick="closeTaskModal()">Close Details</button>
          ${task.relatedUrl ? `<a href="${task.relatedUrl}" class="btn btn-primary">Open Related Page</a>` : ""}
        `;
      } else {
        actionContainer.innerHTML = `
          <button type="button" class="btn btn-secondary" onclick="closeTaskModal()">Cancel</button>
          <button type="button" class="btn btn-primary" id="modal-mark-complete-btn">
            Mark as Completed ✓
          </button>
        `;
        const modalCompleteBtn = document.getElementById("modal-mark-complete-btn");
        if (modalCompleteBtn) {
          modalCompleteBtn.addEventListener("click", async () => {
            await updateTaskStatus(task.id, "completed", modalCompleteBtn);
            closeTaskModal();
          });
        }
      }
    }
  } catch (error) {
    if (titleEl) titleEl.textContent = "Error Loading Task";
    if (descEl) descEl.textContent = `Could not load task details from server: ${error.message}`;
  }

  // Focus close button for accessibility
  const closeBtn = document.getElementById("modal-close-button");
  if (closeBtn) {
    setTimeout(() => closeBtn.focus(), 50);
  }
}

function closeTaskModal() {
  const modal = document.getElementById("task-details-modal");
  if (!modal) return;

  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (focusedTriggerElement && typeof focusedTriggerElement.focus === "function") {
    focusedTriggerElement.focus();
    focusedTriggerElement = null;
  }
}

// API Docs Modal Open / Close
function openApiDocsModal() {
  const modal = document.getElementById("api-docs-modal");
  if (!modal) return;
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeBtn = document.getElementById("api-docs-close-btn");
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeApiDocsModal() {
  const modal = document.getElementById("api-docs-modal");
  if (!modal) return;
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// Live Cloud Backend (Render / Railway) Configuration Modal
function openBackendConfigModal() {
  const modal = document.getElementById("backend-config-modal");
  const input = document.getElementById("custom-api-input");
  const feedback = document.getElementById("api-test-feedback");
  if (!modal) return;

  if (input) {
    const savedApi = localStorage.getItem(CUSTOM_API_STORAGE_KEY) || (API_BASE_URL !== window.location.origin ? API_BASE_URL : "");
    input.value = savedApi;
  }
  if (feedback) feedback.style.display = "none";

  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (input) setTimeout(() => input.focus(), 50);
}

function closeBackendConfigModal() {
  const modal = document.getElementById("backend-config-modal");
  if (!modal) return;
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function testAndConnectBackendApi(rawUrl) {
  const feedback = document.getElementById("api-test-feedback");
  const saveBtn = document.getElementById("btn-save-api-url");
  const url = (rawUrl || "").trim().replace(/\/$/, "");

  if (!url || !url.startsWith("http")) {
    if (feedback) {
      feedback.style.display = "block";
      feedback.style.background = "rgba(239, 68, 68, 0.12)";
      feedback.style.color = "#DC2626";
      feedback.textContent = "Please enter a valid HTTP or HTTPS URL (e.g. https://my-task-api.onrender.com)";
    }
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Testing Connection...";
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${url}/api/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      API_BASE_URL = url;
      localStorage.setItem(CUSTOM_API_STORAGE_KEY, url);

      if (feedback) {
        feedback.style.display = "block";
        feedback.style.background = "rgba(34, 197, 94, 0.15)";
        feedback.style.color = "#16A34A";
        feedback.textContent = `✓ Successfully connected to live backend! Server reports: ${data.status || "healthy"}`;
      }

      showToast(`Connected to live cloud backend at ${url} ✓`, "success");
      setTimeout(() => {
        closeBackendConfigModal();
        checkBackendStatus();
        fetchTasks();
      }, 1000);
    } else {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
  } catch (err) {
    if (feedback) {
      feedback.style.display = "block";
      feedback.style.background = "rgba(239, 68, 68, 0.12)";
      feedback.style.color = "#DC2626";
      feedback.textContent = `Could not reach ${url}/api/health: ${err.message}. Make sure your Render service is deployed and running.`;
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Test & Connect";
    }
  }
}

function resetBackendApiUrl() {
  localStorage.removeItem(CUSTOM_API_STORAGE_KEY);
  API_BASE_URL = window.location.origin;
  showToast("Custom API URL reset. Reverted to standard origin.", "info");
  closeBackendConfigModal();
  checkBackendStatus();
  fetchTasks();
}

// Make accessible to inline onclicks
window.closeTaskModal = closeTaskModal;
window.closeApiDocsModal = closeApiDocsModal;
window.openBackendConfigModal = openBackendConfigModal;
window.closeBackendConfigModal = closeBackendConfigModal;

// ==========================================================================
// 7. TOAST NOTIFICATIONS
// ==========================================================================

let toastTimeout = null;

function showToast(message, type = "success") {
  const toast = document.getElementById("dashboard-toast");
  const toastText = document.getElementById("toast-message-text");
  const toastIcon = document.getElementById("toast-icon");

  if (!toast || !toastText) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastText.textContent = message;

  if (toastIcon) {
    if (type === "success") {
      toastIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      toast.className = "dashboard-toast toast-success is-active";
    } else if (type === "error") {
      toastIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      toast.className = "dashboard-toast toast-error is-active";
    } else {
      toastIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      toast.className = "dashboard-toast toast-info is-active";
    }
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-active");
  }, 4000);
}

// ==========================================================================
// 8. THEME MANAGEMENT (DARK / LIGHT MODE)
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    // Ignore storage restrictions
  }

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  // Sidebar toggle button
  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", label);
    themeToggle.innerHTML = isDark
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span>Light Mode</span>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span>Dark Mode</span>`;
  }

  // Mobile Topbar toggle button
  const topbarThemeToggle = document.getElementById("topbar-theme-toggle");
  if (topbarThemeToggle) {
    topbarThemeToggle.setAttribute("aria-label", label);
    topbarThemeToggle.innerHTML = isDark
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const target = current === "dark" ? "light" : "dark";
  setTheme(target);
  showToast(`Switched to ${target} mode`, "info");
}

// ==========================================================================
// 9. TECHNOLOGY EXPLORER (PRESERVED FROM TASK 6)
// ==========================================================================

function renderTechnology(techKey) {
  const data = technologyData[techKey];
  if (!data) return;

  activeTechnology = techKey;

  const tabs = document.querySelectorAll("[data-tech-tab]");
  tabs.forEach(tab => {
    const isCurrent = tab.getAttribute("data-tech-tab") === techKey;
    tab.classList.toggle("active", isCurrent);
    tab.setAttribute("aria-selected", isCurrent ? "true" : "false");
  });

  const nameEl = document.getElementById("tech-detail-name");
  const categoryEl = document.getElementById("tech-detail-category");
  const taglineEl = document.getElementById("tech-detail-tagline");
  const overviewEl = document.getElementById("tech-detail-overview");
  const capabilitiesEl = document.getElementById("tech-detail-capabilities");
  const useCasesEl = document.getElementById("tech-detail-usecases");
  const noteEl = document.getElementById("tech-detail-note");

  if (nameEl) nameEl.textContent = data.name;
  if (categoryEl) categoryEl.textContent = data.category;
  if (taglineEl) taglineEl.textContent = data.tagline;
  if (overviewEl) overviewEl.textContent = data.overview;
  if (noteEl) noteEl.textContent = data.note;

  if (capabilitiesEl) {
    capabilitiesEl.innerHTML = data.coreCapabilities.map(cap => `
      <div class="tech-cap-item">
        <h4 class="tech-cap-title">${escapeHtml(cap.title)}</h4>
        <p class="tech-cap-desc">${escapeHtml(cap.desc)}</p>
      </div>
    `).join("");
  }

  if (useCasesEl) {
    useCasesEl.innerHTML = data.useCases.map(use => `
      <li class="tech-use-case-item">${escapeHtml(use)}</li>
    `).join("");
  }
}

// ==========================================================================
// 10. SCROLLSPY & NAVIGATION HELPERS
// ==========================================================================

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".sidebar-nav-link[href^='#']");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-20% 0px -70% 0px"
  });

  sections.forEach(sec => observer.observe(sec));
}

function scrollToCurrentTask() {
  const metrics = getProgressMetrics();
  if (!metrics.currentTask) return;

  // Make sure filter does not hide current task
  const taskStatus = (metrics.currentTask.status || "not_started").replace(/-/g, "_");
  if (activeTaskFilter !== "all" && activeTaskFilter !== taskStatus) {
    activeTaskFilter = "all";
    updateFilterButtonStates();
    renderTasks();
  }

  const card = document.getElementById(`task-card-${metrics.currentTask.id}`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.remove("highlight-pulse");
    void card.offsetWidth;
    card.classList.add("highlight-pulse");
    setTimeout(() => card.classList.remove("highlight-pulse"), 1800);
  }
}

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================================================
// 11. INITIALIZATION & EVENT LISTENERS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Initial Health Check & Task Fetch from Express API
  checkBackendStatus();
  fetchTasks();

  // 3. Render Technology Explorer Default
  renderTechnology("nextjs");

  // 4. Initialize Sidebar ScrollSpy
  initScrollSpy();

  // 5. Backend Status Refresh Button
  const retryBackendBtn = document.getElementById("btn-retry-backend");
  if (retryBackendBtn) {
    retryBackendBtn.addEventListener("click", () => {
      checkBackendStatus();
      if (!tasks.length) fetchTasks();
    });
  }

  // 6. Tasks Error Retry Button
  const tasksRetryBtn = document.getElementById("tasks-retry-btn");
  if (tasksRetryBtn) {
    tasksRetryBtn.addEventListener("click", () => {
      checkBackendStatus();
      fetchTasks();
    });
  }

  // 7. Filter Buttons
  const filterButtons = document.querySelectorAll("[data-task-filter]");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeTaskFilter = btn.getAttribute("data-task-filter");
      updateFilterButtonStates();
      renderTasks();
    });
  });

  // 8. Search Input
  const searchInput = document.getElementById("task-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      taskSearchQuery = e.target.value;
      renderTasks();
    });
  }

  // 9. Clear Filters Button (in empty state)
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      activeTaskFilter = "all";
      taskSearchQuery = "";
      if (searchInput) searchInput.value = "";
      updateFilterButtonStates();
      renderTasks();
    });
  }

  // 10. Continue Task Button
  const continueTaskBtn = document.getElementById("continue-task-btn");
  if (continueTaskBtn) {
    continueTaskBtn.addEventListener("click", scrollToCurrentTask);
  }

  // 11. Reset Progress Button
  const resetBtn = document.getElementById("reset-progress-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetBackendTasks);
  }

  // 12. Tech Tabs
  const techTabs = document.querySelectorAll("[data-tech-tab]");
  techTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-tech-tab");
      renderTechnology(key);
    });
  });

  // 13. Theme Toggles
  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  const topbarThemeToggle = document.getElementById("topbar-theme-toggle");
  if (topbarThemeToggle) {
    topbarThemeToggle.addEventListener("click", toggleTheme);
  }

  // 14. Task Modal Close Events
  const modalCloseBtn = document.getElementById("modal-close-button");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeTaskModal);
  }

  const taskModal = document.getElementById("task-details-modal");
  if (taskModal) {
    taskModal.addEventListener("click", (e) => {
      if (e.target === taskModal) closeTaskModal();
    });
  }

  // 15. API Docs Modal Open & Close Events
  const sidebarApiDocsLink = document.getElementById("sidebar-api-docs-link");
  if (sidebarApiDocsLink) {
    sidebarApiDocsLink.addEventListener("click", (e) => {
      e.preventDefault();
      openApiDocsModal();
    });
  }

  const apiDocsCloseBtn = document.getElementById("api-docs-close-btn");
  if (apiDocsCloseBtn) {
    apiDocsCloseBtn.addEventListener("click", closeApiDocsModal);
  }

  const apiDocsCloseBottom = document.getElementById("api-docs-close-btn-bottom");
  if (apiDocsCloseBottom) {
    apiDocsCloseBottom.addEventListener("click", closeApiDocsModal);
  }

  const apiDocsModal = document.getElementById("api-docs-modal");
  if (apiDocsModal) {
    apiDocsModal.addEventListener("click", (e) => {
      if (e.target === apiDocsModal) closeApiDocsModal();
    });
  }

  // 15b. Live Cloud Backend (Render) Configuration Modal Events
  const openConnectBtn = document.getElementById("btn-open-connect-modal");
  if (openConnectBtn) {
    openConnectBtn.addEventListener("click", openBackendConfigModal);
  }

  const backendStatusBadge = document.getElementById("backend-status-badge");
  if (backendStatusBadge) {
    backendStatusBadge.style.cursor = "pointer";
    backendStatusBadge.setAttribute("title", "Click to configure live backend API URL");
    backendStatusBadge.addEventListener("click", (e) => {
      // Don't trigger if user specifically clicked the refresh spinner button
      if (e.target.closest("#btn-retry-backend")) return;
      openBackendConfigModal();
    });
  }

  const mobileBackendStatusBadge = document.getElementById("mobile-backend-status-badge");
  if (mobileBackendStatusBadge) {
    mobileBackendStatusBadge.style.cursor = "pointer";
    mobileBackendStatusBadge.setAttribute("title", "Click to configure live backend API URL");
    mobileBackendStatusBadge.addEventListener("click", openBackendConfigModal);
  }

  const backendConfigCloseBtn = document.getElementById("backend-config-close-btn");
  if (backendConfigCloseBtn) {
    backendConfigCloseBtn.addEventListener("click", closeBackendConfigModal);
  }

  const backendConfigCancelBtn = document.getElementById("backend-config-cancel-btn");
  if (backendConfigCancelBtn) {
    backendConfigCancelBtn.addEventListener("click", closeBackendConfigModal);
  }

  const btnSaveApiUrl = document.getElementById("btn-save-api-url");
  if (btnSaveApiUrl) {
    btnSaveApiUrl.addEventListener("click", () => {
      const input = document.getElementById("custom-api-input");
      if (input) testAndConnectBackendApi(input.value);
    });
  }

  const customApiInput = document.getElementById("custom-api-input");
  if (customApiInput) {
    customApiInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        testAndConnectBackendApi(customApiInput.value);
      }
    });
  }

  const btnResetApiUrl = document.getElementById("btn-reset-api-url");
  if (btnResetApiUrl) {
    btnResetApiUrl.addEventListener("click", resetBackendApiUrl);
  }

  const backendConfigModal = document.getElementById("backend-config-modal");
  if (backendConfigModal) {
    backendConfigModal.addEventListener("click", (e) => {
      if (e.target === backendConfigModal) closeBackendConfigModal();
    });
  }

  // 16. Keyboard Escape Key Support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTaskModal();
      closeApiDocsModal();
      closeMobileSidebar();
    }
  });

  // 17. Mobile Sidebar Drawer Logic
  const sidebarToggle = document.getElementById("dashboard-sidebar-toggle");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const sidebar = document.getElementById("dashboard-sidebar");
  const sidebarBackdrop = document.getElementById("dashboard-sidebar-backdrop");

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("is-visible");
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
  }

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add("mobile-open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("is-visible");
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "true");
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const isOpen = sidebar && sidebar.classList.contains("mobile-open");
      if (isOpen) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeMobileSidebar);
  }

  // Close mobile sidebar on link click
  const sidebarLinks = document.querySelectorAll(".sidebar-nav-link");
  sidebarLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobileSidebar();
    });
  });
});
