async function requireLogin() {
    try {
        const res = await fetch("/auth/profile", {
            credentials: "include"
        });

        if (!res.ok) {
            window.location.href = "./login.html";
            return null;
        }

        return await res.json();
    } catch (err) {
        window.location.href = "./login.html";
        return null;
    }
}

function logout() {
    fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "./login.html";
    })
    .catch(() => {
        alert("Logout failed");
    });
}
