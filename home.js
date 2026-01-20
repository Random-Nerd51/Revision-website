console.log("HOME JS LOADED");

// ---------------------------
// LOAD SUBJECTS
// ---------------------------

// Load subject list from localStorage
function loadSubjectNames() {
    return JSON.parse(localStorage.getItem("subjects")) || [];
}

// Convert subject ID → subject name
function getSubjectName(id) {
    const subjects = loadSubjectNames();
    const match = subjects.find(s => s.id === id);
    return match ? match.name : "Unknown Subject";
}


// ---------------------------
// LOAD ALL TODOS
// ---------------------------

function loadAllTodos() {
    const todos = [];

    for (let key in localStorage) {
        if (key.startsWith("todo-")) {
            const subjectId = key.replace("todo-", "");
            const subjectTodos = JSON.parse(localStorage.getItem(key)) || [];

            subjectTodos.forEach((t, index) => {
                if (t.due) {
                    todos.push({
                        subjectId,
                        subjectName: getSubjectName(subjectId),
                        task: t.task,
                        due: new Date(t.due),
                        done: t.done,
                        key,
                        index
                    });
                }
            });
        }
    }

    return todos;
}


// ---------------------------
// FILTERING
// ---------------------------

function filterWeek(todos) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);

    return todos.filter(t => t.due >= today && t.due <= weekFromNow);
}

function filterMonth(todos) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return todos.filter(t => t.due >= today && t.due <= endOfMonth);
}

// ---------------------------
// RENDER UPCOMING TASKS
// ---------------------------

function renderUpcoming() {
    const view = document.getElementById("upcomingView").value;
    const list = document.getElementById("upcomingList");

    let todos = loadAllTodos();

    // Apply filter
    if (view === "week") {
        todos = filterWeek(todos);
    } else {
        todos = filterMonth(todos);
    }

    // Sort by date
    todos.sort((a, b) => a.due - b.due);

    // Clear list
    list.innerHTML = "";

    if (todos.length === 0) {
        list.innerHTML = "<li>No upcoming tasks</li>";
        return;
    }

    // Render each task
    todos.forEach(t => {
        const li = document.createElement("li");

        li.innerHTML = `
            <label class="upcoming-item">
                <input 
                    type="checkbox" 
                    class="upcoming-check"
                    data-key="${t.key}"
                    data-index="${t.index}"
                    ${t.done ? "checked" : ""}
                >
                <span class="${t.done ? "done" : ""}">
                    <strong>${t.task}</strong><br>
                    <small>${t.subjectName} — Due: ${t.due.toDateString()}</small>
                </span>
            </label>
        `;

        list.appendChild(li);
    });
}


// ---------------------------
// CHECKBOX HANDLING
// ---------------------------

document.getElementById("upcomingList").addEventListener("change", (e) => {
    if (!e.target.classList.contains("upcoming-check")) return;

    const key = e.target.dataset.key;
    const index = e.target.dataset.index;

    const todos = JSON.parse(localStorage.getItem(key)) || [];
    todos[index].done = e.target.checked;

    localStorage.setItem(key, JSON.stringify(todos));

    renderUpcoming();
});


// ---------------------------
// INITIALIZE
// ---------------------------

document.getElementById("upcomingView").addEventListener("change", renderUpcoming);
renderUpcoming();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            window.location.href = "login.html";
        });
    });
}