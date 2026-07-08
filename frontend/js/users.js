// ==========================================
// Authentication
// ==========================================

requireLogin();
requireRole("Admin");

// ==========================================
// Load Users
// ==========================================

window.onload = () => {

    loadUsers();

};

// ==========================================
// Load Users
// ==========================================

async function loadUsers() {

    try {

        const users =
            await apiGet("users");

        const table =
            document.getElementById("usersTable");

        table.innerHTML = "";

        if (users.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="5"
                        style="text-align:center;">

                        No Users Available

                    </td>

                </tr>

            `;

            return;

        }

        users.forEach(user => {

            table.innerHTML += `

                <tr>

                    <td>${user.id}</td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>${user.role}</td>

                    <td>${user.status}</td>

                </tr>

            `;

        });

    }

    catch (error) {

        alert("Unable to Load Users");

        console.error(error);

    }

}

// ==========================================
// Open Modal
// ==========================================

function openModal() {

    document
        .getElementById("userModal")
        .style.display = "flex";

}

// ==========================================
// Close Modal
// ==========================================

function closeModal() {

    document
        .getElementById("userModal")
        .style.display = "none";

}

// ==========================================
// Add User
// ==========================================

async function addUser() {

    const name =
        document
        .getElementById("name")
        .value
        .trim();

    const email =
        document
        .getElementById("email")
        .value
        .trim();

    const role =
        document
        .getElementById("role")
        .value;

    const status =
        document
        .getElementById("status")
        .value;

    if (!name || !email) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response =
            await apiPost("users", {

                name,

                email,

                role,

                status

            });

        alert(

            response.message +
            "\n\nTemporary Password : Welcome@123"

        );

        closeModal();

        document
            .getElementById("name")
            .value = "";

        document
            .getElementById("email")
            .value = "";

        document
            .getElementById("role")
            .selectedIndex = 2;

        document
            .getElementById("status")
            .selectedIndex = 0;

        loadUsers();

    }

    catch (error) {

        alert("Unable to Create User");

        console.error(error);

    }

}