/**
 * TechBridge Challenge Hub — Interactive JavaScript (Task 5 & Task 8)
 * Pure Vanilla JavaScript — HTML5 / CSS3 / Vanilla JS / Fetch API
 * 
 * Features:
 * - 8 structured challenges (4 Data Analytics, 4 Web Development)
 * - Track filtering (All, Data Analytics, Web Development)
 * - Difficulty filtering (All, Beginner, Intermediate, Advanced)
 * - Live search by challenge name, description, or skills
 * - Combined filter logic (track + difficulty + search work simultaneously)
 * - Dynamic results counter with proper singular/plural
 * - Empty state with friendly reset button
 * - Fully accessible details modal with focus management, Esc key, and backdrop click
 * - REST API integration with /api/challenges and /api/challenges/:id
 */

// ==========================================================================
// 1. CHALLENGE DATA STORE (OFFLINE FALLBACK & DEFAULT SEED)
// ==========================================================================
const DEFAULT_CHALLENGES = [
  // ------------------------------------------------------------------------
  // Data Analytics Challenges (4)
  // ------------------------------------------------------------------------
  {
    id: "data-1",
    name: "Sales Data Cleanup",
    track: "Data Analytics",
    trackId: "data-analytics",
    difficulty: "Beginner",
    difficultyId: "beginner",
    shortDescription: "Clean a small sales dataset by fixing missing values, duplicate records and inconsistent formatting.",
    expectedOutcome: "A clean and organized dataset ready for analysis.",
    objective: "Prepare messy business data for accurate analysis.",
    skills: ["Data cleaning", "Spreadsheet organization", "Identifying duplicates", "Handling missing values"],
    tools: ["Google Sheets", "Microsoft Excel"],
    deliverable: "A cleaned version of the supplied sales dataset.",
    estimatedTime: "45–60 minutes",
    expectedResult: "A consistent dataset with obvious errors corrected.",
    icon: "chart"
  },
  {
    id: "data-2",
    name: "Customer Insights Analysis",
    track: "Data Analytics",
    trackId: "data-analytics",
    difficulty: "Beginner",
    difficultyId: "beginner",
    shortDescription: "Use formulas and Pivot Tables to explore customer purchase information and answer business questions.",
    expectedOutcome: "A short analysis summarizing useful customer insights.",
    objective: "Use spreadsheet analysis techniques to identify patterns in customer activity.",
    skills: ["Spreadsheet formulas", "Pivot Tables", "Filtering", "Basic analysis"],
    tools: ["Google Sheets", "Microsoft Excel"],
    deliverable: "A summarized analysis with supporting tables.",
    estimatedTime: "60–90 minutes",
    expectedResult: "Clear answers to practical questions about customer activity.",
    icon: "chart"
  },
  {
    id: "data-3",
    name: "Business Performance Dashboard",
    track: "Data Analytics",
    trackId: "data-analytics",
    difficulty: "Intermediate",
    difficultyId: "intermediate",
    shortDescription: "Create a simple dashboard that communicates important business performance information.",
    expectedOutcome: "A clear dashboard containing useful charts and summary metrics.",
    objective: "Turn analyzed business data into an easy-to-understand visual report.",
    skills: ["Data visualization", "Chart selection", "Dashboard layout", "Communicating insights"],
    tools: ["Google Sheets", "Microsoft Excel"],
    deliverable: "A one-page business dashboard.",
    estimatedTime: "90–120 minutes",
    expectedResult: "A dashboard that communicates major trends clearly.",
    icon: "chart"
  },
  {
    id: "data-4",
    name: "Customer Churn Investigation",
    track: "Data Analytics",
    trackId: "data-analytics",
    difficulty: "Advanced",
    difficultyId: "advanced",
    shortDescription: "Examine customer information to identify patterns that may be associated with customers leaving a service.",
    expectedOutcome: "A short analytical report identifying useful patterns and recommendations.",
    objective: "Investigate a realistic business question using structured data.",
    skills: ["Data cleaning", "Segmentation", "Comparison", "Interpretation", "Recommendations"],
    tools: ["Spreadsheet software", "SQL (basic)"],
    deliverable: "A concise analysis with supporting charts or tables.",
    estimatedTime: "2–3 hours",
    expectedResult: "Evidence-based observations explaining possible churn patterns.",
    icon: "database"
  },

  // ------------------------------------------------------------------------
  // Web Development Challenges (4)
  // ------------------------------------------------------------------------
  {
    id: "web-1",
    name: "Responsive Landing Page",
    track: "Web Development",
    trackId: "web-development",
    difficulty: "Beginner",
    difficultyId: "beginner",
    shortDescription: "Build a clean landing page that adapts properly across desktop, tablet and mobile screens.",
    expectedOutcome: "A responsive landing page built with semantic HTML and CSS.",
    objective: "Practice page structure, layout and responsive design.",
    skills: ["HTML5", "CSS3", "Flexbox/Grid", "Media queries"],
    tools: ["VS Code", "Browser Developer Tools"],
    deliverable: "A complete responsive landing page.",
    estimatedTime: "60–90 minutes",
    expectedResult: "A visually organized page that remains usable on different screen sizes.",
    icon: "code"
  },
  {
    id: "web-2",
    name: "Personal Portfolio Page",
    track: "Web Development",
    trackId: "web-development",
    difficulty: "Beginner",
    difficultyId: "beginner",
    shortDescription: "Create a professional portfolio page that presents a developer's projects, skills and contact information.",
    expectedOutcome: "A clean portfolio interface with clear sections and navigation.",
    objective: "Practice structuring and styling a professional webpage.",
    skills: ["Semantic HTML", "CSS layouts", "Navigation", "Responsive design"],
    tools: ["HTML", "CSS", "VS Code"],
    deliverable: "A responsive single-page portfolio.",
    estimatedTime: "90–120 minutes",
    expectedResult: "A professional portfolio layout that works well across screen sizes.",
    icon: "code"
  },
  {
    id: "web-3",
    name: "Interactive Product Page",
    track: "Web Development",
    trackId: "web-development",
    difficulty: "Intermediate",
    difficultyId: "intermediate",
    shortDescription: "Build a product page with interactive UI elements controlled using JavaScript.",
    expectedOutcome: "A functional product interface with responsive styling and user interaction.",
    objective: "Combine HTML, CSS and JavaScript in a practical interface.",
    skills: ["DOM manipulation", "Event listeners", "Responsive design", "UI states"],
    tools: ["HTML", "CSS", "JavaScript", "Browser Developer Tools"],
    deliverable: "An interactive responsive product page.",
    estimatedTime: "2 hours",
    expectedResult: "A polished interface where user actions update visible content without reloading the page.",
    icon: "code"
  },
  {
    id: "web-4",
    name: "Interactive Business Website",
    track: "Web Development",
    trackId: "web-development",
    difficulty: "Advanced",
    difficultyId: "advanced",
    shortDescription: "Build a multi-section responsive business website containing useful JavaScript interactions.",
    expectedOutcome: "A polished business website demonstrating structure, styling, responsiveness and interaction.",
    objective: "Combine core frontend skills into a larger practical project.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive layouts", "DOM interaction", "Interface design"],
    tools: ["VS Code", "Browser Developer Tools", "Git/GitHub"],
    deliverable: "A complete responsive frontend experience.",
    estimatedTime: "3–4 hours",
    expectedResult: "A professional multi-section website with functioning user interactions.",
    icon: "code"
  }
];

