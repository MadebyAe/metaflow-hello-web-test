const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const status = document.getElementById('status');
const clearBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const PRIORITY_CYCLE = ['none', 'low', 'medium', 'high'];

const nextPriority = (current) => {
  const idx = PRIORITY_CYCLE.indexOf(current ?? 'none');
  return PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
};

const getFilteredTasks = () => {
  if (currentFilter === 'active') return tasks.filter(t => !t.done);
  if (currentFilter === 'completed') return tasks.filter(t => t.done);
  return tasks;
};

const updateStatus = () => {
  const remaining = tasks.filter(t => !t.done).length;
  const completed = tasks.length - remaining;

  let statusText = document.getElementById('status-text');
  if (!statusText) {
    statusText = document.createElement('span');
    statusText.id = 'status-text';
    status.insertBefore(statusText, clearBtn);
  }

  statusText.textContent = tasks.length === 0
    ? ''
    : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;

  clearBtn.hidden = completed === 0;
  document.title = remaining > 0 ? `(${remaining}) Tasks` : 'Tasks';
};

const updateFilterButtons = () => {
  filterBtns.forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.dataset.filter === currentFilter);
  });
};

const renderTask = (task) => {
  const priority = task.priority ?? 'none';

  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const dot = document.createElement('span');
  dot.className = `priority-dot${priority !== 'none' ? ` priority-${priority}` : ''}`;
  dot.setAttribute('aria-label', `Priority: ${priority}`);
  dot.addEventListener('click', () => cycleTaskPriority(task.id));

  const label = document.createElement('span');
  label.className = 'task-label';
  label.textContent = task.text;
  label.addEventListener('click', () => toggleTask(task.id));

  const del = document.createElement('button');
  del.className = 'task-delete';
  del.textContent = '×';
  del.setAttribute('aria-label', 'Delete task');
  del.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, dot, label, del);
  return li;
};

const renderEmptyState = (message) => {
  const li = document.createElement('li');
  li.className = 'empty-state';
  li.textContent = message;
  return li;
};

const render = () => {
  const visibleTasks = getFilteredTasks();

  list.innerHTML = '';

  if (tasks.length === 0) {
    list.appendChild(renderEmptyState('No tasks yet — add one above'));
  } else if (visibleTasks.length === 0) {
    list.appendChild(renderEmptyState('No tasks match this filter'));
  } else {
    visibleTasks.forEach(task => list.appendChild(renderTask(task)));
  }

  updateStatus();
  updateFilterButtons();
};

const addTask = (text) => {
  tasks.push({ id: Date.now(), text, done: false, priority: 'none' });
  save();
  render();
};

const toggleTask = (id) => {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
};

const deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
};

const clearCompleted = () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
};

const cycleTaskPriority = (id) => {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, priority: nextPriority(t.priority) } : t
  );
  save();
  render();
};

const submitForm = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = '';
  }
};

form.addEventListener('submit', submitForm);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitForm(e);
  }
});

clearBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();