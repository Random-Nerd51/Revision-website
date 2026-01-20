function loadAllSubjectEvents() {
    const events = [];

    for (let key in localStorage) {
        // Load tasks
        if (key.startsWith("todo-")) {
            const todos = JSON.parse(localStorage.getItem(key)) || [];
            todos.forEach(t => {
                if (t.due) {
                    events.push({
                        title: t.task,
                        start: t.due,
                        color: "#000000"
                    });
                }
            });
        }

        // Load revision sessions
        if (key.startsWith("calendar-")) {
            const sessions = JSON.parse(localStorage.getItem(key)) || [];
            sessions.forEach(s => {
                events.push({
                    title: s.title,
                    start: s.date,
                    color: "#06080a"
                });
            });
        }
    }

    return events;
}

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: "auto",
        headerToolbar: false,
        events: loadAllSubjectEvents()
    })
    calendar.render();
});
