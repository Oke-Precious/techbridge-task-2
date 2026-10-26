/**
 * Automated Verification Script for Task 7 Backend REST API
 * Tests all required endpoints, validation rules, HTTP status codes, and JSON file persistence.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.resolve(__dirname, 'data', 'tasks.json');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('========================================================');
  console.log(' Starting TechBridge Task 7 Automated Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health Check Endpoint
    console.log('--- 1. Testing GET /api/health ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert(healthRes.status === 200, 'GET /api/health returns HTTP 200');
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'GET /api/health returns status "healthy"');
    assert(typeof healthData.timestamp === 'string', 'GET /api/health includes timestamp');

    // 2. Get All Tasks Endpoint
    console.log('\n--- 2. Testing GET /api/tasks ---');
    const tasksRes = await fetch(`${BASE_URL}/api/tasks`);
    assert(tasksRes.status === 200, 'GET /api/tasks returns HTTP 200');
    const tasksData = await tasksRes.json();
    assert(tasksData.success === true, 'GET /api/tasks success is true');
    assert(Array.isArray(tasksData.data), 'GET /api/tasks returns data array');
    assert(tasksData.data.length >= 8, `GET /api/tasks returns 8 tasks (got ${tasksData.data.length})`);
    
    // Check Task 1 fields
    const task1 = tasksData.data.find(t => t.id === 1);
    assert(task1 !== undefined, 'Task 1 exists in data array');
    assert(task1 && task1.title.length > 0, 'Task 1 has title');
    assert(task1 && ['not_started', 'in_progress', 'completed'].includes(task1.status), 'Task 1 has valid status');

    // 3. Get Single Task Endpoint
    console.log('\n--- 3. Testing GET /api/tasks/:id ---');
    const singleRes = await fetch(`${BASE_URL}/api/tasks/1`);
    assert(singleRes.status === 200, 'GET /api/tasks/1 returns HTTP 200');
    const singleData = await singleRes.json();
    assert(singleData.success === true && singleData.data.id === 1, 'GET /api/tasks/1 returns task 1 object');

    // 4. Missing Task ID (404)
    console.log('\n--- 4. Testing 404 Not Found Handling ---');
    const notFoundRes = await fetch(`${BASE_URL}/api/tasks/9999`);
    assert(notFoundRes.status === 404, 'GET /api/tasks/9999 returns HTTP 404');
    const notFoundData = await notFoundRes.json();
    assert(notFoundData.success === false, '404 response has success: false');

    // 5. Invalid Task ID Format (400)
    console.log('\n--- 5. Testing 400 Bad Request Handling for Non-Numeric ID ---');
    const invalidIdRes = await fetch(`${BASE_URL}/api/tasks/invalid-id`);
    assert(invalidIdRes.status === 400, 'GET /api/tasks/invalid-id returns HTTP 400');

    // 6. Update Task Status via PUT /api/tasks/:id
    console.log('\n--- 6. Testing PUT /api/tasks/:id ---');
    const putRes = await fetch(`${BASE_URL}/api/tasks/7`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    assert(putRes.status === 200, 'PUT /api/tasks/7 returns HTTP 200');
    const putData = await putRes.json();
    assert(putData.success === true, 'PUT response success is true');
    assert(putData.data.status === 'completed', 'Task 7 status updated to "completed" in response');

    // 7. Verify JSON File Persistence
    console.log('\n--- 7. Verifying JSON File Persistence to tasks.json ---');
    const rawFileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const fileTasks = JSON.parse(rawFileContent);
    const persistedTask7 = fileTasks.find(t => t.id === 7);
    assert(persistedTask7 && persistedTask7.status === 'completed', 'Task 7 status "completed" was persisted to disk in tasks.json');

    // 8. Reject Invalid Status in PUT (400)
    console.log('\n--- 8. Testing Status Validation Rejection ---');
    const badStatusRes = await fetch(`${BASE_URL}/api/tasks/7`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'invalid_status_xyz' })
    });
    assert(badStatusRes.status === 400, 'PUT with invalid status returns HTTP 400');

    // 9. Reset Endpoint
    console.log('\n--- 9. Testing POST /api/tasks/reset ---');
    const resetRes = await fetch(`${BASE_URL}/api/tasks/reset`, { method: 'POST' });
    assert(resetRes.status === 200, 'POST /api/tasks/reset returns HTTP 200');
    const afterResetTasks = await (await fetch(`${BASE_URL}/api/tasks`)).json();
    assert(afterResetTasks.count === 8, 'Reset restored exactly 8 tasks');

    console.log('\n========================================================');
    console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with exception:', err);
    process.exit(1);
  }
}

runTests();