// Working in-memory challenge array initialized with fallback defaults
let challenges = [...DEFAULT_CHALLENGES];

// REST API Configuration (Task 8 Challenge Hub REST API)
const RENDER_BACKEND_URL = "https://techbridge-task-api-23lb.onrender.com";

function resolveApiBaseUrl() {
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    return currentOrigin;
  }
  if (hostname.includes("onrender.com")) {
    return currentOrigin;
  }
  return RENDER_BACKEND_URL;
}

const API_BASE_URL = resolveApiBaseUrl();

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================
const filterState = {
  selectedTrack: "all",
  selectedDifficulty: "all",
  searchTerm: ""
};

// Keep track of the previously focused element to return focus after modal closes
let previousActiveElement = null;

// ==========================================================================
// 3. DOM ELEMENT REFERENCES
// ==========================================================================
const challengesGrid = document.getElementById("challenges-grid");
const noResultsState = document.getElementById("no-results-state");
const resultCountEl = document.getElementById("result-count");
const searchInput = document.getElementById("challenge-search");
const resetFiltersBtn = document.getElementById("reset-filters-btn");
const trackFilterButtons = document.querySelectorAll("[data-track-filter]");
const difficultyFilterButtons = document.querySelectorAll("[data-difficulty-filter]");

// Modal Elements
const modal = document.getElementById("challenge-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalCloseAction = document.getElementById("modal-close-action");
const modalTrackBadge = document.getElementById("modal-track-badge");
const modalDifficultyBadge = document.getElementById("modal-difficulty-badge");
const modalTitle = document.getElementById("modal-title");
const modalShortDesc = document.getElementById("modal-short-desc");
const modalObjective = document.getElementById("modal-objective");
const modalEstimatedTime = document.getElementById("modal-estimated-time");
const modalDeliverable = document.getElementById("modal-deliverable");
const modalToolsList = document.getElementById("modal-tools-list");
const modalSkillsList = document.getElementById("modal-skills-list");
const modalOutcomeText = document.getElementById("modal-outcome-text");
const modalResultText = document.getElementById("modal-result-text");

// ==========================================================================
// 4. ICON UTILITIES (SVG)
// ==========================================================================
function getTrackIconSvg(trackId) {
  if (trackId === "data-analytics") {
    return `<svg class="track-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>`;
  }
  return `<svg class="track-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>`;
}

function getArrowSvg() {
  return `<svg class="arrow-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>`;
}

// ==========================================================================
// 5. RENDERING FUNCTIONS
// ==========================================================================

/**
 * Creates an individual challenge card element
 */
function createChallengeCard(challenge, index) {
  const card = document.createElement("article");
  card.className = `challenge-card track-${challenge.trackId}`;
  card.setAttribute("data-challenge-id", challenge.id);
  card.style.animationDelay = `${index * 60}ms`;

  const trackIconSvg = getTrackIconSvg(challenge.trackId);
  const arrowSvg = getArrowSvg();

  // Highlight preview skills
  const skillsPreview = challenge.skills.slice(0, 3).map(skill => 
    `<span class="skill-mini-tag">${escapeHtml(skill)}</span>`
  ).join("");

  card.innerHTML = `
    <div class="card-top-bar">
      <div class="card-track-badge badge-${challenge.trackId}">
        ${trackIconSvg}
        <span>${escapeHtml(challenge.track)}</span>
      </div>
      <span class="card-difficulty-badge difficulty-${challenge.difficultyId}">
        ${escapeHtml(challenge.difficulty)}
      </span>
    </div>

    <h3 class="card-challenge-title">${escapeHtml(challenge.name)}</h3>
    <p class="card-challenge-desc">${escapeHtml(challenge.shortDescription)}</p>

    <div class="card-outcome-box">
      <div class="outcome-box-header">
        <svg class="outcome-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span class="outcome-label">Expected Outcome</span>
      </div>
      <p class="outcome-text">${escapeHtml(challenge.expectedOutcome)}</p>
    </div>

    <div class="card-skills-row" aria-label="Key skills">
      ${skillsPreview}
    </div>

    <div class="card-action-bar">
      <button type="button" class="btn-view-challenge" data-view-id="${challenge.id}" aria-label="View details for ${escapeHtml(challenge.name)}">
        <span>View Challenge</span>
        ${arrowSvg}
      </button>
    </div>
  `;

  // Make whole card clickable while preserving accessible button
  card.addEventListener("click", (e) => {
    // If click was inside or on the button, let the button handler fire
    openChallengeModal(challenge.id, card.querySelector(".btn-view-challenge"));
  });

  return card;
}

/**
 * Escapes HTML characters to prevent XSS
 */
function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Renders the list of challenges to the DOM
 */
function renderChallenges(challengeList) {
  if (!challengesGrid) return;

  challengesGrid.innerHTML = "";

  if (challengeList.length === 0) {
    if (noResultsState) noResultsState.style.display = "block";
    updateResultCount(0);
    return;
  }

  if (noResultsState) noResultsState.style.display = "none";

  challengeList.forEach((challenge, index) => {
    const cardEl = createChallengeCard(challenge, index);
    challengesGrid.appendChild(cardEl);
  });

  updateResultCount(challengeList.length);
}

/**
 * Updates result count display with proper singular/plural grammar
 */
function updateResultCount(count) {
  if (!resultCountEl) return;
  if (count === 1) {
    resultCountEl.textContent = "1 Challenge Found";
  } else {
    resultCountEl.textContent = `${count} Challenges Found`;
  }
}

// ==========================================================================
// 6. FILTERING LOGIC
// ==========================================================================

/**
 * Evaluates filter state and returns filtered array
 */
function getFilteredChallenges() {
  const { selectedTrack, selectedDifficulty, searchTerm } = filterState;
  const cleanSearch = searchTerm.trim().toLowerCase();

  return challenges.filter(challenge => {
    // 1. Track Match
    const matchesTrack = selectedTrack === "all" || challenge.trackId === selectedTrack;

    // 2. Difficulty Match
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficultyId === selectedDifficulty;

    // 3. Search Term Match
    let matchesSearch = true;
    if (cleanSearch) {
      const inName = challenge.name.toLowerCase().includes(cleanSearch);
      const inDesc = challenge.shortDescription.toLowerCase().includes(cleanSearch);
      const inOutcome = challenge.expectedOutcome.toLowerCase().includes(cleanSearch);
      const inObjective = challenge.objective.toLowerCase().includes(cleanSearch);
      const inSkills = challenge.skills.some(skill => skill.toLowerCase().includes(cleanSearch));
      const inTools = challenge.tools.some(tool => tool.toLowerCase().includes(cleanSearch));
      matchesSearch = inName || inDesc || inOutcome || inObjective || inSkills || inTools;
    }

    return matchesTrack && matchesDifficulty && matchesSearch;
  });
}

/**
 * Applies current filters without reloading the page
 */
function applyFilters() {
  // Smooth re-render animation
  if (challengesGrid) {
    challengesGrid.classList.add("filtering-transition");
  }

  const filtered = getFilteredChallenges();
  renderChallenges(filtered);

  if (challengesGrid) {
    setTimeout(() => {
      challengesGrid.classList.remove("filtering-transition");
    }, 150);
  }
}

/**
 * Resets all filters back to default
 */
function resetFilters() {
  filterState.selectedTrack = "all";
  filterState.selectedDifficulty = "all";
  filterState.searchTerm = "";

  if (searchInput) searchInput.value = "";

  // Update button active states
  trackFilterButtons.forEach(btn => {
    const isAll = btn.getAttribute("data-track-filter") === "all";
    btn.classList.toggle("active", isAll);
    btn.setAttribute("aria-pressed", isAll ? "true" : "false");
  });

  difficultyFilterButtons.forEach(btn => {
    const isAll = btn.getAttribute("data-difficulty-filter") === "all";
    btn.classList.toggle("active", isAll);
    btn.setAttribute("aria-pressed", isAll ? "true" : "false");
  });

  applyFilters();
}

// ==========================================================================
// 7. MODAL LOGIC (ACCESSIBLE & REUSABLE)
// ==========================================================================

/**
 * Opens challenge details modal populated with selected challenge data
 */
function openChallengeModal(challengeId, triggerElement) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge || !modal) return;

  previousActiveElement = triggerElement || document.activeElement;

  // Populate data
  if (modalTrackBadge) {
    modalTrackBadge.className = `card-track-badge badge-${challenge.trackId}`;
    modalTrackBadge.innerHTML = `${getTrackIconSvg(challenge.trackId)} <span>${escapeHtml(challenge.track)}</span>`;
  }

  if (modalDifficultyBadge) {
    modalDifficultyBadge.className = `card-difficulty-badge difficulty-${challenge.difficultyId}`;
    modalDifficultyBadge.textContent = challenge.difficulty;
  }

  if (modalTitle) modalTitle.textContent = challenge.name;
  if (modalShortDesc) modalShortDesc.textContent = challenge.shortDescription;
  if (modalObjective) modalObjective.textContent = challenge.objective;
  if (modalEstimatedTime) modalEstimatedTime.textContent = challenge.estimatedTime;
  if (modalDeliverable) modalDeliverable.textContent = challenge.deliverable;
  if (modalOutcomeText) modalOutcomeText.textContent = challenge.expectedOutcome;
  if (modalResultText) modalResultText.textContent = challenge.expectedResult;

  // Populate Tools Pills
  if (modalToolsList) {
    modalToolsList.innerHTML = challenge.tools.map(tool => 
      `<span class="tag-chip tag-tool">${escapeHtml(tool)}</span>`
    ).join("");
  }

  // Populate Skills Pills
  if (modalSkillsList) {
    modalSkillsList.innerHTML = challenge.skills.map(skill => 
      `<span class="tag-chip tag-skill">${escapeHtml(skill)}</span>`
    ).join("");
  }

  // Show modal
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-visible");
  document.body.classList.add("modal-open");

  // Focus close button for keyboard accessibility
  if (modalCloseBtn) {
    setTimeout(() => {
      modalCloseBtn.focus();
    }, 50);
  }

  // Live REST API synchronization: Query GET /api/challenges/:id
  fetch(`${API_BASE_URL}/api/challenges/${challengeId}`)
    .then(res => (res.ok ? res.json() : null))
    .then(payload => {
      if (payload && payload.success && payload.data) {
        const live = payload.data;
        if (modalTitle && live.name) modalTitle.textContent = live.name;
        if (modalShortDesc && live.shortDescription) modalShortDesc.textContent = live.shortDescription;
        if (modalObjective && live.objective) modalObjective.textContent = live.objective;
        if (modalEstimatedTime && live.estimatedTime) modalEstimatedTime.textContent = live.estimatedTime;
        if (modalDeliverable && live.deliverable) modalDeliverable.textContent = live.deliverable;
        if (modalOutcomeText && live.expectedOutcome) modalOutcomeText.textContent = live.expectedOutcome;
        if (modalResultText && live.expectedResult) modalResultText.textContent = live.expectedResult;
      }
    })
    .catch(() => {
      // Preserves existing cached challenge data if offline
    });
}

