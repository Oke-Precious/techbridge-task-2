import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve paths to data file and frontend directory
const DATA_FILE_PATH = path.resolve(__dirname, 'data', 'tasks.json');
const FRONTEND_DIR = path.resolve(__dirname, '..', 'frontend');
const ROOT_DIR = path.resolve(__dirname, '..');

// Allowed status values per Task 7 requirements
const ALLOWED_STATUSES = ['not_started', 'in_progress', 'completed'];

// Helper to normalize status values (e.g., 'not-started' -> 'not_started')
function normalizeStatus(status) {
  if (typeof status !== 'string') return null;
  const s = status.trim().toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_');
  if (ALLOWED_STATUSES.includes(s)) {
    return s;
  }
  return null;
}

// ==========================================================================
// MIDDLEWARE CONFIGURATION
// ==========================================================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// CORS Middleware for seamless local development across different ports
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request Logger for debugging and transparency
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================================================
// ASYNCHRONOUS JSON FILE OPERATIONS
// ==========================================================================

// Read tasks from tasks.json
async function readTasksFromFile() {
  try {
    const rawData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      throw new Error('tasks.json does not contain an array of tasks');
    }
    return parsed;
  } catch (error) {
    console.error('Error reading tasks.json:', error.message);
    throw error;
  }
}

// Write tasks atomically to tasks.json
async function writeTasksToFile(tasks) {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    // Write formatted JSON with 2-space indentation
    const jsonString = JSON.stringify(tasks, null, 2);
    // Write to a temporary file first then rename to prevent corrupt writes
    const tempFilePath = `${DATA_FILE_PATH}.tmp`;
    await fs.writeFile(tempFilePath, jsonString, 'utf-8');
    await fs.rename(tempFilePath, DATA_FILE_PATH);
  } catch (error) {
    console.error('Error writing tasks.json:', error.message);
    throw error;
  }
}

