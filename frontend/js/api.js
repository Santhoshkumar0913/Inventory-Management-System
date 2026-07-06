const API_BASE = "http://localhost:7071/api";

// ===============================
// GET
// ===============================

async function apiGet(endpoint) {

    const response = await fetch(`${API_BASE}/${endpoint}`);

    if (!response.ok) {

        throw new Error("GET request failed");

    }

    return await response.json();

}

// ===============================
// POST
// ===============================

async function apiPost(endpoint, data) {

    const response = await fetch(`${API_BASE}/${endpoint}`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(data)

    });

    if (!response.ok) {

        throw new Error("POST request failed");

    }

    return await response.json();

}

// ===============================
// PUT
// ===============================

async function apiPut(endpoint, data) {

    const response = await fetch(`${API_BASE}/${endpoint}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(data)

    });

    if (!response.ok) {

        throw new Error("PUT request failed");

    }

    return await response.json();

}

// ===============================
// DELETE
// ===============================

async function apiDelete(endpoint) {

    const response = await fetch(`${API_BASE}/${endpoint}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("DELETE request failed");

    }

    return await response.json();

}