/**
 * Closes challenge modal and returns focus
 */
function closeChallengeModal() {
  if (!modal) return;

  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-visible");
  document.body.classList.remove("modal-open");

  // Return focus to triggering button
  if (previousActiveElement && typeof previousActiveElement.focus === "function") {
    previousActiveElement.focus();
    previousActiveElement = null;
  }
}

// Trap focus inside modal when tabbing
function trapFocus(e) {
  if (!modal || modal.getAttribute("aria-hidden") === "true") return;

  if (e.key === "Tab") {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

// ==========================================================================
// 8. EVENT LISTENERS & INITIALIZATION
// ==========================================================================

function setupEventListeners() {
  // Track Filter Buttons
  trackFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const trackValue = button.getAttribute("data-track-filter");
      filterState.selectedTrack = trackValue;

      trackFilterButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      applyFilters();
    });
  });

  // Difficulty Filter Buttons
  difficultyFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const difficultyValue = button.getAttribute("data-difficulty-filter");
      filterState.selectedDifficulty = difficultyValue;

      difficultyFilterButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      applyFilters();
    });
  });

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.searchTerm = e.target.value;
      applyFilters();
    });
  }

  // Reset Filters Button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters);
  }

  // Quick Track Filter Buttons in the Overview Section
  const quickTrackBtns = document.querySelectorAll("[data-quick-track]");
  quickTrackBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTrack = btn.getAttribute("data-quick-track");
      filterState.selectedTrack = targetTrack;

      // Update button active states
      trackFilterButtons.forEach(b => {
        const matches = b.getAttribute("data-track-filter") === targetTrack;
        b.classList.toggle("active", matches);
        b.setAttribute("aria-pressed", matches ? "true" : "false");
      });

      applyFilters();

      // Smooth scroll down to filters
      const filterSection = document.getElementById("challenge-filters");
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Modal Close Events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeChallengeModal);
  }
  if (modalCloseAction) {
    modalCloseAction.addEventListener("click", closeChallengeModal);
  }

  // Close when clicking backdrop
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeChallengeModal();
      }
    });
  }

  // Keyboard navigation: Escape key closes modal & Tab trap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
      closeChallengeModal();
    }
    trapFocus(e);
  });
}

/**
 * Loads challenge collection from the backend REST API GET /api/challenges
 */
async function loadChallengesFromApi() {
  const loadingEl = document.getElementById("challenges-loading-state");
  const errorEl = document.getElementById("challenges-error-state");

  if (loadingEl) loadingEl.style.display = "flex";
  if (errorEl) errorEl.style.display = "none";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${API_BASE_URL}/api/challenges`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const payload = await res.json();
    if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
      challenges = payload.data;
      console.log(`[TechBridge API] Loaded ${challenges.length} challenges from REST endpoint: ${API_BASE_URL}/api/challenges`);
      applyFilters();
    }
  } catch (err) {
    console.warn("[TechBridge API] Unable to fetch challenges from remote API, falling back to local dataset:", err.message);
    if (errorEl && (!challenges || challenges.length === 0)) {
      errorEl.style.display = "block";
    }
  } finally {
    if (loadingEl) loadingEl.style.display = "none";
  }
}

// Initial Boot
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  renderChallenges(challenges);
  loadChallengesFromApi();
});
