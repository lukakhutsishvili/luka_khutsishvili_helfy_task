const SORT_OPTIONS = [
  { id: 'date', label: 'Date (due soonest)' },
  { id: 'priority', label: 'Priority (high → low)' },
  { id: 'title', label: 'Title (A → Z)' },
];

export default function Toolbar({ search, onSearchChange, sort, onSortChange, view, onViewChange }) {
  return (
    <div className="toolbar">
      <label className="toolbar__search">
        <span className="toolbar__search-icon">🔍</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks…"
        />
      </label>

      <label className="toolbar__select">
        <span>Sort</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </label>

      <div className="toolbar__view">
        <button
          type="button"
          className={`toolbar__view-btn ${view === 'carousel' ? 'is-active' : ''}`}
          onClick={() => onViewChange('carousel')}
        >
          Carousel
        </button>
        <button
          type="button"
          className={`toolbar__view-btn ${view === 'list' ? 'is-active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          List
        </button>
      </div>
    </div>
  );
}
