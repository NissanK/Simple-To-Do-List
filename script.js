const addTaskBtn = document.getElementById('add-task');
const deleteAllBtn = addTaskBtn.nextElementSibling;
const backdrop = document.getElementById('backdrop');

const addTaskModal = document.getElementById('add-modal');
const deleteAllModal = addTaskModal.nextElementSibling;
const removeTaskModal = deleteAllModal.nextElementSibling;
const textModal = removeTaskModal.nextElementSibling;
const taskInfoModel = textModal.nextElementSibling;
const editTaskModal = taskInfoModel.nextElementSibling;

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
const userTextArea = document.getElementById('task-desc');

const editInputs = editTaskModal.getElementsByTagName('input');
const editTextArea = document.getElementById('edit-task-desc');

const infoBtn = document.querySelector('.info-btn');
let tasks = [];
retreiveTasks();

function retreiveTasks(){
    const elementSection = document.getElementById('elements');
    elementSection.innerHTML = ``;
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if(!tasks){
        tasks = [];
    }
    else{
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

function hideTextModal(){
    if(textModal.classList.contains('visible')){
        textModal.classList.remove('visible');
        backdropToggler();
    }
}

function completeCurrentTask(currTask,taskName){
    textModal.firstElementChild.innerHTML = `<h3>Congratulations on completing ${taskName}!!</h3>`;
    backdropToggler();
    textModal.classList.add('visible');

    deleteCurrentTask(currTask,taskName);

    setTimeout(() => {
        hideTextModal();
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
    let taskInfoBtn = newTask.firstElementChild;

    taskInfoBtn.replaceWith(taskInfoBtn.cloneNode(true));
    taskInfoBtn = newTask.firstElementChild;
    
    completeTaskBtn.addEventListener('click',completeCurrentTask.bind(null,newTask,taskName));
    deleteTaskBtn.addEventListener('click',removeTaskModalHandler.bind(null,newTask,taskName));
    taskInfoBtn.addEventListener('dblclick',displayInfo.bind(null,newTask,taskName,taskDeadline,taskDescription));
}

function deadlineChanger(deadline){
    let year = deadline.slice(0,4);
    const month = deadline.slice(5,7);
    const date = deadline.slice(8);
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = String(today.getFullYear());
    if(yyyy>year){
        return undefined;
    }else if(yyyy==year){
        if(mm>month){
            return undefined;
        }
        else if(month==mm){
            if(dd>date){
                return undefined;
            }
        }
    }
    year = year.slice(0,4);
    return `${date}-${month}-${year}`;
}

function displayInfo(taskUI,name,deadline,description){
    taskInfoModel.classList.add('visible');
    const taskList = taskInfoModel.firstElementChild.children;
    const nameDisplay = taskList[1];
    const deadlineDisplay = taskList[3];
    const descriptionDisplay = taskList[5];
    if(!description.length) descriptionDisplay.innerHTML = `NULL`;
    else descriptionDisplay.innerHTML = `${description}`;
    nameDisplay.innerHTML = `${name}`;
    deadlineDisplay.innerHTML = `${deadline}`;
    backdropToggler();

    let editTaskBtn = taskInfoModel.firstElementChild.nextElementSibling.firstElementChild;

    editTaskBtn.replaceWith(editTaskBtn.cloneNode(true));
    editTaskBtn = taskInfoModel.firstElementChild.nextElementSibling.firstElementChild;

    let x = editTask.bind(null,taskUI,name);
    editTaskBtn.addEventListener('click',x);
}

function convertDeadline(deadline){
    // converts deadline to a proper date format
    let year = deadline.slice(6);
    const month = deadline.slice(3,5);
    const day = deadline.slice(0,2);
    return `${year}-${month}-${day}`;
}

function editTask(taskUI,taskName){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    hideTaskInfo();
    let idx = 0;

    for(let i = 0;i<tasks.length;i++){
        if(tasks[i].name === taskName){            
            idx = i;
        }
    }
    const task = tasks[idx];

    editTaskModal.classList.add('visible');
    backdropToggler();
    let taskDeadline = task.deadline;
    taskDeadline = convertDeadline(taskDeadline);

    editInputs[0].value = task.name;
    editInputs[1].value = taskDeadline;
    editTextArea.value = task.description;

    editBtns = editTaskModal.getElementsByTagName('button');
    let editConfirmButton = editBtns[0];
    const editCancelButton = editBtns[1];

    editConfirmButton.replaceWith(editConfirmButton.cloneNode(true));
    editBtns = editTaskModal.getElementsByTagName('button');
    editConfirmButton = editBtns[0];

    editConfirmButton.addEventListener('click',editConfirmHandler.bind(null,taskUI,idx));
    editCancelButton.addEventListener('click',cancelEditHandler);
}

function editConfirmHandler(taskUI,idx){

    let deadline = editInputs[1].value;
    const name = editInputs[0].value;
    const desc = editTextArea.value;

    if(deadlineChanger(deadline) == undefined){
        editInputs[1].value = convertDeadline(tasks[idx].deadline);
        alert('Please Enter a Valid Date!');
        return;
    }
    
    if(!confirmTaskConditions(name,deadline,desc)){
        editInputs[0].value = tasks[idx].name;
        return;
    }
    const taskDate = deadlineChanger(editInputs[1].value)
    const task = {
        name : editInputs[0].value,
        deadline : taskDate,
        description : editTextArea.value
    };

    let nameUI = taskUI.firstElementChild.firstElementChild.firstElementChild;
    let dateUI = nameUI.nextElementSibling;
    let descUI = taskUI.firstElementChild.firstElementChild.nextElementSibling;
    
    nameUI.innerHTML = `<h3 class="element-heading">${task.name}</h3>`
    dateUI.innerHTML = `<h4 class="element-date">${taskDate}</h4>`
    descUI.innerHTML = `<div class="element-desc">
                            ${task.description}
                        </div>`;
    tasks[idx] = task;
    localStorage.setItem("tasks",JSON.stringify(tasks));

    retreiveTasks();
    cancelEditHandler();
}

function confirmTaskConditions(taskName,taskDeadline,taskDescription){

    if(taskName.trim() === '' && taskDeadline === ''){
        alert('Please fill out the Name and Deadline Fields!');
        return false;
    }

    else if(taskName.trim()===''){
        alert('Please fill out the Name Field!');
        return false;
    }

    else if(taskDeadline ===''){
        alert('Please fill out the Deadline Field!');
        return false;
    }

    if(taskDescription.length > 600){
        alert('Please Enter the Description in less than 600 characters!');
        return false;
    }

    if(taskName.length > 30){
        alert('Please Enter the Name in less than 30 characters!');
        return false;
    }

    return true;
}

function confirmTask(){
    const taskName = userInputs[0].value;
    let taskDeadline = userInputs[1].value;
    const taskDescription = userTextArea.value;
    taskDeadline = deadlineChanger(taskDeadline);
    if(taskDeadline == undefined){
        alert('Please Enter a Valid Date!');
        return;
    }

    if(!confirmTaskConditions(taskName,taskDeadline,taskDescription)){
        return;
    }

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
        userTextArea.value = "";
    }
}

function backdropBackgroundHandler(){
    cancelEditHandler();
    clearTaskHandler();
    cancelDeleteAll();
    cancelRemoveTask();
    hideTextModal();
    hideTaskInfo();
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

function cancelEditHandler(){
    if(editTaskModal.classList.contains('visible')){
        editTaskModal.classList.remove('visible');
        backdropToggler();
    }
}

function hideTaskInfo(){
    if(taskInfoModel.classList.contains('visible')){
        taskInfoModel.classList.remove('visible');
        backdropToggler();
    }
}

function deleteAllTasks(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if(!tasks.length){
        backdropToggler();
        textModal.firstElementChild.innerHTML = `<h3>No Tasks Found To Delete!</h3>`;
        textModal.classList.add('visible');
        cancelDeleteAll();
        return;
    }

    tasks = [];
    localStorage.setItem("tasks",JSON.stringify(tasks));

    tasksSection.textContent = '';
    cancelDeleteAll();
}

function infoDisplayer(){
    textModal.firstElementChild.innerHTML = `
    <h3> 1. Click the Add Task Button to Add a task.</h3>
    <br>
    <h3> 2. Click the Delete All Button to Delete All the tasks.</h3>
    <br>
    <h3> 3. Double Clicking a task allows you to view the task in a larger view and Edit the task.</h3>
    <br>
    <h3> 4. Every task can be Completed or Deleted.</h3>
    <h6 class="text-align-right"> Made By Nissan Kumar</h6>
    `;
    backdropToggler();
    textModal.classList.add('visible');
}

addTaskBtn.addEventListener('click',addTaskHandler);
backdrop.addEventListener('click',backdropBackgroundHandler);
cancelAddBtn.addEventListener('click',clearTaskHandler);
confirmTaskAddBtn.addEventListener('click',confirmTask);

deleteAllBtn.addEventListener('click',deleteAllHandler);
cancelDeleteAllBtn.addEventListener('click',cancelDeleteAll);
confirmDeleteAllBtn.addEventListener('click',deleteAllTasks);

infoBtn.addEventListener('click',infoDisplayer);