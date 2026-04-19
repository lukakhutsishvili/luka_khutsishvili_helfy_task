import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};


function toDateInputValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TaskForm({ editingTask, onSubmit, onCancelEdit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: toDateInputValue(editingTask.dueDate),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [editingTask]);

  function updateField(fieldName, newValue) {
    setForm({ ...form, [fieldName]: newValue });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    if (!title) {
      setError('Title is required');
      return;
    }

    const payload = {
      title: title,
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };

    try {
      await onSubmit(payload);
      setError('');
      if (!editingTask) {
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  }

  const submitLabel = editingTask ? 'Save changes' : 'Add task';
  const isEditing = Boolean(editingTask);

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__row">
        <label className="field field--grow">
          <span>Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="e.g. Ship the quarterly report"
            maxLength={120}
          />
        </label>

        <label className="field">
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="field">
          <span>Due date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Add any helpful context (optional)"
          rows={2}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {submitLabel}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
