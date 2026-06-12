document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireLogin();
    if (!user) return;

    const box = document.getElementById("profileData");
    const fields = [
        ["Name", user.name],
        ["Email", user.email],
        ["Age", user.age],
        ["Weight", `${user.weight} kg`],
        ["Height", `${user.height} cm`],
        ["Activity", user.activity_level]
    ];
    const list = document.createElement("dl");

    list.className = "profile-list";
    box.textContent = "";

    fields.forEach(([label, value]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const detail = document.createElement("dd");

        term.textContent = label;
        detail.textContent = value;

        row.append(term, detail);
        list.appendChild(row);
    });

    box.appendChild(list);
});
