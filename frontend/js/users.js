// ==========================================
// Authentication
// ==========================================

requireLogin();
requireRole("Admin");

// ==========================================
// Page Load
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

                <td colspan="6"
                    style="text-align:center;">

                    No Users Available

                </td>

            </tr>

            `;

            return;

        }

        users.forEach(user => {

            const badge =
                user.status === "Active"
                ? "completed"
                : "completed user-disabled";

            table.innerHTML += `

<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.role}</td>

<td>

<span class="${badge}">

${user.status}

</span>

</td>

<td>

<button

class="btn btn-primary"

onclick="openEditModal(

'${user.id}',

'${user.status}'

)">

Edit

</button>

</td>

</tr>

`;

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to Load Users");

    }

}

// ==========================================
// Add User Modal
// ==========================================

function openModal() {

    document
        .getElementById("userModal")
        .style.display = "flex";

}

function closeModal() {

    document
        .getElementById("userModal")
        .style.display = "none";

}

// ==========================================
// Edit Status Modal
// ==========================================

function openEditModal(id, status) {

    document.getElementById("editUserId").value =
        id;

    document.getElementById("editStatus").value =
        status;

    document.getElementById("editStatusModal")
        .style.display = "flex";

}

function closeEditModal() {

    document.getElementById("editStatusModal")
        .style.display = "none";

}

// ==========================================
// Update User Status
// ==========================================

async function updateUserStatus() {

    try {

        const id =
            document.getElementById("editUserId").value;

        const status =
            document.getElementById("editStatus").value;

        await apiPut(

            "users/" + id,

            {

                status

            }

        );

        alert("User status updated successfully.");

        closeEditModal();

        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ==========================================
// Add User
// ==========================================

async function addUser() {

    const name =
        document.getElementById("name")
        .value.trim();

    const email =
        document.getElementById("email")
        .value.trim();

    const role =
        document.getElementById("role")
        .value;

    const status =
        document.getElementById("status")
        .value;

    if (!name || !email) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response =

            await apiPost(

                "users",

                {

                    name,

                    email,

                    role,

                    status

                }

            );

        alert(

            response.message +

            "\n\nTemporary Password : Welcome@123"

        );

        closeModal();

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";

        document.getElementById("role").selectedIndex = 2;
        document.getElementById("status").selectedIndex = 0;

        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert(

            error.message ||

            "Unable to Create User"

        );

    }

}