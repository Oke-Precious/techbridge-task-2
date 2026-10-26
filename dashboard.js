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
const API_BASE_URL = window.location.origin;
const THEME_STORAGE_KEY = "techbridgeDashboardTheme";

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
// 2. BACKEND API SERVICE (FETCH API WRAPPERS)
// ==========================================================================

/**
 * Checks backend health via GET /api/health
 */
async function checkBackendStatus() {
  const dot = document.getElementById("backend-status-dot");
  const text = document.getElementById("backend-status-text");
  const mobileDot = document.getElementById("mobile-backend-status-dot");
  const mobileText = document.getElementById("mobile-backend-status-text");
  const retryBtn = document.getElementById("btn-retry-backend");

  if (retryBtn) retryBtn.classList.add("is-refreshing");

  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (response.ok) {
      const data = await response.json();
      isBackendConnected = true;
      updateBackendUI(true, "Backend Status: Connected");
      console.log("[Backend Health Check]: Connected", data);
    } else {
      isBackendConnected = false;
      updateBackendUI(false, "Backend Status: Offline");
    }
  } catch (error) {
    isBackendConnected = false;
    updateBackendUI(false, "Backend Status: Offline");
    console.warn("[Backend Health Check]: Offline/Unreachable", error.message);
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
    mobileText.textContent = connected ? "API Online" : "API Offline";
  }
}

/**
 * Retrieves all tasks from the backend via GET /api/tasks
 */
async function fetchTasks() {
  if (isFetchingTasks) return;
  isFetchingTasks = true;

  const loadingEl = document.getElementById("tasks-loading-state");
  const errorEl = document.getElementById("tasks-error-state");
  const containerEl = document.getElementById("tasks-container");
  const emptyEl = document.getElementById("tasks-empty-state");

  // Show loading indicator, hide error and cards
  if (loadingEl) loadingEl.style.display = "flex";
  if (errorEl) errorEl.style.display = "none";
  if (containerEl) containerEl.style.display = "none";
  if (emptyEl) emptyEl.style.display = "none";

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result || !result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid API response format received from /api/tasks");
    }

    // Set tasks data from server
    tasks = result.data;
    isBackendConnected = true;
    updateBackendUI(true, "Backend Status: Connected");

    // Hide loading, show container
    if (loadingEl) loadingEl.style.display = "none";
    if (containerEl) containerEl.style.display = "grid";

    // Re-render UI
    renderTasks();
    updateDashboardStats();
    updateProgress();

    console.log(`[API Integration]: Successfully loaded ${tasks.length} tasks from GET /api/tasks`);
  } catch (error) {
    console.error("[API Error fetching tasks]:", error);
    isBackendConnected = false;
    updateBackendUI(false, "Backend Status: Offline");

    // Show error state with user-friendly guidance
    if (loadingEl) loadingEl.style.display = "none";
    if (errorEl) {
      errorEl.style.display = "flex";
      const errorMsg = document.getElementById("tasks-error-message");
      if (errorMsg) {
        errorMsg.textContent = error.message.includes("Failed to fetch") || error.message.includes("NetworkError")
          ? "Unable to connect to the Node.js backend. Please verify the Express server is running on port 3000."
          : `Error loading tasks: ${error.message}. Please retry.`;
      }
    }
    showToast("Unable to reach backend API. Check server connection.", "error");
  } finally {
    isFetchingTasks = false;
  }
}

/**
 * Fetches single task details from GET /api/tasks/:id
 */
async function fetchTaskById(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Task with ID ${taskId} not found (HTTP ${response.status})`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`[API Error fetching task ${taskId}]:`, error);
    throw error;
  }
}

/**
 * Updates a task status via PUT /api/tasks/:id
 */
async function updateTaskStatus(taskId, newStatus, buttonElement = null) {
  const originalButtonContent = buttonElement ? buttonElement.innerHTML : null;

  if (buttonElement) {
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<span class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> <span>Saving...</span>`;
  }

  try {
    // Normalizing status to accepted format
    const validStatus = newStatus.replace(/-/g, "_");

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ status: validStatus })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status} failed to update task`);
    }

    const result = await response.json();
    const updatedTask = result.data;

    // Update local task state from server response
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
    }

    // Refresh UI components
    renderTasks();
    updateDashboardStats();
    updateProgress();

    showToast(`Task ${taskId} marked as completed ✓`, "success");
    console.log(`[API Task Updated]: Task ${taskId} is now ${validStatus}`);
    return updatedTask;
  } catch (error) {
    console.error(`[API Error updating task ${taskId}]:`, error);
    showToast(`Failed to update task: ${error.message}`, "error");

    if (buttonElement && originalButtonContent) {
      buttonElement.disabled = false;
      buttonElement.innerHTML = originalButtonContent;
    }
    throw error;
  }
}

/**
 * Resets tasks on backend via POST /api/tasks/reset
 */
async function resetBackendTasks() {
  const confirmed = window.confirm(
    "Reset internship progress? This will reset tasks in backend/data/tasks.json to initial Task 7 state."
  );
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/reset`, {
      method: "POST",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    await fetchTasks();
    showToast("Internship tasks reset to default state ✓", "info");
  } catch (error) {
    console.error("[API Error resetting tasks]:", error);
    showToast(`Reset failed: ${error.message}`, "error");
  }
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

// Make accessible to inline onclicks
window.closeTaskModal = closeTaskModal;
window.closeApiDocsModal = closeApiDocsModal;

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
