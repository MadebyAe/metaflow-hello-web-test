const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const statusText = document.getElementById('status-text');
const clearBtn = document.getElementById('clear-completed');

const PRIORITIES = ['high', 'medium', 'low'];

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Migrate legacy tasks that lack a priority field
tasks = tasks.map(t => ({
  priority: 'medium',
  ...t,
}));

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const updateStatus = () => {
  const remaining = tasks.filter(t => !t.done).length;
  const completedCount = tasks.filter(t => t.done).length;

  statusText.textContent = tasks.length === 0
    ? ''
    : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;

  clearBtn.hidden = completedCount === 0;
};

const renderTask = (task) => {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const label = document.createElement('span');
  label.className = 'task-label';
  label.textContent = task.text;
  label.addEventListener('click', () => toggleTask(task.id));

  const priority = document.createElement('span');
  priority.className = 'task-priority';
  priority.dataset.priority = task.priority;
  priority.title = `Priority: ${task.priority} — click to change`;
  priority.addEventListener('click', () => cyclePriority(task.id));

  const del = document.createElement('button');
  del.className = 'task-delete';
  del.textContent = '×';
  del.setAttribute('aria-label', 'Delete task');
  del.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, label, priority, del);
  return li;
};

const render = () => {
  list.innerHTML = '';
  tasks.forEach(task => list.appendChild(renderTask(task)));
  updateStatus();
};

const addTask = (text) => {
  tasks.push({ id: Date.now(), text, done: false, priority: 'medium' });
  save();
  render();
};

const toggleTask = (id) => {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
};

const cyclePriority = (id) => {
  tasks = tasks.map(t => {
    if (t.id !== id) return t;
    const next = PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % PRIORITIES.length];
    return { ...t, priority: next };
  });
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = '';
  }
});

clearBtn.addEventListener('click', clearCompleted);

render();