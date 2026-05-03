import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onCyclePriority: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete, onCyclePriority }: TaskItemProps) {
  const priorityClass = task.priority !== 'none' ? ` priority-${task.priority}` : '';

  return (
    <li className={`task-item${task.done ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`}
      />
      <span
        className={`priority-dot${priorityClass}`}
        aria-label={`Priority: ${task.priority}`}
        role="button"
        tabIndex={0}
        onClick={() => onCyclePriority(task.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCyclePriority(task.id);
          }
        }}
      />
      <span
        className="task-label"
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>
      <button
        className="task-delete"
        aria-label={`Delete "${task.text}"`}
        onClick={() => onDelete(task.id)}
      >
        ×
      </button>
    </li>
  );
}