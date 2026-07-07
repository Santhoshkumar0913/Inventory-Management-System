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

    const user = localStorage.getItem(USER_KEY);

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

    window.location.href = "index.html";

}

// -------------------------------
// Check Login
// -------------------------------

function requireLogin() {

    const user = getUser();

    if (!user) {

        window.location.href = "index.html";

    }

}

// -------------------------------
// Check Role
// -------------------------------

function hasRole(...roles) {

    const user = getUser();

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

        window.location.href = "dashboard.html";

    }

}