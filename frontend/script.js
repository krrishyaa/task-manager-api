const API = "https://task-manager-api-dp4e.onrender.com";

/* ---------- LOGIN ---------- */
async function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const res = await fetch(`${API}/api/users/login/`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username: username,
password: password
})
});

const data = await res.json();

console.log("LOGIN RESPONSE:",data);

if(!res.ok){
console.error("Login failed:", data);
alert("Login failed: " + (data.detail || "Unknown error"));
return;
}

/* store access token */
if(data.access){
localStorage.setItem("token", data.access);
console.log("Token stored successfully");

/* go to dashboard */
window.location.href="dashboard.html";
} else {
console.error("No access token in response");
alert("No access token received");
}

}


/* ---------- REGISTER ---------- */
async function register(){

const username = document.getElementById("reg_username").value;
const email = document.getElementById("reg_email").value;
const password = document.getElementById("reg_password").value;

if(!username || !email || !password){
alert("Please fill in all fields");
return;
}

const res = await fetch(`${API}/api/users/register/`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username: username,
email: email,
password: password
})
});

const data = await res.json();

console.log("REGISTER RESPONSE:",data);

if(!res.ok){
console.error("Registration failed:", data);
alert("Registration failed: " + (data.username ? data.username[0] : data.detail || "Unknown error"));
return;
}

alert("Registration successful! Please login with your new account.");
window.location.href="login.html";

}


/* ---------- LOAD TASKS ---------- */
async function loadTasks(){

const token = localStorage.getItem("token");

if(!token){
window.location.href="login.html";
return;
}

const res = await fetch(`${API}/api/tasks/`,{
headers:{
"Authorization":`Bearer ${token}`
}
});

const data = await res.json();

console.log("TASK DATA:",data);

const list = document.getElementById("tasks");
const emptyState = document.getElementById("empty-state");

if(!list) return;

list.innerHTML="";

if(data.results && Array.isArray(data.results)){
if(data.results.length === 0){
emptyState.style.display = "block";
} else {
emptyState.style.display = "none";

// Sort tasks by priority: HIGH > MEDIUM > LOW
const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

const sortedTasks = [...data.results].sort((a, b) => {
const priorityA = priorityOrder[a.priority] || 0;
const priorityB = priorityOrder[b.priority] || 0;
return priorityB - priorityA;
});

sortedTasks.forEach(task=>{
const li = document.createElement("li");
const priorityClass = `${task.priority.toLowerCase()}-priority`;
li.className = `task-card ${task.status === 'COMPLETED' ? 'completed' : ''} ${priorityClass}`;

const completeEmoji = task.status === 'COMPLETED' ? '✅' : '☐';
const priorityClass2 = `priority-${task.priority.toLowerCase()}`;
const statusClass = `status-${task.status.toLowerCase()}`;

li.innerHTML = `
<div class="task-content">
    <button class="complete-btn" onclick="toggleCompleteTask(${task.id})">${completeEmoji}</button>
    <div class="task-info">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-meta">
            <span class="priority-badge ${priorityClass2}">${task.priority}</span>
            <span class="status-badge ${statusClass}">${task.status}</span>
        </div>
    </div>
</div>
<div class="task-actions">
    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑 Delete</button>
</div>
`;

list.appendChild(li);
});
}
} else {
console.error("Invalid task data format:", data);
}

updateStats(data.results || []);

}

/* ---------- UPDATE STATS ---------- */
function updateStats(tasks){
const totalTasks = tasks.length;
const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
const pendingTasks = totalTasks - completedTasks;

document.getElementById("total-tasks").innerText = totalTasks;
document.getElementById("completed-tasks").innerText = completedTasks;
document.getElementById("pending-tasks").innerText = pendingTasks;
}

/* ---------- ESCAPE HTML ---------- */
function escapeHtml(text) {
const map = {
'&': '&amp;',
'<': '&lt;',
'>': '&gt;',
'"': '&quot;',
"'": '&#039;'
};
return text.replace(/[&<>"']/g, m => map[m]);
}


/* ---------- CREATE TASK ---------- */
async function createTask(){

const token = localStorage.getItem("token");
const title = document.getElementById("title").value;
const priority = document.getElementById("priority").value;

if(!title){
alert("Please enter a task title");
return;
}

const res = await fetch(`${API}/api/tasks/`,{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body:JSON.stringify({
title:title,
priority:priority,
status:"PENDING"
})
});

const data = await res.json();

console.log("CREATE TASK RESPONSE:", data);

if(!res.ok){
console.error("Task creation failed:", data);
alert("Failed to create task");
return;
}

document.getElementById("title").value = "";

loadTasks();

}

/* ---------- DELETE TASK ---------- */
async function deleteTask(taskId){

if(!confirm("Are you sure you want to delete this task?")){
return;
}

const token = localStorage.getItem("token");

const res = await fetch(`${API}/api/tasks/${taskId}/`,{
method:"DELETE",
headers:{
"Authorization":`Bearer ${token}`
}
});

console.log("DELETE TASK RESPONSE:", res.status);

if(!res.ok){
console.error("Task deletion failed");
alert("Failed to delete task");
return;
}

loadTasks();

}

/* ---------- TOGGLE COMPLETE TASK ---------- */
async function toggleCompleteTask(taskId){

const token = localStorage.getItem("token");

// First get the current task to check its status
const getRes = await fetch(`${API}/api/tasks/${taskId}/`,{
headers:{
"Authorization":`Bearer ${token}`
}
});

const task = await getRes.json();
const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

const res = await fetch(`${API}/api/tasks/${taskId}/`,{
method:"PATCH",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},
body:JSON.stringify({
status:newStatus
})
});

const data = await res.json();

console.log("TOGGLE COMPLETE RESPONSE:", data);

if(!res.ok){
console.error("Task update failed:", data);
alert("Failed to update task");
return;
}

loadTasks();

}

/* ---------- LOGOUT ---------- */
function logout(){
localStorage.removeItem("token");
window.location.href="login.html";
}