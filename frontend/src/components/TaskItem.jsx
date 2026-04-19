import { toast } from 'sonner';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDueInfo(iso, completed) {
  if (!iso) return null;
  const due = new Date(iso);
  if (isNaN(due.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (completed) return { label: `Due ${formatDate(iso)}`, tone: 'neutral' };
  if (diffDays < 0) return { label: `Overdue · ${formatDate(iso)}`, tone: 'overdue' };
  if (diffDays === 0) return { label: 'Due today', tone: 'today' };
  if (diffDays === 1) return { label: 'Due tomorrow', tone: 'soon' };
  if (diffDays <= 7) return { label: `Due in ${diffDays} days`, tone: 'soon' };
  return { label: `Due ${formatDate(iso)}`, tone: 'neutral' };
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const handleDelete = () => {
    toast(`Delete "${task.title}"?`, {
      description: 'This action cannot be undone.',
      duration: 8000,
      action: {
        label: 'Delete',
        onClick: () => onDelete(task.id),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const dueInfo = getDueInfo(task.dueDate, task.completed);

  return (
    <article className={`task-card priority-${task.priority} ${task.completed ? 'is-completed' : ''}`}>
      <div className="task-card__header">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className="task-card__date">{formatDate(task.createdAt)}</span>
      </div>

      <h3 className="task-card__title">{task.title}</h3>
      {task.description && <p className="task-card__description">{task.description}</p>}

      {dueInfo && (
        <div className={`due-pill due-pill--${dueInfo.tone}`}>
          {dueInfo.label}
        </div>
      )}

      <div className="task-card__actions">
        <label className="toggle">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span>{task.completed ? 'Completed' : 'Mark complete'}</span>
        </label>

        <div className="task-card__buttons">
          <button type="button" className="btn btn--ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" className="btn btn--danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
