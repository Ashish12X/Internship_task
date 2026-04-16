const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API Integration Tests', () => {
  beforeEach(() => {
    taskService.clearTasks();
  });

  describe('POST /tasks', () => {
    it('should create a new task with valid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Integration Task' });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Integration Task');
    });

    it('should return 400 when required title is missing', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /tasks', () => {
    beforeEach(() => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      taskService.create({ title: 'Task 2', status: 'done' });
    });

    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app).get('/tasks?status=done');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe('done');
    });

    it('should return paginated results', async () => {
      for (let i = 3; i <= 15; i++) taskService.create({ title: `Task ${i}` });
      
      const res = await request(app).get('/tasks?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(5);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task successfully', async () => {
      const task = taskService.create({ title: 'Initial' });
      const res = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ title: 'Updated' });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).put('/tasks/invalid').send({ title: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH endpoints', () => {
    let task;
    beforeEach(() => {
      task = taskService.create({ title: 'Target' });
    });

    it('should mark task as complete', async () => {
      const res = await request(app).patch(`/tasks/${task.id}/complete`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
    });

    it('should assign a user successfully', async () => {
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: 'Bob' });
      
      expect(res.status).toBe(200);
      expect(res.body.assignee).toBe('Bob');
    });

    it('should return 400 for empty assignee', async () => {
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should remove the task', async () => {
      const task = taskService.create({ title: 'Delete Me' });
      const res = await request(app).delete(`/tasks/${task.id}`);
      expect(res.status).toBe(204);
      expect(taskService.getAll()).toHaveLength(0);
    });
  });

  describe('GET /tasks/stats', () => {
    it('should provide task metrics', async () => {
      taskService.create({ title: 'T1', status: 'todo' });
      const res = await request(app).get('/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body.todo).toBe(1);
    });
  });
});
