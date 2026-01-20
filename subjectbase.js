// ---------------------------
// GET SUBJECT ID
// ---------------------------

function getSubjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const subjectId = getSubjectId();

if (!subjectId) {
    console.error("No subject ID found in URL.");
    alert("This subject page is missing its ID. Please open it from the Subjects page.");
}

document.getElementById("subjectTitle").textContent = "Your To-Do List";


// ---------------------------
// TO‑DO LIST LOGIC
// ---------------------------

function loadTodos() {
    return JSON.parse(localStorage.getItem("todo-" + subjectId)) || [];
}

function saveTodos(todos) {
    localStorage.setItem("todo-" + subjectId, JSON.stringify(todos));
}


// ---------------------------
// RENDER TASKS
// ---------------------------

function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    const todos = loadTodos();

    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.done ? " done" : "");

        li.innerHTML = `
            <span>
                ${todo.task}
                <small>(due: ${todo.due || "no date"})</small>
            </span>

            <div class="todo-actions">
                <input type="checkbox" class="todo-check" data-index="${index}" ${todo.done ? "checked" : ""}>
                <button class="deleteTodoBtn" data-index="${index}">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}


// ---------------------------
// ADD NEW TASK
// ---------------------------

document.getElementById("addTodoBtn").addEventListener("click", () => {
    const text = document.getElementById("todoText").value.trim();
    const date = document.getElementById("todoDate").value;

    if (!text) return;

    const todos = loadTodos();
    todos.push({ task: text, due: date, done: false });
    saveTodos(todos);

    document.getElementById("todoText").value = "";
    document.getElementById("todoDate").value = "";

    renderTodos();
});


// ---------------------------
// CHECKBOX + DELETE HANDLING
// ---------------------------

document.getElementById("todoList").addEventListener("click", (e) => {
    const todos = loadTodos();

    if (e.target.classList.contains("todo-check")) {
        const index = e.target.dataset.index;
        todos[index].done = e.target.checked;
        saveTodos(todos);
        renderTodos();
    }

    if (e.target.classList.contains("deleteTodoBtn")) {
        const index = e.target.dataset.index;
        todos.splice(index, 1);
        saveTodos(todos);
        renderTodos();
    }
});


// ---------------------------
// SORTING
// ---------------------------

document.getElementById("sortTodos").addEventListener("change", () => {
    const sortType = document.getElementById("sortTodos").value;
    let todos = loadTodos();

    todos.sort((a, b) => {
        const dateA = a.due ? new Date(a.due) : new Date(0);
        const dateB = b.due ? new Date(b.due) : new Date(0);

        return sortType === "oldest"
            ? dateA - dateB
            : dateB - dateA;
    });

    saveTodos(todos);
    renderTodos();
});

renderTodos();


// ---------------------------
// SUBJECT CALENDAR LOGIC
// ---------------------------

function loadSubjectEvents() {
    return JSON.parse(localStorage.getItem("calendar-" + subjectId)) || [];
}

function saveSubjectEvents(events) {
    localStorage.setItem("calendar-" + subjectId, JSON.stringify(events));
}

// ---------------------------
// CLEAR ALL SESSIONS
// ---------------------------

document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clearSessionsBtn");
    if (!clearBtn) return;

    clearBtn.addEventListener("click", () => {
        if (!confirm("Delete ALL revision sessions for this subject?")) return;

        // Remove all events for this subject
        localStorage.removeItem("calendar-" + subjectId);

        // Refresh the page so the calendar updates
        location.reload();
    });
});

function convertTodosToEvents() {
    const todos = loadTodos();

    return todos
        .filter(t => t.due)
        .map(t => ({
            title: "Task: " + t.task,
            date: t.due,
            backgroundColor: "#ffcc00",
            borderColor: "#ffcc00"
        }));
}

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("subjectCalendar");
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: "auto",

        events: [
            ...loadSubjectEvents(),
            ...convertTodosToEvents()
        ],

        dateClick: function(info) {
            const title = prompt("Add revision session:");
            if (!title) return;

            const repeatDays = prompt("Repeat every how many days? Leave blank for none:");
            const endDateInput = prompt("Repeat until (YYYY-MM-DD)? Leave blank for 10 repeats.");

            const events = loadSubjectEvents();

            events.push({ title, date: info.dateStr });

            if (repeatDays && !isNaN(repeatDays)) {
                let current = new Date(info.dateStr);
                const interval = Number(repeatDays);

                if (endDateInput) {
                    const endDate = new Date(endDateInput);

                    while (true) {
                        current.setDate(current.getDate() + interval);
                        if (current > endDate) break;

                        events.push({
                            title,
                            date: current.toISOString().split("T")[0]
                        });
                    }

                } else {
                    for (let i = 0; i < 10; i++) {
                        current.setDate(current.getDate() + interval);

                        events.push({
                            title,
                            date: current.toISOString().split("T")[0]
                        });
                    }
                }
            }

            saveSubjectEvents(events);
            calendar.refetchEvents();
        },

        eventClick: function(info) {
            if (!confirm(`Delete session: "${info.event.title}"?`)) return;

            let events = loadSubjectEvents();

            events = events.filter(ev =>
                !(ev.title === info.event.title && ev.date === info.event.startStr)
            );

            saveSubjectEvents(events);
            info.event.remove();
        }
    });

    calendar.render();
});