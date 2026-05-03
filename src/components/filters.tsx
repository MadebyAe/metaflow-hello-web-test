import { Filter } from '../types';

interface FiltersProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function Filters({ currentFilter, onFilterChange }: FiltersProps) {
  return (
    <div id="filters" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          className={`filter-btn${currentFilter === value ? ' filter-btn--active' : ''}`}
          aria-pressed={currentFilter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}