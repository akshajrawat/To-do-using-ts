// Accessing the elements
const taskInput = document.getElementById(
  "taskInput"
) as HTMLInputElement | null;
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList") as HTMLUListElement | null;
const filterAll = document.getElementById(
  "filterAll"
) as HTMLButtonElement | null;
const filterCompleted = document.getElementById("filterCompleted");
const filterActive = document.getElementById("filterActive");
const resetAll = document.getElementById("resetAll");

// defining interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Defining
type filter = "All" | "Active" | "Completed";
let tasks: Task[] = [];
let currentFilter: filter;

// load tasks
function loadTasks(): void {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  let loadFilter = localStorage.getItem("filter");
  if (loadFilter === "Completed") {
    currentFilter = "Completed";
  } else if (loadFilter === "Active") {
    currentFilter = "Active";
  } else {
    currentFilter = "All";
  }
}

// save to local storage
function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter
function filterRemover(): void {
  filter.forEach((item) => {
    if (!item) return;
    item?.classList.remove("bg-blue-500", "text-white");
    item?.classList.add("bg-gray-300", "dark:bg-gray-700");
  });
}

function filterClassHandler(active: HTMLElement | null): void {
  filterRemover();
  active?.classList.remove("bg-gray-300", "dark:bg-gray-700");
  active?.classList.add("bg-blue-500", "text-white");
}

// render task
function renderTask(): void {
  if (!taskList) return;
  taskList.innerHTML = "";
  let filteredTask = tasks;

  if (currentFilter === "Active") {
    filterClassHandler(filterActive);
    filteredTask = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "Completed") {
    filterClassHandler(filterCompleted);
    filteredTask = tasks.filter((t) => t.completed);
  } else {
    filterClassHandler(filterAll);
  }

  filteredTask.forEach((task) => {
    const list: HTMLElement = document.createElement("li");
    const span: HTMLElement = document.createElement("span");
    const button: HTMLElement = document.createElement("button");

    list.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "bg-gray-100",
      "dark:bg-gray-700",
      "px-4",
      "py-2",
      "rounded-md"
    );
    span.classList.add("text-gray-800", "dark:text-white");
    span.textContent = task.text;
    button.classList.add("text-red-500", "hover:text-red-700", "font-semibold");
    button.textContent = "Delete";

    button.addEventListener("click", () => {
      task.completed = true;
      saveTasks();
      renderTask();
    });

    list.appendChild(span);
    list.appendChild(button);

    if (!taskList) {
      return;
    }
    taskList.appendChild(list);
  });
}

// add task
function addTask(): void {
  if (!taskInput) {
    return;
  }
  const value: string = taskInput.value;

  if (value.trim() === "") {
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text: value,
    completed: false,
  });

  saveTasks();
  renderTask();
  taskInput.value = "";
}

addTaskBtn?.addEventListener("click", addTask);

// Changing Filter
const filter: (HTMLElement | null)[] = [
  filterAll,
  filterActive,
  filterCompleted,
];

function filterHandler(active: HTMLElement | null) {
  filterClassHandler(active);
  if (active === filterCompleted) {
    currentFilter = "Completed";
    renderTask();
  } else if (active === filterActive) {
    currentFilter = "Active";
    renderTask();
  } else {
    currentFilter = "All";
    renderTask();
  }
  localStorage.setItem("filter", currentFilter);
}

filterAll?.addEventListener("click", () => filterHandler(filterAll));

filterActive?.addEventListener("click", () => filterHandler(filterActive));

filterCompleted?.addEventListener("click", () =>
  filterHandler(filterCompleted)
);

// reset all
resetAll?.addEventListener("click", () => {
  localStorage.removeItem("tasks");
  tasks = [];
  renderTask();
});

// Calling
loadTasks();
renderTask();
