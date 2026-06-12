document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");

    if (!form) {
        console.error("Signup form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const age = document.getElementById("age").value;
        const weight = document.getElementById("weight").value;
        const height = document.getElementById("height").value;
        const activity_level = document.getElementById("activity_level").value;

        // VALIDATION
        if (name.length < 3) return alert("Name must be at least 3 characters");
        if (!email.includes("@")) return alert("Enter valid email");
        if (password.length < 6) return alert("Password must be at least 6 characters");
        if (age < 10 || age > 100) return alert("Enter valid age (10-100)");
        if (weight <= 0 || height <= 0) return alert("Enter valid weight and height");
        if (!activity_level) return alert("Select activity level");

        try {
            const res = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    age,
                    weight,
                    height,
                    activity_level
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Signup failed");
            }

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    });

});
