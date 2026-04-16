# BUG REPORT

## 1. Pagination Logic Error
- **Location**: `src/services/taskService.js`, `getPaginated` function.
- **Problem**: The offset was calculated as `page * limit`. For page 1 with limit 10, this resulted in an offset of 10, effectively skipping the first 10 tasks.
- **Expected Behavior**: Page 1 should start from index 0.
- **Actual Behavior**: Page 1 skipped the first `limit` number of items.
- **Fix**: Changed calculation to `(page - 1) * limit`.

## 2. Partial Status Match Bug
- **Location**: `src/services/taskService.js`, `getByStatus` function.
- **Problem**: Used `.includes(status)` for filtering tasks by status. This allowed partial matches (e.g., searching for "do" matched both "todo" and "done").
- **Expected Behavior**: Filter should only match the exact status string.
- **Actual Behavior**: Partial strings returned incorrect results.
- **Fix**: Changed from `.includes(status)` to strict equality `=== status`.

## 3. Task Completion Side Effect
- **Location**: `src/services/taskService.js`, `completeTask` function.
- **Problem**: The function hardcoded `priority: 'medium'` when completing a task, overwriting the original priority.
- **Expected Behavior**: Completing a task should only change the status and set `completedAt`, preserving other fields like priority.
- **Actual Behavior**: Priority was reset to 'medium' regardless of its previous value.
- **Fix**: Removed the hardcoded priority reset.

## 4. Statistics Calculation Bug (Edge Case)
- **Location**: `src/services/taskService.js`, `getStats` function.
- **Problem**: The overdue check `new Date(t.dueDate) < now` would potentially produce unexpected results if `dueDate` was not a valid date or unexpectedly handled (though the code had a guard, it was worth reinforcing).
- **Fix**: Ensured `t.dueDate` is explicitly checked for truthiness before date comparison.
