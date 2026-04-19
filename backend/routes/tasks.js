import express from 'express';
import {
  validateTaskCreate,
  validateTaskUpdate,
  validateListQuery,
} from '../middleware/validateTask.js';

const router = express.Router();

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };

function countsOf(list) {
  return {
    all: list.length,
    pending: list.filter((t) => !t.completed).length,
    completed: list.filter((t) => t.completed).length,
  };
}

function applyQuery(list, { filter, search, sort }) {
  let result = list;

  if (filter === 'pending') result = result.filter((t) => !t.completed);
  else if (filter === 'completed') result = result.filter((t) => t.completed);

  const q = search.toLowerCase();
  if (q) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }

  result = [...result].sort((a, b) => {
    if (sort === 'date') {
      const ax = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bx = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ax - bx;
    }
    if (sort === 'priority') return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (sort === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return result;
}

function daysFromNow(days) {
  if (days === undefined) return null;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const now = new Date().toISOString();

const tasks = [
  {
    id: 1,
    title: 'Welcome to Task Manager',
    description: 'Scroll through the carousel to see all your tasks.',
    completed: false,
    createdAt: now,
    priority: 'high',
    dueDate: daysFromNow(2),
  },
  {
    id: 2,
    title: 'Try editing a task',
    description: 'Click the edit button on any card.',
    completed: false,
    createdAt: now,
    priority: 'medium',
    dueDate: daysFromNow(5),
  },
  {
    id: 3,
    title: 'Mark tasks complete',
    description: 'Use the toggle to mark work as done.',
    completed: true,
    createdAt: now,
    priority: 'low',
    dueDate: daysFromNow(-1),
  },
  {
    id: 4,
    title: 'Filter and sort',
    description: 'Filter by status, sort by date/priority/title, search by keyword.',
    completed: false,
    createdAt: now,
    priority: 'medium',
    dueDate: null,
  },
  {
    id: 5,
    title: 'Switch views',
    description: 'Toggle between carousel and list view.',
    completed: false,
    createdAt: now,
    priority: 'high',
    dueDate: daysFromNow(7),
  },
];

let nextId = tasks.length + 1;

router.get('/', validateListQuery, (req, res) => {
  const filtered = applyQuery(tasks, req.validatedQuery);
  res.json({ tasks: filtered, counts: countsOf(tasks) });
});

router.get('/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.post('/', validateTaskCreate, (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = {
    id: nextId++,
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
    priority,
    dueDate: dueDate || null,
  };
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/:id', validateTaskUpdate, (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, priority, completed, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  res.json(task);
});

router.patch('/:id/toggle', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = !task.completed;
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const index = tasks.indexOf(task);
  const [removed] = tasks.splice(index, 1);
  res.json(removed);
});

export default router;
