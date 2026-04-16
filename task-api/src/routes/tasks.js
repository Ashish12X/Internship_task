const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const { validateCreateTask, validateUpdateTask } = require('../utils/validators');

router.get('/stats', (req, res) => {
  res.json(taskService.getStats());
});

router.get('/', (req, res) => {
  const { status, page, limit } = req.query;

  if (status) {
    return res.json(taskService.getByStatus(status));
  }

  if (page || limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    return res.json(taskService.getPaginated(pageNum, limitNum));
  }

  res.json(taskService.getAll());
});

router.post('/', (req, res) => {
  const error = validateCreateTask(req.body);
  if (error) return res.status(400).json({ error });

  const task = taskService.create(req.body);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const error = validateUpdateTask(req.body);
  if (error) return res.status(400).json({ error });

  const task = taskService.update(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.json(task);
});

router.delete('/:id', (req, res) => {
  const success = taskService.remove(req.params.id);
  if (!success) return res.status(404).json({ error: 'Task not found' });

  res.status(204).send();
});

router.patch('/:id/complete', (req, res) => {
  const task = taskService.completeTask(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.json(task);
});

router.patch('/:id/assign', (req, res) => {
  const { assignee } = req.body;
  if (!assignee || typeof assignee !== 'string' || !assignee.trim()) {
    return res.status(400).json({ error: 'assignee is required and must be a non-empty string' });
  }

  const task = taskService.assignTask(req.params.id, assignee);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.json(task);
});

module.exports = router;
