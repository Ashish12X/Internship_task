# Take-Home Assignment — The Untested API

This project is a submission for the Full Stack Developer Intern assignment.  
The goal was to analyze an existing codebase, write tests, identify bugs, and implement new features.

---

## 🚀 Live API

Base URL:  
https://internship-task-1-23y8.onrender.com/

---

## 📌 Assignment Work Completed

### ✅ 1. Test Cases
- Added unit and integration tests for task routes and services
- Covered edge cases such as invalid inputs, missing fields, and incorrect status updates

### 🐞 2. Bug Reports
- Identified and documented multiple issues in the codebase
- Each bug includes:
  - File location
  - Root cause
  - Expected vs actual behavior

👉 See: `BUG_REPORT.md`

---

### 🔧 3. Bug Fixes
- Fixed critical issues affecting API reliability
- Improved validation and error handling

---

### 🚀 4. Feature Implemented

#### PATCH /tasks/:id/assign

- Assigns a task to a user
- Validates input before assignment
- Handles edge cases (invalid ID, missing user, etc.)

---

## 📂 API Endpoints

| Method   | Endpoint                     | Description |
|----------|-----------------------------|------------|
| GET      | `/tasks`                    | Get all tasks |
| POST     | `/tasks`                    | Create a task |
| PUT      | `/tasks/:id`                | Update a task |
| DELETE   | `/tasks/:id`                | Delete a task |
| PATCH    | `/tasks/:id/complete`       | Mark task complete |
| PATCH    | `/tasks/:id/assign`         | Assign task to user |
| GET      | `/tasks/stats`              | Get task statistics |

---

## 🧪 Testing

Run tests using:

```bash
npm test
