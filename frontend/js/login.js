document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Login form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.log("Login error:", err);
            alert("Server not reachable");
        }
    });

});
