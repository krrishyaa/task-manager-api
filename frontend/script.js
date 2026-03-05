const API = "https://task-manager-api-dp4e.onrender.com";

/* ---------- LOGIN ---------- */
async function login() {

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const response = await fetch(`${API}/api/users/login/`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
username,
password
})
});

const data = await response.json();

localStorage.setItem("token", data.access);

window.location.href = "dashboard.html";
}


/* ---------- LOAD TASKS ---------- */
async function loadTasks(){

const token = localStorage.getItem("token");

const res = await fetch(`${API}/api/tasks/`,{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

const list = document.getElementById("tasks");

if(!list) return;

list.innerHTML="";

data.results.forEach(task=>{
const li=document.createElement("li");
li.innerText = task.title + " (" + task.priority + ")";
list.appendChild(li);
});

}


/* ---------- CREATE TASK ---------- */
async function createTask(){

const token = localStorage.getItem("token");
const title = document.getElementById("title").value;

await fetch(`${API}/api/tasks/`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
title:title,
priority:"MEDIUM"
})
});

loadTasks();

}


window.onload = loadTasks;