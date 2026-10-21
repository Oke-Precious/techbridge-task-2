/**
 * TechBridge Intern Dashboard — Task 6
 * Vanilla JavaScript (HTML5 + CSS3 + ES6+)
 * 
 * Features:
 * - Dynamic task progress tracking & KPI calculations
 * - Interactive task completion & automatic current-task progression
 * - LocalStorage persistence with reset progress capability
 * - Combined status filtering & real-time search
 * - Accessible single-instance task details modal
 * - Interactive Modern Web Technologies Explorer (Next.js, Vue.js, Angular, Backend)
 * - Seamless integration with Challenge Hub (Task 5) and public pages (Tasks 1-4)
 * - Toast feedback & all-tasks celebration state
 * - Optional Dark / Light theme toggle stored in LocalStorage
 */

// ==========================================================================
// 1. SAMPLE INTERN PROFILE DATA
// ==========================================================================
// SAMPLE INTERN DATA — replace when real user/profile functionality is introduced.
const internProfile = {
  name: "Alex",
  track: "Web Development",
  status: "In Progress",
  cohort: "2026 Batch A",
  startDate: "Day 1",
  avatarInitials: "AL"
};

// ==========================================================================
// 2. OFFICIAL INTERNSHIP TASK DATA (SOURCE OF TRUTH FROM TASKS 3 & 4)
// ==========================================================================
const initialTasks = [
  {
    id: 1,
    number: 1,
    title: "Build the TechBridge Homepage",
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    day: "Day 1",
    stage: "Stage 01 • Foundation",
    milestone: "Foundation Milestone",
    status: "completed",
    relatedUrl: "index.html",
    urlLabel: "View Live Homepage",
    skills: ["Semantic HTML5", "CSS3 Layouts", "Brand Styling", "Mobile Responsiveness"],
    deliverable: "Complete responsive homepage with navigation, hero section, and curriculum previews."
  },
  {
    id: 2,
    number: 2,
    title: "Build the TechBridge Programs Experience",
    description: "Create a Programs experience that presents TechBridge's available learning programs.",
    day: "Day 4",
    stage: "Stage 01 • Foundation",
    milestone: "Curriculum Presentation",
    status: "completed",
    relatedUrl: "programs.html",
    urlLabel: "View Programs Experience",
    skills: ["Curriculum Architecture", "Card Component Systems", "Dual-Track Layouts", "CSS Interactions"],
    deliverable: "Dedicated programs page showcasing Web Development and Data Analytics learning tracks."
  },
  {
    id: 3,
    number: 3,
    title: "Build the Internship Tasks Experience",
    description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
    day: "Day 8",
    stage: "Stage 02 • Progression",
    milestone: "Roadmap Architecture",
    status: "completed",
    relatedUrl: "internship-tasks.html",
    urlLabel: "View Tasks Roadmap",
    skills: ["Timeline Visualization", "Phase Modeling", "Process Architecture", "Content Hierarchy"],
    deliverable: "Visual 30-day chronological timeline displaying the full 8-milestone trajectory."
  },
  {
    id: 4,
    number: 4,
    title: "Build an Interactive Task Tracker",
    description: "Use JavaScript to make the internship task experience interactive and allow progress to be tracked.",
    day: "Day 11",
    stage: "Stage 02 • Progression",
    milestone: "Dynamic State",
    status: "in-progress",
    relatedUrl: "internship-tasks.html",
    urlLabel: "View Roadmap",
    skills: ["DOM Manipulation", "Event Handling", "State Management", "Data Filtering"],
    deliverable: "Dynamic client-side interactivity enabling seamless filtering and status updates."
  },
  {
    id: 5,
    number: 5,
    title: "Build the Intern Registration Experience",
    description: "Create a professional registration/onboarding interface for TechBridge interns.",
    day: "Day 15",
    stage: "Stage 03 • Application & Submission",
    milestone: "Onboarding & Workflow",
    status: "not-started",
    relatedUrl: "challenges.html",
    urlLabel: "Explore Challenge Hub",
    skills: ["Form Validation", "UX Micro-interactions", "Accessible Inputs", "Client Validation"],
    deliverable: "User registration workflow with validation feedback and onboarding steps."
  },
  {
    id: 6,
    number: 6,
    title: "Build the Task Submission System",
    description: "Create an interface through which interns can prepare and submit their task work.",
    day: "Day 19",
    stage: "Stage 03 • Application & Submission",
    milestone: "Submission Engine",
    status: "not-started",
    relatedUrl: "",
    urlLabel: "",
    skills: ["Submission Handling", "File/Link Formatting", "Submission History", "UI Confirmation"],
    deliverable: "Project submission interface allowing interns to submit GitHub and live site links."
  },
  {
    id: 7,
    number: 7,
    title: "Build the Intern Dashboard",
    description: "Create a dashboard where an intern can view their profile, progress, tasks, and submissions.",
    day: "Day 22",
    stage: "Stage 04 • Platform Integration",
    milestone: "Platform Integration",
    status: "not-started",
    relatedUrl: "dashboard.html",
    urlLabel: "Current Dashboard",
    skills: ["SaaS Architecture", "Component Modeling", "LocalStorage Storage", "Performance Optimization"],
    deliverable: "Comprehensive dashboard unifying progress, tasks, stats, and technology insights."
  },
  {
    id: 8,
    number: 8,
    title: "Build the Complete TechBridge Internship Platform",
    description: "Combine the different components created during the internship into a complete TechBridge platform.",
    day: "Day 26",
    stage: "Stage 04 • Platform Integration",
    milestone: "Platform Finale",
    status: "not-started",
    relatedUrl: "index.html",
    urlLabel: "TechBridge Home",
    skills: ["System Integration", "Cross-Page Navigation", "Production Polish", "Deployment Readiness"],
    deliverable: "Unified multi-page platform integrating homepage, programs, tasks, challenges, and dashboard."
  }
];