// Default initial tasks for reset functionality
const DEFAULT_TASKS = [
  {
    id: 1,
    order: 1,
    title: "TechBridge Landing Page",
    description: "Create the first version of the TechBridge website using HTML5 and CSS3 with responsive layouts and brand styling.",
    status: "completed",
    day: "Day 1",
    stage: "Stage 01 • Foundation",
    milestone: "Foundation Milestone",
    relatedUrl: "index.html",
    urlLabel: "View Live Homepage",
    skills: ["Semantic HTML5", "CSS3 Layouts", "Brand Styling", "Mobile Responsiveness"],
    deliverable: "Complete responsive homepage with navigation, hero section, and curriculum previews.",
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-03T16:30:00.000Z"
  },
  {
    id: 2,
    order: 2,
    title: "Internship Tracks Experience",
    description: "Create a Programs experience presenting TechBridge available learning tracks in Web Development and Data Analytics.",
    status: "completed",
    day: "Day 4",
    stage: "Stage 01 • Foundation",
    milestone: "Curriculum Presentation",
    relatedUrl: "programs.html",
    urlLabel: "View Programs Experience",
    skills: ["Curriculum Architecture", "Card Component Systems", "Dual-Track Layouts", "CSS Interactions"],
    deliverable: "Dedicated programs page showcasing Web Development and Data Analytics learning tracks.",
    createdAt: "2026-10-04T09:00:00.000Z",
    updatedAt: "2026-10-07T17:00:00.000Z"
  },
  {
    id: 3,
    order: 3,
    title: "Internship Tasks Roadmap",
    description: "Create an interactive interface presenting the TechBridge 30-day internship roadmap and milestone trajectory.",
    status: "completed",
    day: "Day 8",
    stage: "Stage 02 • Progression",
    milestone: "Roadmap Architecture",
    relatedUrl: "internship-tasks.html",
    urlLabel: "View Tasks Roadmap",
    skills: ["Timeline Visualization", "Phase Modeling", "Process Architecture", "Content Hierarchy"],
    deliverable: "Visual 30-day chronological timeline displaying the full 8-milestone trajectory.",
    createdAt: "2026-10-08T09:00:00.000Z",
    updatedAt: "2026-10-10T15:20:00.000Z"
  },
  {
    id: 4,
    order: 4,
    title: "Interactive Task Tracker",
    description: "Use JavaScript to make the internship task experience interactive and enable dynamic filtering and progress tracking.",
    status: "completed",
    day: "Day 11",
    stage: "Stage 02 • Progression",
    milestone: "Dynamic State",
    relatedUrl: "internship-tasks.html",
    urlLabel: "View Task Tracker",
    skills: ["DOM Manipulation", "Event Handling", "State Management", "Data Filtering"],
    deliverable: "Dynamic client-side interactivity enabling seamless filtering and status updates.",
    createdAt: "2026-10-11T09:00:00.000Z",
    updatedAt: "2026-10-14T18:00:00.000Z"
  },
  {
    id: 5,
    order: 5,
    title: "Challenge Hub Experience",
    description: "Create a hands-on Challenge Hub featuring real-world technical challenges, track tagging, and modal previews.",
    status: "completed",
    day: "Day 15",
    stage: "Stage 03 • Application & Submission",
    milestone: "Challenge Repository",
    relatedUrl: "challenges.html",
    urlLabel: "Explore Challenge Hub",
    skills: ["Filter Pipelines", "Search Optimization", "Modal Windows", "Accessibility"],
    deliverable: "10 interactive challenge cards with search, filtering, and detailed specification modal.",
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-18T16:45:00.000Z"
  },
  {
    id: 6,
    order: 6,
    title: "Interactive Intern Dashboard",
    description: "Build an intern dashboard unifying task metrics, progress milestones, task tracking, and modern technology explorations.",
    status: "completed",
    day: "Day 19",
    stage: "Stage 03 • Application & Submission",
    milestone: "Dashboard Architecture",
    relatedUrl: "dashboard.html",
    urlLabel: "Current Dashboard",
    skills: ["SaaS Dashboard Design", "KPI Metric Aggregation", "Responsive Navigation", "Theme System"],
    deliverable: "Interactive dashboard with KPI metrics, progress visualization, search & filters, and dark mode.",
    createdAt: "2026-10-19T09:00:00.000Z",
    updatedAt: "2026-10-21T14:10:00.000Z"
  },
  {
    id: 7,
    order: 7,
    title: "Task Management API",
    description: "Build a professional Node.js and Express REST API to power the Intern Dashboard with full CRUD persistence.",
    status: "in_progress",
    day: "Day 22",
    stage: "Stage 04 • Platform Integration",
    milestone: "Full-Stack API Integration",
    relatedUrl: "dashboard.html",
    urlLabel: "Live API Dashboard",
    skills: ["Node.js", "Express.js", "RESTful Architecture", "JSON File Persistence", "HTTP Status Codes"],
    deliverable: "Working Express API with GET, PUT, POST endpoints connected to tasks.json and frontend fetch().",
    createdAt: "2026-10-22T09:00:00.000Z",
    updatedAt: "2026-10-26T09:30:00.000Z"
  },
  {
    id: 8,
    order: 8,
    title: "Complete Platform Integration",
    description: "Combine the homepage, programs, tasks, challenges, and dashboard into a production-grade full-stack learning platform.",
    status: "not_started",
    day: "Day 26",
    stage: "Stage 04 • Platform Integration",
    milestone: "Platform Finale",
    relatedUrl: "index.html",
    urlLabel: "TechBridge Home",
    skills: ["System Integration", "Cross-Page Navigation", "Production Polish", "Deployment Readiness"],
    deliverable: "Unified multi-page platform integrating homepage, programs, tasks, challenges, and dashboard.",
    createdAt: "2026-10-26T10:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z"
  }
];

// ==========================================================================
// REQUIRED REST API ENDPOINTS
// ==========================================================================

/**
 * A. Health Check
 * GET /api/health
 * Returns JSON indicating backend status, timestamp, and uptime.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'TechBridge Task Management API is running',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * B. Get All Tasks
 * GET /api/tasks
 * Returns all task records from tasks.json.
 */
app.get('/api/tasks', async (req, res, next) => {
  try {
    const tasks = await readTasksFromFile();
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
});

/**
 * C. Get One Task by ID
 * GET /api/tasks/:id
 * Returns the task matching the requested numeric ID, or 404 if not found.
 */
app.get('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Task ID must be a numeric integer.'
      });
    }

    const tasks = await readTasksFromFile();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * D. Update a Task Status
 * PUT /api/tasks/:id
 * Updates task status and persists changes to tasks.json.
 * Validates status strictly to: not_started, in_progress, completed.
 */
