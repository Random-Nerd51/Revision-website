console.log("JS loaded");

// Firebase Auth reference
const auth = firebase.auth();

// Handle signup button click
document.getElementById("signupBtn").addEventListener("click", () => {
    console.log("signup button clicked");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Send verification email
            user.sendEmailVerification()
                .then(() => {
                    console.log("Verification email sent");
                    alert("Verification email sent to " + email);

                    // Redirect to login page
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    alert(error.message);
                });
        })
        .catch((error) => {
            console.error("Signup error:", error);
            alert(error.message);
        });
});