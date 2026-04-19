const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

export default function TaskFilter({ value, onChange, counts }) {
  return (
    <div className="filter">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter__btn ${value === filter.id ? 'is-active' : ''}`}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
          <span className="filter__count">{counts[filter.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
