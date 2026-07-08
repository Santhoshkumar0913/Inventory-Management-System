// ==========================================
// Azure Function API Base URL
// ==========================================

const API_BASE =
    "https://inventoryms-api-ard4d5aaf7hnahcg.centralindia-01.azurewebsites.net/api";

// ==========================================
// GET
// ==========================================

async function apiGet(endpoint) {

    const response =
        await fetch(`${API_BASE}/${endpoint}`);

    if (!response.ok) {

        throw new Error("GET request failed");

    }

    return await response.json();

}

// ==========================================
// POST
// ==========================================

async function apiPost(endpoint, data) {

    const response =
        await fetch(`${API_BASE}/${endpoint}`, {

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

// ==========================================
// PUT
// ==========================================

async function apiPut(endpoint, data) {

    const response =
        await fetch(`${API_BASE}/${endpoint}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

    const result = await response.json();

    if (!response.ok) {

        throw new Error(result.message);

    }

    return result;

}

// ==========================================
// DELETE
// ==========================================

async function apiDelete(endpoint) {

    const response =
        await fetch(`${API_BASE}/${endpoint}`, {

            method: "DELETE"

        });

    if (!response.ok) {

        throw new Error("DELETE request failed");

    }

    return await response.json();

}