import TaskItem from './TaskItem.jsx';

// Infinite carousel: render the task list twice so the CSS animation can scroll
// from 0 to -50% and loop seamlessly. Pauses on hover via CSS.
export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="carousel carousel--empty">
        <div className="empty-state">
          <h3>No tasks to show</h3>
          <p>Add your first task above to see the carousel come to life.</p>
        </div>
      </div>
    );
  }

  // Slower speed when there are fewer tasks so they don't zoom past.
  const durationSeconds = Math.max(tasks.length * 4, 15);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {tasks.map((task) => (
          <div className="carousel-slide" key={`a-${task.id}`}>
            <TaskItem task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
        {tasks.map((task) => (
          <div className="carousel-slide" key={`b-${task.id}`} aria-hidden="true">
            <TaskItem task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
      <div className="carousel-hint">Hover to pause</div>
    </div>
  );
}
