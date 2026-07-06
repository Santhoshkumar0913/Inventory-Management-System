// ==========================================
// Users
// ==========================================

let users = [];

// ==========================================
// Load Users
// ==========================================

async function loadUsers() {

    try {

        users = await apiGet("users");

        renderUsers();

    }

    catch (error) {

        console.error(error);

        document.getElementById("usersTable").innerHTML = `

<tr>

<td colspan="5" style="text-align:center;">

No Users Found

</td>

</tr>

`;

    }

}

// ==========================================
// Render Users
// ==========================================

function renderUsers() {

    const tbody =
        document.getElementById("usersTable");

    tbody.innerHTML = "";

    if (users.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="5" style="text-align:center;">

No Users Available

</td>

</tr>

`;

        return;

    }

    users.forEach(user => {

        const css =
            user.status === "Active"
                ? "completed"
                : "pending";

        tbody.innerHTML += `

<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.role}</td>

<td>

<span class="${css}">

${user.status}

</span>

</td>

</tr>

`;

    });

}

// ==========================================

loadUsers();