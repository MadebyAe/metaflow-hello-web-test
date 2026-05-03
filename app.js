const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const status = document.getElementById('status');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const PRIORITY_CYCLE = ['none', 'low', 'medium', 'high'];

const nextPriority = (current) => {
  const idx = PRIORITY_CYCLE.indexOf(current ?? 'none');
  return PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
};

const updateStatus = () => {
  const remaining = tasks.filter(t => !t.done).length;
  status.textContent = tasks.length === 0
    ? ''
    : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
  document.title = remaining > 0 ? `(${remaining}) Tasks` : 'Tasks';
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

const render = () => {
  list.innerHTML = '';
  tasks.forEach(task => list.appendChild(renderTask(task)));
  updateStatus();
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

const cycleTaskPriority = (id) => {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, priority: nextPriority(t.priority) } : t
  );
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