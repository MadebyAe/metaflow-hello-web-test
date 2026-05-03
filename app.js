const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const status = document.getElementById('status');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const updateStatus = () => {
  const remaining = tasks.filter(t => !t.done).length;
  status.textContent = tasks.length === 0
    ? ''
    : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
};

const PRIORITIES = [null, 'low', 'medium', 'high'];

const cyclePriority = (id) => {
  tasks = tasks.map(t => {
    if (t.id !== id) return t;
    const idx = PRIORITIES.indexOf(t.priority ?? null);
    const next = PRIORITIES[(idx + 1) % PRIORITIES.length];
    return { ...t, priority: next };
  });
  save();
  render();
};

const renderTask = (task) => {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const dot = document.createElement('span');
  dot.className = 'priority-dot';
  if (task.priority) dot.classList.add(`priority-${task.priority}`);
  dot.setAttribute('aria-label', task.priority ? `Priority: ${task.priority}` : 'Set priority');
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  dot.addEventListener('click', () => cyclePriority(task.id));
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cyclePriority(task.id);
    }
  });

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

const render = () => {
  list.innerHTML = '';
  tasks.forEach(task => list.appendChild(renderTask(task)));
  updateStatus();
};

const addTask = (text) => {
  tasks.push({ id: Date.now(), text, done: false, priority: null });
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = '';
  }
});

render();