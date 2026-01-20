/* ============================================================
   LOAD SAVED SETTINGS ON PAGE LOAD
============================================================ */

// Apply dark mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeSwitch").checked = true;
    document.getElementById("themeLabel").textContent = "Dark Mode";
} else {
    document.getElementById("themeLabel").textContent = "Light Mode";
}

// Apply saved video theme
const savedVideoTheme = localStorage.getItem("video-theme");
if (savedVideoTheme) {
    document.getElementById("themeSelect").value = savedVideoTheme;
}

// Apply saved font size
const savedSize = localStorage.getItem("font-size");
if (savedSize) {
    document.documentElement.style.setProperty("--font-size", savedSize + "px");
    document.getElementById("fontSizeSlider").value = savedSize;
    document.getElementById("fontSizeLabel").textContent = `Font size: ${savedSize}px`;
}


/* ============================================================
   LIGHT / DARK MODE TOGGLE
============================================================ */

document.getElementById("themeSwitch").addEventListener("change", () => {
    const isDark = document.getElementById("themeSwitch").checked;

    if (isDark) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        document.getElementById("themeLabel").textContent = "Dark Mode";
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        document.getElementById("themeLabel").textContent = "Light Mode";
    }
});


/* ============================================================
   VIDEO THEME SELECTOR
============================================================ */

document.getElementById("themeSelect").addEventListener("change", () => {
    const selected = document.getElementById("themeSelect").value;
    localStorage.setItem("video-theme", selected);
    location.reload();
});


/* ============================================================
   FONT SIZE SLIDER (12px–20px)
============================================================ */

const fontSlider = document.getElementById("fontSizeSlider");
const fontLabel = document.getElementById("fontSizeLabel");

fontSlider.addEventListener("input", () => {
    const size = fontSlider.value;
    document.documentElement.style.setProperty("--font-size", size + "px");
    fontLabel.textContent = `Font size: ${size}px`;
    localStorage.setItem("font-size", size);
});


/* ============================================================
   CHANGE PASSWORD (WITH RE-AUTH)
============================================================ */

const modal = document.getElementById("passwordModal");
const openModal = document.getElementById("changePasswordBtn");
const closeModal = document.getElementById("closeModal");
const submitPassword = document.getElementById("submitPasswordChange");

openModal.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

submitPassword.addEventListener("click", async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("You must be logged in to change your password.");
        return;
    }

    const currentPass = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (!currentPass || !newPass || !confirmPass) {
        alert("Please fill in all fields.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match.");
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPass
    );

    try {
        // Re-authenticate
        await user.reauthenticateWithCredential(credential);

        // Update password
        await user.updatePassword(newPass);

        alert("Password updated successfully.");
        modal.style.display = "none";

        // Clear fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    } catch (error) {
        alert("Error: " + error.message);
    }
});


/* ============================================================
   DELETE ACCOUNT (WITH RE-AUTH)
============================================================ */

document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("You must be logged in to delete your account.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmDelete) return;

    // Ask user for password
    const password = prompt("Please enter your password to confirm:");

    if (!password) {
        alert("Password required.");
        return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );

    try {
        // Re-authenticate
        await user.reauthenticateWithCredential(credential);

        // Delete account
        await user.delete();

        alert("Your account has been deleted.");
        window.location.href = "signup.html";

    } catch (error) {
        alert("Error: " + error.message);
    }
});


/* ============================================================
   LOGOUT BUTTON
============================================================ */

document.getElementById("logoutBtn").addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
});