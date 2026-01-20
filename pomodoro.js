function getStartOfWeek() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(now.setDate(diff)).toDateString();
}

function loadWeeklyMinutes() {
    const savedWeek = localStorage.getItem("pomo-week-start");
    const currentWeek = getStartOfWeek();

    if (savedWeek !== currentWeek) {
        localStorage.setItem("pomo-week-start", currentWeek);
        localStorage.setItem("pomo-week-minutes", 0);
    }

    return Number(localStorage.getItem("pomo-week-minutes")) || 0;
}

function saveWeeklyMinutes(minutes) {
    localStorage.setItem("pomo-week-minutes", minutes);
}

// ------------------------------
// LOAD SETTINGS
// ------------------------------
function loadPomodoroSettings() {
    return {
        work: Number(localStorage.getItem("pomo-work")) || 25,
        short: Number(localStorage.getItem("pomo-short")) || 5,
        long: Number(localStorage.getItem("pomo-long")) || 15,
        bg: localStorage.getItem("pomo-bg") || "var(--card-bg)"
    };
}

let settings = loadPomodoroSettings();

// Apply background colour
document.getElementById("pomoBox").style.background = settings.bg;

// ------------------------------
// TIMER VARIABLES
// ------------------------------

let weeklyMinutes = loadWeeklyMinutes();
document.getElementById("weeklyFocus").textContent = `This week: ${weeklyMinutes} minutes`;
let currentMode = "pomodoro";
let timeLeft = settings.work * 60;
let timer = null;

const display = document.getElementById("timerDisplay");

// ------------------------------
// DISPLAY UPDATE
// ------------------------------
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ------------------------------
// NOTIFICATION
// ------------------------------
function notify() {
    if (Notification.permission === "granted") {
        new Notification("Timer Finished!", {
            body: currentMode === "pomodoro" ? "Time for a break!" : "Back to work!"
        });
    }
}

// ------------------------------
// TIMER FUNCTIONS
// ------------------------------
function startTimer() {
    if (timer) return;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

if (timeLeft <= 0) {
    timeLeft = 0;

    // Only count minutes if in work mode
    if (currentMode === "pomodoro") {
        weeklyMinutes += settings.work;
        saveWeeklyMinutes(weeklyMinutes);
        document.getElementById("weeklyFocus").textContent =
            `This week: ${weeklyMinutes} minutes`;
    }

    clearInterval(timer);
    timer = null;
    notify();
}
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    pauseTimer();

    // Reload settings in case user changed them
    settings = loadPomodoroSettings();

    if (currentMode === "pomodoro") timeLeft = settings.work * 60;
    if (currentMode === "short") timeLeft = settings.short * 60;
    if (currentMode === "long") timeLeft = settings.long * 60;

    // Apply background again
    document.getElementById("pomoBox").style.background = settings.bg;

    updateDisplay();
}

// ------------------------------
// MODE SWITCHING
// ------------------------------
document.querySelectorAll(".mode-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".mode-buttons .active")?.classList.remove("active");
        btn.classList.add("active");

        currentMode = btn.dataset.mode;
        resetTimer();
    });
});

// ------------------------------
// BUTTON EVENTS
// ------------------------------
document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);

// ------------------------------
// AUTO-RELOAD SETTINGS WHEN RETURNING TO PAGE
// ------------------------------
window.addEventListener("focus", () => {
    settings = loadPomodoroSettings();
    resetTimer();
});

// ------------------------------
// ASK FOR NOTIFICATION PERMISSION
// ------------------------------
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Initial display
updateDisplay();