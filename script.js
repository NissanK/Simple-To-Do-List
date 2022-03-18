const addTaskBtn = document.getElementById('add-task');
const deleteAllBtn = addTaskBtn.nextElementSibling;
const backdrop = document.getElementById('backdrop');

const addTaskModal = document.getElementById('add-modal');
const deleteAllModal = addTaskModal.nextElementSibling;
const removeTaskModal = deleteAllModal.nextElementSibling;
const completedTaskModal = removeTaskModal.nextElementSibling;

const buttonsAddModal = addTaskModal.getElementsByTagName('button');
const confirmTaskAddBtn = buttonsAddModal[0];
const cancelAddBtn = buttonsAddModal[1];

const buttonsDeleteAllModal = deleteAllModal.getElementsByTagName('button');
const confirmDeleteAllBtn = buttonsDeleteAllModal[0];
const cancelDeleteAllBtn = buttonsDeleteAllModal[1];

const buttonsRemoveTaskModal = removeTaskModal.getElementsByTagName('button');
const confirmRemoveBtn = buttonsRemoveTaskModal[0];
const cancelRemoveBtn = buttonsRemoveTaskModal[1];

const tasksSection = document.getElementById('elements');

const userInputs = addTaskModal.firstElementChild.getElementsByTagName('input');

let tasks = [];
retreiveTasks();

function retreiveTasks(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if(!tasks){
        tasks = [];
    }
    else{
        console.log(tasks);
        for(const task of tasks){
            updateTasksUI(task.name,task.deadline,task.description);
        }
    }
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function addTaskHandler(){
    backdropToggler();
    addTaskModal.classList.toggle('visible');
}

function backdropToggler(){
    backdrop.classList.toggle('visible');
}

function deleteCurrentTask(currTask,taskName){
    let toDelete = 0;
    tasks = JSON.parse(localStorage.getItem("tasks"));

    for(const task of tasks){
        if(task.name == taskName){
            break;
        }
        toDelete++;
    }
    tasks.splice(toDelete,1);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    currTask.remove();
    cancelRemoveTask();
}

function removeTaskModalHandler(currTask,taskName){

    removeTaskModal.firstElementChild.firstElementChild.textContent = `Are you sure you want to delete ${taskName}?`
    backdropToggler();
    removeTaskModal.classList.add('visible')

    confirmRemoveBtn.addEventListener('click',deleteCurrentTask.bind(null,currTask,taskName));
    cancelRemoveBtn.addEventListener('click',cancelRemoveTask);
}

function cancelRemoveTask(){
    if(removeTaskModal.classList.contains('visible')){
        backdropToggler();
        removeTaskModal.classList.remove('visible');
    }
}

function hideCompletedModal(){
    if(completedTaskModal.classList.contains('visible')){
        completedTaskModal.classList.remove('visible');
        backdropToggler();
    }
}

function completeCurrentTask(currTask,taskName){
    completedTaskModal.firstElementChild.firstElementChild.innerHTML = `Congratulations on completing ${taskName}!!`;
    backdropToggler();
    completedTaskModal.classList.add('visible');

    deleteCurrentTask(currTask,taskName);

    setTimeout(() => {
        hideCompletedModal();
    }, 5000);
}

function updateTasksUI(taskName,taskDeadline,taskDescription){
    const newTask = document.createElement('div');
    newTask.className = 'element visible';
    newTask.innerHTML = `
        <div class="element-body">
            <div class="element-head">
                <h3 class="element-heading">${taskName}</h3>
                <h4 class="element-date">${taskDeadline}</h4>
            </div>
            <div class="element-desc">
                ${taskDescription}
            </div>
        </div>

        <div class="element-buttons">
            <button class="element-btn check"><i class="fa-solid fa-check"></i></button>
            <button class="element-btn uncheck"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `
    tasksSection.appendChild(newTask);

    const newTaskButtons = newTask.querySelectorAll('button');
    const completeTaskBtn= newTaskButtons[0];
    const deleteTaskBtn = newTaskButtons[1];

    completeTaskBtn.addEventListener('click',completeCurrentTask.bind(null,newTask,taskName));
    deleteTaskBtn.addEventListener('click',removeTaskModalHandler.bind(null,newTask,taskName));
}

function DeadlineChanger(deadline){
    const year = deadline.slice(2,4);
    const month = deadline.slice(5,7);
    const date = deadline.slice(8);
    return `${date}-${month}-${year}`;
}

function confirmTask(){
    const taskName = userInputs[0].value;
    let taskDeadline = userInputs[1].value;
    const taskDescription = userInputs[2].value;

    // if(taskName.length() > )

    if(taskName.trim() === '' && taskDeadline === ''){
        alert('Please fill out the Name and Deadline Fields!');
        return;
    }

    else if(taskName.trim()===''){
        alert('Please fill out the Name Field!');
        return;
    }

    else if(taskDeadline ===''){
        alert('Please fill out the Deadline Field!');
        return;
    }
    taskDeadline = DeadlineChanger(taskDeadline);
    let task = {
        name : taskName,
        deadline : taskDeadline,
        description : taskDescription
    };

    tasks = JSON.parse(localStorage.getItem("tasks"));
    if(!tasks){
        tasks = [];
    }
    tasks.push(task);
    localStorage.setItem("tasks",JSON.stringify(tasks));

    clearTaskHandler();
    updateTasksUI(taskName,taskDeadline,taskDescription);
}

function clearTaskHandler(){
    if(addTaskModal.classList.contains('visible')){
        backdropToggler();
        addTaskModal.classList.remove('visible');
        for(let element of userInputs){
            element.value = "";
        }
    }
}

function backdropBackgroundHandler(){
    clearTaskHandler();
    cancelDeleteAll();
    cancelRemoveTask();
    hideCompletedModal();
}

// delete All tasks button script

function deleteAllHandler(){
    backdropToggler();
    deleteAllModal.classList.add('visible');
}

function cancelDeleteAll(){
    if(deleteAllModal.classList.contains('visible')){
        backdropToggler();
        deleteAllModal.classList.remove('visible');
    }
}

function deleteAllTasks(){

    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = [];
    localStorage.setItem("tasks",JSON.stringify(tasks));

    tasksSection.textContent = '';
    cancelDeleteAll();
}


addTaskBtn.addEventListener('click',addTaskHandler);
backdrop.addEventListener('click',backdropBackgroundHandler);
cancelAddBtn.addEventListener('click',clearTaskHandler);
confirmTaskAddBtn.addEventListener('click',confirmTask);

deleteAllBtn.addEventListener('click',deleteAllHandler);
cancelDeleteAllBtn.addEventListener('click',cancelDeleteAll);
confirmDeleteAllBtn.addEventListener('click',deleteAllTasks);