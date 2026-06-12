document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireLogin();
    if (!user) return;

    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    nameInput.value = user.name || "";
    emailInput.value = user.email || "";

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = document.getElementById("message").value.trim();

        if (name.length < 3) {
            alert("Name must be at least 3 characters");
            return;
        }

        if (!email.includes("@")) {
            alert("Enter valid email");
            return;
        }

        if (message.length < 5) {
            alert("Message is too short");
            return;
        }

        alert("Message sent successfully!");
        form.reset();
        nameInput.value = user.name || "";
        emailInput.value = user.email || "";
    });
});