// ==========================================================================
// 3. MODERN WEB TECHNOLOGIES DATA (EDUCATIONAL EXPLORER)
// ==========================================================================
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
        desc: "Organizes routes automatically through directory structure (e.g., app router or pages router) without complex router configurations."
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
    note: "Educational information only. Task 6 is built using HTML5, CSS3, and Vanilla JavaScript."
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
    note: "Educational information only. Task 6 is built using HTML5, CSS3, and Vanilla JavaScript."
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
    note: "Educational information only. Task 6 is built using HTML5, CSS3, and Vanilla JavaScript."
  },

  backend: {
    name: "Backend Development",
    category: "Server-Side Architecture & APIs",
    tagline: "The engine that powers data storage, authentication, business logic, and APIs.",
    badge: "Server & Database",
    overview: "Backend development powers the server-side logic behind modern web applications. It handles database communication, authentication, security, business workflows, and API endpoints consumed by client-side frontend applications.",
    coreCapabilities: [
      {
        title: "Node.js (JavaScript Runtime)",
        desc: "An event-driven, non-blocking asynchronous JavaScript runtime allowing developers to build fast, scalable network applications using JavaScript on both client and server."
      },
      {
        title: "Express.js (Node Framework)",
        desc: "A minimalist, highly flexible web framework for Node.js providing robust routing, middleware pipelines, and RESTful API generation."
      },
      {
        title: "Django (Python Framework)",
        desc: "A high-level Python web framework that encourages rapid development and clean design, featuring an 'out-of-the-box' ORM, admin panel, and robust security safeguards."
      },
      {
        title: "Supporting Frameworks",
        desc: "Other prominent technologies include Flask (lightweight Python), Laravel (structured PHP), and .NET Core (high-performance C# enterprise services)."
      }
    ],
    useCases: [
      "RESTful and GraphQL APIs serving web and mobile client applications.",
      "Authentication systems with JWT tokens, OAuth, and session management.",
      "Database integration with relational (PostgreSQL, MySQL) and document (MongoDB) databases."
    ],
    note: "Educational information only. A backend is not required for this assignment."
  }
};

// ==========================================================================
// 4. APPLICATION STATE & STORAGE
// ==========================================================================
const STORAGE_KEY = "techbridgeDashboardProgress";
const THEME_STORAGE_KEY = "techbridgeDashboardTheme";

let tasks = [];
let activeTaskFilter = "all";
let taskSearchQuery = "";
let activeTechnology = "nextjs";
let focusedTriggerElement = null;

// ==========================================================================
// 5. LOCAL STORAGE MANAGEMENT
// ==========================================================================

