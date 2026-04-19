import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import TaskList from './components/TaskList.jsx';
import TaskListView from './components/TaskListView.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import Toolbar from './components/Toolbar.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { api } from './services/api.js';
import { useLocalStorage, storage } from './services/storage.js';

const SEARCH_DEBOUNCE_MS = 250;
const VALID_FILTERS = ['all', 'pending', 'completed'];
const VALID_SORTS = ['date', 'priority', 'title'];

function initialCounts(tasks) {
  return {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };
}

function readUrlState() {
  const p = new URLSearchParams(window.location.search);
  const filter = p.get('filter');
  const sort = p.get('sort');
  return {
    filter: VALID_FILTERS.includes(filter) ? filter : 'all',
    search: p.get('search') ?? '',
    sort: VALID_SORTS.includes(sort) ? sort : 'date',
  };
}

function writeUrlState({ filter, search, sort }) {
  const p = new URLSearchParams();
  if (filter !== 'all') p.set('filter', filter);
  if (search) p.set('search', search);
  if (sort !== 'date') p.set('sort', sort);
  const qs = p.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export default function App() {
  const cachedTasks = storage.read('tasks', []);
  const [tasks, setTasks] = useState(cachedTasks);
  const [counts, setCounts] = useState(() => initialCounts(cachedTasks));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [filter, setFilter] = useState(() => readUrlState().filter);
  const [search, setSearch] = useState(() => readUrlState().search);
  const [sort, setSort] = useState(() => readUrlState().sort);
  const [view, setView] = useLocalStorage('view', 'carousel');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    writeUrlState({ filter, search: debouncedSearch, sort });
  }, [filter, debouncedSearch, sort]);

  useEffect(() => {
    const onPopState = () => {
      const next = readUrlState();
      setFilter(next.filter);
      setSearch(next.search);
      setSort(next.sort);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    storage.write('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    const data = await api.list({ filter, search: debouncedSearch, sort });
    setTasks(Array.isArray(data?.tasks) ? data.tasks : []);
    setCounts(data?.counts ?? { all: 0, pending: 0, completed: 0 });
    return data;
  }, [filter, debouncedSearch, sort]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        await fetchTasks();
      } catch (err) {
        if (!cancelled) toast.error(err.message || 'Failed to load tasks');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchTasks]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await api.update(editingTask.id, values);
        setEditingTask(null);
        toast.success('Task updated');
      } else {
        await api.create(values);
        toast.success('Task added');
      }
      await fetchTasks();
    } catch (err) {
      toast.error(err.message || 'Could not save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.toggle(id);
      await fetchTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      if (editingTask?.id === id) setEditingTask(null);
      toast.success('Task deleted');
      await fetchTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Task Manager</h1>
          <p className="app__subtitle">
            A calm place to capture, prioritise, and complete your work.
          </p>
        </div>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>

      <main className="app__main">
        <section className="panel">
          <h2 className="panel__title">
            {editingTask ? 'Edit task' : 'Add a new task'}
          </h2>
          <TaskForm
            editingTask={editingTask}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingTask(null)}
            isSubmitting={isSubmitting}
          />
        </section>

        <section className="panel">
          <div className="panel__row">
            <h2 className="panel__title">Your tasks</h2>
            <TaskFilter value={filter} onChange={setFilter} counts={counts} />
          </div>

          <Toolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />

          {isLoading && tasks.length === 0 ? (
            <div className="loading">Loading tasks…</div>
          ) : view === 'carousel' ? (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <Toaster position="bottom-right" richColors theme={theme} />
    </div>
  );
}
