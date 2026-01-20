let user;

// Wait for login
firebase.auth().onAuthStateChanged(u => {
    if (!u) {
        window.location.href = "login.html";
        return;
    }

    user = u;
    loadSubjects();
});

// Add a new subject
document.getElementById("addSubjectBtn").addEventListener("click", () => {
    const name = document.getElementById("subjectInput").value.trim();

    if (!name) {
        alert("Please enter a subject name");
        return;
    }

    firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("subjects")
        .add({
            name: name,
            notes: "",
            createdAt: Date.now()
        })
        .then(() => {
            document.getElementById("subjectInput").value = "";
            loadSubjects();
        });
});

// Load subjects
function loadSubjects() {
    firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("subjects")
        .orderBy("createdAt")
        .get()
        .then(snapshot => {
            const list = document.getElementById("subjectList");
            list.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement("li");

                li.innerHTML = `
                    <span class="subject-name" data-id="${doc.id}">
                        ${data.name}
                    </span>
                    <button class="delete-btn" data-id="${doc.id}">Delete</button>
                `;

                list.appendChild(li);

                // ⭐ Click subject name → open subject page
                li.querySelector(".subject-name").addEventListener("click", () => {
                    window.location.href = `subjectbase.html?id=${doc.id}`;
                });

                // ⭐ Delete subject
                li.querySelector(".delete-btn").addEventListener("click", () => {
                    if (!confirm("Are you sure you want to delete this subject?")) return;

                    firebase.firestore()
                        .collection("users")
                        .doc(user.uid)
                        .collection("subjects")
                        .doc(doc.id)
                        .delete()
                        .then(() => {
                            loadSubjects();
                        });
                });
            });
        });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
});