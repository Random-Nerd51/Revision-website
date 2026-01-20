// Load dark mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Load saved video theme (THIS WAS MISSING)
const savedVideoTheme = localStorage.getItem("video-theme");

// Apply theme class to body
if (savedVideoTheme) {
    document.body.classList.add(savedVideoTheme);
}

const video = document.getElementById("themeVideo");
const pageClass = document.body.className;

// Apply correct video for the current theme + page
function applyVideoTheme() {
    if (!video || !savedVideoTheme) return;

    let src = "";

    // ⭐ Plain / Default Theme (NO VIDEO)
    if (savedVideoTheme === "theme-default") {
        return;
    }

    // 🌆 City Life Theme
    if (savedVideoTheme === "theme-city") {
        if (pageClass.includes("page-home")) src = "videos/city-home.mp4";
        if (pageClass.includes("page-subjects")) src = "videos/city-subjects.mp4";
        if (pageClass.includes("page-subjectbase")) src = "videos/city-subjects.mp4";
        if (pageClass.includes("page-login")) src = "videos/city-login.mp4";
        if (pageClass.includes("page-signup")) src = "videos/city-login.mp4";
    }

    // 💼 Casual Work Theme
    if (savedVideoTheme === "theme-casual") {
        if (pageClass.includes("page-home")) src = "videos/casual-home.mp4";
        if (pageClass.includes("page-subjects")) src = "videos/casual-subjects.mp4";
        if (pageClass.includes("page-subjectbase")) src = "videos/casual-subjects.mp4";
        if (pageClass.includes("page-login")) src = "videos/casual-login.mp4";
        if (pageClass.includes("page-signup")) src = "videos/casual-login.mp4";
    }

    // 🌲 Nature Vibes Theme
    if (savedVideoTheme === "theme-forest") {
        if (pageClass.includes("page-home")) src = "videos/forest-home.mp4";
        if (pageClass.includes("page-subjects")) src = "videos/forest-subjects.mp4";
        if (pageClass.includes("page-subjectbase")) src = "videos/forest-subjects.mp4";
        if (pageClass.includes("page-login")) src = "videos/forest-login.mp4";
        if (pageClass.includes("page-signup")) src = "videos/forest-login.mp4";
    }

    // Apply video
    if (src) {
        video.src = src;
        video.load();
        video.play();
    }
}

applyVideoTheme();