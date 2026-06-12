document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireLogin();
    if (!user) return;

    loadDashboard();

    const foodForm = document.getElementById("foodForm");
    const goalForm = document.getElementById("goalForm");

    if (goalForm) {
        goalForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const calories_goal = document.getElementById("calories_goal").value;
            const protein_goal = document.getElementById("protein_goal").value;
            const carbs_goal = document.getElementById("carbs_goal").value;
            const fats_goal = document.getElementById("fats_goal").value;

            try {
                const res = await fetch("/tracker/goal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ calories_goal, protein_goal, carbs_goal, fats_goal })
                });

                const data = await res.json();
                alert(data.message);

                if (res.ok) {
                    goalForm.reset();
                    loadDashboard();
                }
            } catch (err) {
                alert("Failed to save goals");
            }
        });
    }

    if (foodForm) {
        foodForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const calories = document.getElementById("calories").value;
            const protein = document.getElementById("protein").value;
            const carbs = document.getElementById("carbs").value;
            const fats = document.getElementById("fats").value;

            try {
                const res = await fetch("/tracker/log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ calories, protein, carbs, fats })
                });

                const data = await res.json();
                alert(data.message);

                if (res.ok) {
                    foodForm.reset();
                    loadDashboard();
                }
            } catch (err) {
                alert("Failed to add food");
            }
        });
    }
});

async function loadDashboard() {
    const dashboard = document.getElementById("dashboard");

    try {
        const res = await fetch("/tracker/today", {
            credentials: "include"
        });

        if (res.status === 401) {
            window.location.href = "./login.html";
            return;
        }

        if (res.status === 404) {
            dashboard.innerHTML = "<p>Save your goals first, then today&apos;s progress will appear here.</p>";
            return;
        }

        if (!res.ok) {
            throw new Error("Dashboard fetch failed");
        }

        const data = await res.json();

        dashboard.innerHTML =
            progressBar("Calories", data.calories) +
            progressBar("Protein", data.protein) +
            progressBar("Carbs", data.carbs) +
            progressBar("Fats", data.fats);
    } catch (err) {
        dashboard.innerHTML = "<p>Unable to load dashboard data right now.</p>";
    }
}

function progressBar(label, item) {
    const goal = Number(item.goal) || 0;
    const consumed = Number(item.consumed) || 0;
    const remaining = Number(item.remaining) || 0;
    const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

    return `
        <div class="progress-item">
            <h3>${label}</h3>
            <p>${consumed} / ${goal} (${remaining} left)</p>
            <div class="progress-track" aria-label="${label} progress">
                <div class="progress-fill" style="width:${percent}%"></div>
            </div>
        </div>
    `;
}

function deleteTodayFood() {
    fetch("/tracker/today", {
        method: "DELETE",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadDashboard();
    })
    .catch(() => {
        alert("Delete failed");
    });
}
