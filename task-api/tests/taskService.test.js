const taskService = require('../src/services/taskService');

describe('Task Service Unit Tests', () => {
  beforeEach(() => {
    taskService.clearTasks();
  });

  describe('createTask', () => {
    it('should create a task with default values', () => {
      const task = taskService.create({ title: 'Test Task' });
      expect(task).toMatchObject({
        title: 'Test Task',
        status: 'todo',
        priority: 'medium',
        description: '',
      });
      expect(task.id).toBeDefined();
    });

    it('should create a task with provided values', () => {
      const data = {
        title: 'Project Alpha',
        description: 'Initial phase',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2025-12-31'
      };
      const task = taskService.create(data);
      expect(task).toMatchObject(data);
    });
  });

  describe('filtering and pagination', () => {
    beforeEach(() => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      taskService.create({ title: 'Task 2', status: 'in_progress' });
      taskService.create({ title: 'Task 3', status: 'todo' });
    });

    it('should filter tasks by status using exact match', () => {
      expect(taskService.getByStatus('todo')).toHaveLength(2);
      expect(taskService.getByStatus('done')).toHaveLength(0);
      expect(taskService.getByStatus('do')).toHaveLength(0);
    });

    it('should return paginated results starting from page 1', () => {
      for (let i = 4; i <= 15; i++) taskService.create({ title: `Task ${i}` });
      
      const page1 = taskService.getPaginated(1, 10);
      expect(page1).toHaveLength(10);
      expect(page1[0].title).toBe('Task 1');

      const page2 = taskService.getPaginated(2, 10);
      expect(page2).toHaveLength(5);
      expect(page2[0].title).toBe('Task 11');
    });
  });

  describe('task operations', () => {
    let task;
    beforeEach(() => {
      task = taskService.create({ title: 'Target Task', priority: 'high' });
    });

    it('should update task successfully', () => {
      const updated = taskService.update(task.id, { title: 'Updated' });
      expect(updated.title).toBe('Updated');
    });

    it('should remove task successfully', () => {
      expect(taskService.remove(task.id)).toBe(true);
      expect(taskService.getAll()).toHaveLength(0);
    });

    it('should mark task as complete without losing metadata', () => {
      const completed = taskService.completeTask(task.id);
      expect(completed.status).toBe('done');
      expect(completed.priority).toBe('high');
      expect(completed.completedAt).toBeDefined();
    });

    it('should assign a user to the task', () => {
      const assigned = taskService.assignTask(task.id, 'Alice');
      expect(assigned.assignee).toBe('Alice');
    });
  });

  describe('task statistics', () => {
    it('should calculate correct stats including overdue tasks', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      taskService.create({ title: 'T1', status: 'todo', dueDate: pastDate.toISOString() });
      taskService.create({ title: 'T2', status: 'in_progress' });
      taskService.create({ title: 'T3', status: 'done' });
      
      const stats = taskService.getStats();
      expect(stats).toEqual({
        todo: 1,
        in_progress: 1,
        done: 1,
        overdue: 1
      });
    });
  });
});