/**
 * Loads tasks from LocalStorage or falls back to official sample tasks
 */
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === initialTasks.length) {
        // Merge saved statuses with fresh initial task definitions
        tasks = initialTasks.map(t => {
          const match = parsed.find(p => p.id === t.id);
          return match ? { ...t, status: match.status } : { ...t };
        });
        return;
      }
    }
  } catch (err) {
    console.warn("Could not read tasks from LocalStorage, using initial state:", err);
  }
  // Default sample state: Tasks 1-3 completed, Task 4 in-progress, Tasks 5-8 not-started
  tasks = JSON.parse(JSON.stringify(initialTasks));
}

/**
 * Saves task status progress safely into LocalStorage
 */
function saveTasks() {
  try {
    const toSave = tasks.map(t => ({ id: t.id, status: t.status }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn("Could not save tasks to LocalStorage:", err);
  }
}

/**
 * Restores the sample/default progress state after confirmation
 */
function resetProgress() {
  const confirmed = window.confirm(
    "Are you sure you want to reset your dashboard progress? This will restore the default sample milestones (Tasks 1–3 completed, Task 4 in-progress)."
  );

  if (!confirmed) return;

  tasks = JSON.parse(JSON.stringify(initialTasks));
  saveTasks();
  activeTaskFilter = "all";
  taskSearchQuery = "";

  const searchInput = document.getElementById("task-search-input");
  if (searchInput) searchInput.value = "";

  updateFilterButtonStates();
  updateProgressUI();
  renderTasks();
  showToast("Dashboard progress reset to default sample state.", "info");
}

// ==========================================================================
// 6. PROGRESS CALCULATIONS
// ==========================================================================

function getProgressMetrics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const remaining = total - completed;
  const rawPercentage = total > 0 ? (completed / total) * 100 : 0;
  
  // Format percentage: integer if whole number (e.g. 50%), otherwise 1 decimal place (e.g. 37.5%)
  const formattedPercentage = rawPercentage % 1 === 0 
    ? `${rawPercentage}%` 
    : `${rawPercentage.toFixed(1)}%`;

  const currentTask = tasks.find(t => t.status === "in-progress") || 
                      tasks.find(t => t.status === "not-started") || 
                      tasks[tasks.length - 1];

  return {
    total,
    completed,
    remaining,
    rawPercentage,
    formattedPercentage,
    currentTask
  };
}

/**
 * Updates all summary cards, progress bars, and header indicators
 */
function updateProgressUI() {
  const metrics = getProgressMetrics();

  // Summary Cards
  const totalEl = document.getElementById("stat-total-tasks");
  const completedEl = document.getElementById("stat-completed-tasks");
  const remainingEl = document.getElementById("stat-remaining-tasks");
  const progressPercentEl = document.getElementById("stat-progress-percent");
  const currentTaskNameEl = document.getElementById("stat-current-task-name");

  if (totalEl) totalEl.textContent = metrics.total;
  if (completedEl) completedEl.textContent = metrics.completed;
  if (remainingEl) remainingEl.textContent = metrics.remaining;
  if (progressPercentEl) progressPercentEl.textContent = metrics.formattedPercentage;
  if (currentTaskNameEl) {
    if (metrics.completed === metrics.total) {
      currentTaskNameEl.textContent = "All 8 Tasks Complete!";
    } else if (metrics.currentTask) {
      currentTaskNameEl.textContent = `Task ${metrics.currentTask.number}: ${metrics.currentTask.title}`;
    }
  }

  // Progress Bar
  const progressFill = document.getElementById("progress-bar-fill");
  const progressLabel = document.getElementById("progress-bar-label");
  const progressFraction = document.getElementById("progress-bar-fraction");
  
  if (progressFill) {
    progressFill.style.width = `${metrics.rawPercentage}%`;
    progressFill.setAttribute("aria-valuenow", metrics.rawPercentage);
  }
  if (progressLabel) progressLabel.textContent = metrics.formattedPercentage;
  if (progressFraction) {
    progressFraction.textContent = `${metrics.completed} of ${metrics.total} Tasks Completed`;
  }

  // Header Current Task Indicator
  const headerCurrentTaskEl = document.getElementById("header-current-task");
  if (headerCurrentTaskEl) {
    if (metrics.completed === metrics.total) {
      headerCurrentTaskEl.textContent = "All Tasks Completed";
    } else if (metrics.currentTask) {
      headerCurrentTaskEl.textContent = `Task ${metrics.currentTask.number} • Day ${metrics.currentTask.day.replace("Day ", "")}`;
    }
  }

  // 100% Celebration Banner
  const celebrationBanner = document.getElementById("all-completed-banner");
  if (celebrationBanner) {
    if (metrics.completed === metrics.total) {
      celebrationBanner.style.display = "flex";
    } else {
      celebrationBanner.style.display = "none";
    }
  }
}

// ==========================================================================
// 7. TASK STATUS PROGRESSION LOGIC
// ==========================================================================

/**
 * Marks a task as completed and automatically advances subsequent task to in-progress
 */
function markTaskComplete(taskId) {
  const targetIndex = tasks.findIndex(t => t.id === taskId);
  if (targetIndex === -1) return;

  const current = tasks[targetIndex];
  if (current.status === "completed") return;

  // Mark task as completed
  current.status = "completed";

  // Sensible progression: advance the first remaining non-completed task to "in-progress"
  const nextIncomplete = tasks.find(t => t.status !== "completed");
  if (nextIncomplete && nextIncomplete.status !== "in-progress") {
    // Ensure no other task is in-progress
    tasks.forEach(t => {
      if (t.status === "in-progress" && t.id !== nextIncomplete.id) {
        t.status = "not-started";
      }
    });
    nextIncomplete.status = "in-progress";
  }

  saveTasks();
  updateProgressUI();
  renderTasks();

  const metrics = getProgressMetrics();
  if (metrics.completed === metrics.total) {
    showToast("🎉 Congratulations! You have completed all 8 internship tasks!", "success");
  } else {
    showToast(`Task ${current.number} marked as completed ✓`, "success");
  }
}

// ==========================================================================
// 8. TASK RENDERING FUNCTIONS
// ==========================================================================

function getFilteredTasks() {
  const query = taskSearchQuery.trim().toLowerCase();

  return tasks.filter(task => {
    // Status Filter
    let matchesStatus = true;
    if (activeTaskFilter !== "all") {
      matchesStatus = task.status === activeTaskFilter;
    }

    // Search Query Filter
    let matchesSearch = true;
    if (query) {
      const inTitle = task.title.toLowerCase().includes(query);
      const inDesc = task.description.toLowerCase().includes(query);
      const inSkills = task.skills ? task.skills.some(s => s.toLowerCase().includes(query)) : false;
      const inDay = task.day.toLowerCase().includes(query);
      matchesSearch = inTitle || inDesc || inSkills || inDay;
    }

    return matchesStatus && matchesSearch;
  });
}

/**
 * Creates individual task card DOM element
 */
function createTaskCardElement(task) {
  const card = document.createElement("article");
  const isCurrent = task.status === "in-progress";
  const isCompleted = task.status === "completed";

  card.className = `dashboard-task-card status-${task.status} ${isCurrent ? "is-current-task" : ""}`;
  card.setAttribute("data-task-id", task.id);

  // Status Badge UI
  let statusBadgeHtml = "";
  if (isCompleted) {
    statusBadgeHtml = `
      <span class="task-status-badge badge-completed">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Completed</span>
      </span>
    `;
  } else if (isCurrent) {
    statusBadgeHtml = `
      <span class="task-status-badge badge-in-progress">
        <span class="status-pulse-dot" aria-hidden="true"></span>
        <span>In Progress</span>
      </span>
    `;
  } else {
    statusBadgeHtml = `
      <span class="task-status-badge badge-not-started">
        <span class="status-empty-dot" aria-hidden="true"></span>
        <span>Not Started</span>
      </span>
    `;
  }

  // Current Task Tag
  const currentTagHtml = isCurrent 
    ? `<span class="current-task-pill">CURRENT TASK</span>` 
    : "";

  // Action Buttons
  let completeBtnHtml = "";
  if (isCompleted) {
    completeBtnHtml = `
      <button type="button" class="btn-task-action btn-completed-check" disabled aria-label="Task ${task.number} is already completed">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Completed</span>
      </button>
    `;
  } else {
    completeBtnHtml = `
      <button type="button" class="btn-task-action btn-mark-complete" onclick="markTaskComplete(${task.id})" aria-label="Mark Task ${task.number} as completed">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Mark as Completed</span>
      </button>
    `;
  }

  // Related URL link if available
  const relatedLinkHtml = task.relatedUrl ? `
    <a href="${task.relatedUrl}" class="task-related-link" title="${task.urlLabel || 'Open related experience'}">
      <span>${task.urlLabel || 'Open Experience'}</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  ` : "";

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-badge-row">
        <span class="task-num-tag">Task 0${task.number}</span>
        <span class="task-day-tag">${escapeHtml(task.day)}</span>
        ${currentTagHtml}
      </div>
      ${statusBadgeHtml}
    </div>

    <h3 class="task-card-heading">${escapeHtml(task.title)}</h3>
    <p class="task-card-summary">${escapeHtml(task.description)}</p>

    <div class="task-meta-footer">
      <span class="task-stage-indicator">${escapeHtml(task.stage)}</span>
      ${relatedLinkHtml}
    </div>

    <div class="task-card-actions">
      <button type="button" class="btn-view-task-details" onclick="openTaskModal(${task.id}, this)">
        <span>View Task</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
      ${completeBtnHtml}
    </div>
  `;

  return card;
}

/**
 * Renders all filtered tasks to the DOM
 */
function renderTasks() {
  const container = document.getElementById("tasks-container");
  const emptyState = document.getElementById("tasks-empty-state");
  const countBadge = document.getElementById("task-results-count");

  if (!container) return;

  const filtered = getFilteredTasks();
  container.innerHTML = "";

  // Update dynamic count badge with proper singular/plural grammar
  if (countBadge) {
    if (activeTaskFilter === "all" && !taskSearchQuery) {
      countBadge.textContent = `${filtered.length} Tasks`;
    } else if (filtered.length === 1) {
      countBadge.textContent = "1 Task Found";
    } else {
      countBadge.textContent = `${filtered.length} Tasks Found`;
    }
  }

  // Handle empty state
  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  filtered.forEach(task => {
    container.appendChild(createTaskCardElement(task));
  });
}

function updateFilterButtonStates() {
  const buttons = document.querySelectorAll("[data-task-filter]");
  buttons.forEach(btn => {
    const filter = btn.getAttribute("data-task-filter");
    const isActive = filter === activeTaskFilter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

// ==========================================================================
// 9. TASK DETAILS MODAL (REUSABLE & ACCESSIBLE)
// ==========================================================================

function openTaskModal(taskId, triggerBtn) {
  const task = tasks.find(t => t.id === taskId);
  const modal = document.getElementById("task-details-modal");
  if (!task || !modal) return;

  focusedTriggerElement = triggerBtn || document.activeElement;

  // Populate data
  document.getElementById("modal-task-number").textContent = `Task 0${task.number}`;
  document.getElementById("modal-task-day").textContent = task.day;
  document.getElementById("modal-task-title").textContent = task.title;
  document.getElementById("modal-task-desc").textContent = task.description;
  document.getElementById("modal-task-stage").textContent = task.stage;
  document.getElementById("modal-task-milestone").textContent = task.milestone;
  document.getElementById("modal-task-deliverable").textContent = task.deliverable;

  // Status Badge in Modal
  const statusContainer = document.getElementById("modal-task-status");
  if (statusContainer) {
    let statusClass = "badge-not-started";
    let statusText = "Not Started";
    if (task.status === "completed") {
      statusClass = "badge-completed";
      statusText = "Completed";
    } else if (task.status === "in-progress") {
      statusClass = "badge-in-progress";
      statusText = "In Progress";
    }
    statusContainer.className = `task-status-badge ${statusClass}`;
    statusContainer.innerHTML = `<span>${statusText}</span>`;
  }

  // Skills chips
  const skillsContainer = document.getElementById("modal-task-skills");
  if (skillsContainer) {
    skillsContainer.innerHTML = (task.skills || []).map(skill => 
      `<span class="tag-chip tag-skill">${escapeHtml(skill)}</span>`
    ).join("");
  }

  // Dynamic modal action button
  const modalActionContainer = document.getElementById("modal-action-buttons");
  if (modalActionContainer) {
    if (task.status === "completed") {
      modalActionContainer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="closeTaskModal()">Close Details</button>
        ${task.relatedUrl ? `<a href="${task.relatedUrl}" class="btn btn-primary">Open Related Experience</a>` : ""}
      `;
    } else {
      modalActionContainer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="closeTaskModal()">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="markTaskComplete(${task.id}); closeTaskModal();">
          Mark as Completed ✓
        </button>
      `;
    }
  }

  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

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

// ==========================================================================
// 10. MODERN WEB TECHNOLOGIES EXPLORER
// ==========================================================================

function renderTechnology(techKey) {
  const data = technologyData[techKey];
  if (!data) return;

  activeTechnology = techKey;

  // Update tabs active state
  const tabs = document.querySelectorAll("[data-tech-tab]");
  tabs.forEach(tab => {
    const isCurrent = tab.getAttribute("data-tech-tab") === techKey;
    tab.classList.toggle("active", isCurrent);
    tab.setAttribute("aria-selected", isCurrent ? "true" : "false");
  });

  // Populate info panel
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
// 11. TOAST NOTIFICATIONS
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

  // Icon
  if (toastIcon) {
    if (type === "success") {
      toastIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      toast.className = "dashboard-toast toast-success is-active";
    } else {
      toastIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      toast.className = "dashboard-toast toast-info is-active";
    }
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-active");
  }, 3500);
}

// ==========================================================================
// 12. THEME (DARK / LIGHT MODE)
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
    // Ignore storage errors
  }

  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.innerHTML = isDark 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span>Light Mode</span>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span>Dark Mode</span>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const target = current === "dark" ? "light" : "dark";
  setTheme(target);
  showToast(`Switched to ${target} mode`, "info");
}

// ==========================================================================
// 13. UTILITY HELPERS
// ==========================================================================

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function scrollToCurrentTask() {
  const metrics = getProgressMetrics();
  if (!metrics.currentTask) return;

  // Make sure current task is visible (switch to 'all' or 'in-progress' if filtered)
  if (activeTaskFilter !== "all" && activeTaskFilter !== metrics.currentTask.status) {
    activeTaskFilter = "all";
    updateFilterButtonStates();
    renderTasks();
  }

  const card = document.querySelector(`[data-task-id="${metrics.currentTask.id}"]`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("highlight-pulse");
    setTimeout(() => card.classList.remove("highlight-pulse"), 1600);
  }
}

// ==========================================================================
// 14. EVENT LISTENERS & BOOTSTRAP
// ==========================================================================

function initEventListeners() {
  // Task Filters
  const filterButtons = document.querySelectorAll("[data-task-filter]");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeTaskFilter = btn.getAttribute("data-task-filter");
      updateFilterButtonStates();
      renderTasks();
    });
  });

  // Task Search
  const searchInput = document.getElementById("task-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      taskSearchQuery = e.target.value;
      renderTasks();
    });
  }

  // Clear Filters button in empty state
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

  // Continue Current Task Button
  const continueTaskBtn = document.getElementById("continue-task-btn");
  if (continueTaskBtn) {
    continueTaskBtn.addEventListener("click", scrollToCurrentTask);
  }

  // Reset Progress Button
  const resetBtn = document.getElementById("reset-progress-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetProgress);
  }

  // Technology Explorer Tabs
  const techTabs = document.querySelectorAll("[data-tech-tab]");
  techTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-tech-tab");
      renderTechnology(key);
    });
  });

  // Theme Toggle Button
  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Modal Close Events
  const modalCloseBtn = document.getElementById("modal-close-button");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeTaskModal);
  }

  const modal = document.getElementById("task-details-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeTaskModal();
    });
  }

  // Global Keyboard shortcuts: Escape to close modal or mobile sidebar drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("is-visible")) {
        closeTaskModal();
      } else if (sidebar && sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
        if (sidebarBackdrop) sidebarBackdrop.classList.remove("is-visible");
        if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Mobile Sidebar Drawer Toggle
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

  // Close mobile sidebar on nav link click and update active state
  const sidebarLinks = document.querySelectorAll(".sidebar-nav-link");
  sidebarLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobileSidebar();
      if (link.getAttribute("href")?.startsWith("#")) {
        sidebarLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });
}

// Expose functions globally for inline onclick handlers
window.markTaskComplete = markTaskComplete;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadTasks();
  initEventListeners();
  updateProgressUI();
  renderTasks();
  renderTechnology("nextjs");
});
