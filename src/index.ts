// Accessing the elements
const taskInput = document.getElementById(
  "taskInput"
) as HTMLInputElement | null;
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList") as HTMLUListElement | null;

// defining interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Defining
type filter = "All" | "Active" | "Completed";
let tasks: Task[] = [];
let currentFilter: filter = "All";

// load tasks
function loadTasks(): void {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// save to local storage
function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// render task
function renderTask(): void {
  if (!taskList) return;
  taskList.innerHTML = "";
  let filteredTask = tasks;

  if (currentFilter === "Active") {
    filteredTask = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "Completed") {
    filteredTask = tasks.filter((t) => t.completed);
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
      tasks = tasks.filter((t) => t.id !== task.id);
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
renderTask();
