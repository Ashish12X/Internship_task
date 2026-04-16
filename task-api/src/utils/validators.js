const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const validateCreateTask = (body) => {
  const { title, status, priority, dueDate } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'title is required and must be a non-empty string';
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return 'dueDate must be a valid ISO date string';
  }

  return null;
};

const validateUpdateTask = (body) => {
  const { title, status, priority, dueDate } = body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return 'title must be a non-empty string';
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return 'dueDate must be a valid ISO date string';
  }

  return null;
};

module.exports = { validateCreateTask, validateUpdateTask };
