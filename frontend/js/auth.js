function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("msg").innerText = data.message;

        if (data.message === "Login successful") {
            window.location.href = "dashboard.html";
        }
    })
    .catch(err => console.log(err));
}