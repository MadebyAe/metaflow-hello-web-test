import { Task, Priority } from '../types'

interface StatsPageProps {
  tasks: Task[]
}

const PRIORITY_LABELS: Record<Priority, string> = {
  none: 'No priority',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low', 'none']

export function StatsPage({ tasks }: StatsPageProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.done).length
  const open = total - completed
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  const byPriority = PRIORITY_ORDER.filter((p) => p !== 'none')
    .map((p) => ({
      priority: p,
      label: PRIORITY_LABELS[p],
      total: tasks.filter((t) => t.priority === p).length,
      completed: tasks.filter((t) => t.priority === p && t.done).length,
    }))
    .filter((row) => row.total > 0)

  return (
    <div className="stats-page">
      <h2 className="stats-heading">Stats</h2>

      <div className="stats-cards">
        <div className="stats-card">
          <span className="stats-card__value">{total}</span>
          <span className="stats-card__label">Total</span>
        </div>
        <div className="stats-card stats-card--open">
          <span className="stats-card__value">{open}</span>
          <span className="stats-card__label">Open</span>
        </div>
        <div className="stats-card stats-card--done">
          <span className="stats-card__value">{completed}</span>
          <span className="stats-card__label">Completed</span>
        </div>
      </div>

      <div className="stats-progress">
        <div className="stats-progress__header">
          <span className="stats-progress__label">Overall progress</span>
          <span className="stats-progress__pct">{progress}%</span>
        </div>
        <div
          className="stats-progress__track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Task completion progress"
        >
          <div
            className="stats-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {byPriority.length > 0 && (
        <div className="stats-breakdown">
          <h3 className="stats-breakdown__title">By priority</h3>
          <ul className="stats-breakdown__list">
            {byPriority.map(({ priority, label, total: t, completed: c }) => {
              const pct = t === 0 ? 0 : Math.round((c / t) * 100)
              return (
                <li key={priority} className="stats-breakdown__item">
                  <div className="stats-breakdown__meta">
                    <span
                      className={`priority-dot priority-${priority}`}
                      aria-hidden="true"
                    />
                    <span className="stats-breakdown__name">{label}</span>
                    <span className="stats-breakdown__count">
                      {c}/{t}
                    </span>
                    <span className="stats-breakdown__pct">{pct}%</span>
                  </div>
                  <div
                    className="stats-progress__track stats-progress__track--sm"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${label} priority completion`}
                  >
                    <div
                      className={`stats-progress__fill stats-progress__fill--${priority}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {total === 0 && (
        <p className="stats-empty">No tasks yet — add some to see your stats.</p>
      )}
    </div>
  )
}