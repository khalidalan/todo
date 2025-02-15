import {
  AppElement,
  darkThemeToggle,
  getCheckboxElements,
  inputElement,
  TaskListElement,
  TaskListLink,
} from "./scripts/elements";

const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const toggleDarkMode = () => {
  AppElement.classList.toggle("App--isDark");
  saveToDB("darkModeFlag", AppElement.classList.contains("App--isDark"));
};

darkThemeToggle.addEventListener("click", toggleDarkMode);

const renderTasksList = (tasks) => {
 
  let taskList = "";
  tasks.forEach((task, index) => {
    taskList += `
      <li class="TaskList__taskContent${task.isCompleted ? " TaskList__taskContent--isActive" : ""}">
        <div class='TaskList__checkbox' tabindex="0" role="button">
          <img class='TaskList__checkboxImg' src="./assets/icon-checkmark.svg" alt="checkmark" />
        </div>
        <div class='TaskList__valueContent'>
          <p class='TaskList__value'>${task.value}</p>
          <img src="./assets/icon-basket.svg" class="TaskList__deleteIcon" data-index="${index}" alt="basket-icon" />
        </div>
      </li>
    `;
  });

  TaskListElement.innerHTML = taskList;
  initTaskListener();
};

const deleteTask = (e) => {
  if (!confirm("هل تريد حذف هذه المهمة؟")) return;

  let tasks = fetchData("tasks");
  const index = parseInt(e.target.getAttribute("data-index"), 10);

  tasks.splice(index, 1);
  saveToDB("tasks", tasks);


  if (tasks.length) {
    renderTasksList(tasks);
} else {
    renderEmptyState();
}
};

const initTaskListener = () => {
  document.querySelectorAll(".TaskList__deleteIcon").forEach((icon) => {
    icon.addEventListener("click", deleteTask);
  });

  getCheckboxElements().forEach((box , index) =>{
    box.addEventListener("click" ,(e) => toggleTask(e, index));
    box.addEventListener("keydown" ,(e) => e.key === "Enter" && toggleTask(e, index));
  })
};

const addTask = (e) => {
  e.preventDefault();
  const taskValue = inputElement.value.trim();
  if (!taskValue) return;

  const task = { value: taskValue, isCompleted: false };
  let tasks = fetchData("tasks");

  tasks.push(task);
  saveToDB("tasks", tasks);
  renderTasksList(tasks);
  inputElement.value = "";
};

document.querySelector(".TaskSearchBar__button").addEventListener("click", addTask);

const initDataOnStartup = () => {
  const tasks = fetchData("tasks");

  if (fetchData("darkModeFlag")) {
      AppElement.classList.add("App--isDark");
  }

  if (fetchData("hideCompletedTasks")) {
    TaskListElement.classList.add("TaskList__list--hideCompleted");
    TaskListLink.classList.add("TaskList__link--isActive");
}


  if (tasks.length) {
      renderTasksList(tasks);
      initTaskListener();
  } else {
      renderEmptyState();
  }
};


const renderEmptyState = () => {
  TaskListElement.innerHTML = `<li class="EmptyList">
    <img class="EmptyList__img" src="./assets/icon-empty.svg" alt="empty list" />
    <p class="EmptyList">قائمة المهام فارغة</p>
  </li>
  `;
}


const toggleTask = (e , index) => {
  const tasks = fetchData("tasks");
  
  tasks[index].isCompleted = !tasks[index].isCompleted;
  saveToDB("tasks", tasks);

  renderTasksList(tasks);
}

TaskListLink.addEventListener("click", () => {
  TaskListElement?.classList.toggle("TaskList__list--hideCompleted");
  TaskListLink?.classList.toggle("TaskList__link--isActive");

  saveToDB("hideCompletedTasks",isHidden);
})



initDataOnStartup();


