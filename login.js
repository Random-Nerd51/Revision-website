console.log("Login JS loaded");

const auth = firebase.auth();

document.getElementById("loginBtn").addEventListener("click", () => {
    console.log("login button clicked");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            if (!user.emailVerified) {
                alert("Please verify your email before logging in.");
                return;
            }

            alert("Logged in successfully");

            // Redirect to your app's home page
            window.location.href = "Homepage.html";
        })
        .catch((error) => {
            console.error("Login error:", error);
            alert(error.message);
        });
});

document.getElementById("guestBtn").addEventListener("click", () => {
    console.log("Guest login clicked");

    firebase.auth().signInAnonymously()
        .then(() => {
            console.log("Signed in as guest");
            window.location.href = "Homepage.html"; // or wherever your app starts
        })
        .catch((error) => {
            console.error("Guest login error:", error);
            alert(error.message);
        });
});

document.getElementById("forgotPassword").addEventListener("click", () => {
    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter your email first");
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Password reset email sent");
        })
        .catch(error => {
            alert(error.message);
        });
});