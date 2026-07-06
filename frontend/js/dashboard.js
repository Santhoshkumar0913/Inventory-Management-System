// ==========================================
// Dashboard
// ==========================================

let dashboard = {};

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {

    try {

        dashboard = await apiGet("dashboard");

        updateCards();

        renderRecentProducts();

        renderReorderAlerts();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

// ==========================================
// Cards
// ==========================================

function updateCards() {

    document.getElementById("totalProducts").innerText =
        dashboard.totalProducts;

    document.getElementById("lowStock").innerText =
        dashboard.lowStock;

    document.getElementById("totalOrders").innerText =
        dashboard.totalOrders;

    document.getElementById("totalReturns").innerText =
        dashboard.totalReturns;

    const value =
        dashboard.inventoryValue.toLocaleString();

    document.getElementById("inventoryValue").innerText =
        "$" + value;

    document.getElementById("forecast").innerText =
        dashboard.demandForecast;

}

// ==========================================
// Recent Products
// ==========================================

function renderRecentProducts() {

    const tbody =
        document.getElementById("dashboardTable");

    tbody.innerHTML = "";

    dashboard.recentProducts.forEach(product => {

        const css =
            product.stock <= product.minimumStock
                ? "pending"
                : "completed";

        const status =
            product.stock <= product.minimumStock
                ? "Low Stock"
                : "Available";

        tbody.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>${product.stock}</td>

<td>

<span class="${css}">

${status}

</span>

</td>

</tr>

`;

    });

}

// ==========================================
// Reorder Alerts
// ==========================================

function renderReorderAlerts() {

    const table =
        document.getElementById("reorderTable");

    if (!table)
        return;

    table.innerHTML = "";

    dashboard.reorderProducts.forEach(product => {

        table.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.stock}</td>

<td>${product.minimumStock}</td>

<td>

<span class="pending">

Reorder Required

</span>

</td>

</tr>

`;

    });

}

// ==========================================

loadDashboard();