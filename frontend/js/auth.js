// ===============================
// Authentication Helper
// ===============================

const USER_KEY = "inventory_user";

// -------------------------------
// Save Logged User
// -------------------------------

function saveUser(user) {

    localStorage.setItem(

        USER_KEY,

        JSON.stringify(user)

    );

}

// -------------------------------
// Get Logged User
// -------------------------------

function getUser() {

    const user =
        localStorage.getItem(USER_KEY);

    if (!user) {

        return null;

    }

    return JSON.parse(user);

}

// -------------------------------
// Logout
// -------------------------------

function logout() {

    localStorage.removeItem(USER_KEY);

    window.location.replace("index.html");

}

// -------------------------------
// Check Login
// -------------------------------

function requireLogin() {

    const page =

        window.location.pathname
            .split("/")
            .pop();

    if (

        page === "index.html" ||

        page === ""

    ) {

        return;

    }

    const user =
        getUser();

    if (!user) {

        window.location.replace("index.html");

    }

}

// -------------------------------
// Check Role
// -------------------------------

function hasRole(...roles) {

    const user =
        getUser();

    if (!user) {

        return false;

    }

    return roles.includes(user.role);

}

// -------------------------------
// Require Role
// -------------------------------

function requireRole(...roles) {

    if (!hasRole(...roles)) {

        alert("Access Denied");

        window.location.href =
            "dashboard.html";

    }

}

// ===============================
// Render Logged User
// ===============================

function renderUserHeader() {

    const user =
        getUser();

    if (!user) {

        return;

    }

    const topbar =

        document.querySelector(".topbar");

    if (!topbar) {

        return;

    }

    if (

        document.getElementById("headerRight")

    ) {

        return;

    }

    const right =

        document.createElement("div");

    right.id = "headerRight";

    right.className = "header-right";

    right.innerHTML = `

<div class="user-info">

<div class="user-name">

<i class="fa-solid fa-user"></i>

${user.name}

</div>

<div class="user-role">

${user.role}

</div>

</div>

<button

class="logout-btn"

onclick="logout()">

Logout

</button>

`;

    topbar.appendChild(right);

}

// ===============================
// Initialize
// ===============================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        requireLogin();

        renderUserHeader();

    }

);