app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Task ID must be a numeric integer.'
      });
    }

    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "status". Allowed values: not_started, in_progress, completed'
      });
    }

    const validatedStatus = normalizeStatus(status);
    if (!validatedStatus) {
      return res.status(400).json({
        success: false,
        error: `Invalid status "${status}". Allowed values: not_started, in_progress, completed`
      });
    }

    const tasks = await readTasksFromFile();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    // Update status and updatedAt timestamp
    tasks[taskIndex].status = validatedStatus;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    // Persist to tasks.json
    await writeTasksToFile(tasks);

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: tasks[taskIndex]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * E. Optional Create Task Endpoint
 * POST /api/tasks
 * Adds a new task with unique numeric ID and persists to tasks.json.
 */
app.post('/api/tasks', async (req, res, next) => {
  try {
    const { title, description, status = 'not_started', day, stage, milestone, deliverable, skills } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid required field: "title"'
      });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid required field: "description"'
      });
    }

    const validatedStatus = normalizeStatus(status);
    if (!validatedStatus) {
      return res.status(400).json({
        success: false,
        error: `Invalid status "${status}". Allowed values: not_started, in_progress, completed`
      });
    }

    const tasks = await readTasksFromFile();
    const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
    const newId = maxId + 1;

    const newTask = {
      id: newId,
      order: newId,
      title: title.trim(),
      description: description.trim(),
      status: validatedStatus,
      day: day || `Day ${newId * 3}`,
      stage: stage || 'Stage 04 • Platform Integration',
      milestone: milestone || 'Custom Task Milestone',
      deliverable: deliverable || 'Complete specified task implementation deliverable.',
      skills: Array.isArray(skills) ? skills : ['Web Engineering', 'REST API'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeTasksToFile(tasks);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
});

/**
 * F. Optional Delete Task Endpoint
 * DELETE /api/tasks/:id
 * Deletes a task by numeric ID and persists to tasks.json.
 */
app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Task ID must be a numeric integer.'
      });
    }

    const tasks = await readTasksFromFile();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Task not found with ID ${id}`
      });
    }

    const deleted = tasks.splice(taskIndex, 1)[0];
    await writeTasksToFile(tasks);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: deleted.id, title: deleted.title }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Reset Endpoint
 * POST /api/tasks/reset
 * Restores tasks.json back to the official 8 TechBridge internship tasks.
 */
app.post('/api/tasks/reset', async (req, res, next) => {
  try {
    await writeTasksToFile(DEFAULT_TASKS);
    res.status(200).json({
      success: true,
      message: 'Tasks reset to initial 8 TechBridge internship tasks state',
      data: DEFAULT_TASKS
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================================================
// STATIC FRONTEND SERVING
// ==========================================================================

// Serve frontend assets from both frontend/ and root fallback
app.use(express.static(FRONTEND_DIR));
app.use(express.static(ROOT_DIR));

// Explicit sub-paths for css, js, images to guarantee resolution
app.use('/css', express.static(path.join(FRONTEND_DIR, 'css')));
app.use('/css', express.static(ROOT_DIR));
app.use('/js', express.static(path.join(FRONTEND_DIR, 'js')));
app.use('/js', express.static(ROOT_DIR));
app.use('/images', express.static(path.join(FRONTEND_DIR, 'images')));
app.use('/images', express.static(path.join(ROOT_DIR, 'images')));

// Dashboard page shortcut routes
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'dashboard.html'), (err) => {
    if (err) res.sendFile(path.join(ROOT_DIR, 'dashboard.html'));
  });
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'dashboard.html'), (err) => {
    if (err) res.sendFile(path.join(ROOT_DIR, 'dashboard.html'));
  });
});

// Root landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'), (err) => {
    if (err) res.sendFile(path.join(ROOT_DIR, 'index.html'));
  });
});

// 404 API Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware (Safe, No Stack Traces in Production)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected server error occurred. Please try again later.'
  });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` TechBridge Task Management API Server Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Local Dashboard URL: http://localhost:${PORT}/dashboard.html`);
  console.log(` Health Check:       http://localhost:${PORT}/api/health`);
  console.log(` Tasks Endpoint:     http://localhost:${PORT}/api/tasks`);
  console.log(`=======================================================`);
});

export default app;
