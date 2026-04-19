import TaskItem from './TaskItem.jsx';

export default function TaskListView({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks to show</h3>
        <p>Try changing filters or add a new task above.</p>
      </div>
    );
  }

  return (
    <div className="list-view">
      <ul className="list-view__items">
        {tasks.map((task) => (
          <li key={task.id} className="list-view__row">
            <div className="list-view__card">
              <TaskItem task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
