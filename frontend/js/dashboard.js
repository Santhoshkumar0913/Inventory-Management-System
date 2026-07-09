// ==========================================
// Dashboard
// ==========================================

let dashboard = {};

let inventoryChart = null;

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {

    try {

        dashboard = await apiGet("dashboard");

        updateCards();

        renderRecentProducts();

        renderInventoryChart();

        renderReorderAlerts();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

// ==========================================
// Dashboard Cards
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

    document.getElementById("inventoryValue").innerText =
        "₹" +
        dashboard.inventoryValue.toLocaleString('en-IN');

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

        const lowStock =
            product.stock <= product.minimumStock;

        tbody.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>${product.stock}</td>

<td>

<span class="${lowStock ? "pending" : "completed"}">

${lowStock ? "Low Stock" : "Available"}

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

    const tbody =
        document.getElementById("reorderTable");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (dashboard.reorderProducts.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="5">

No Reorder Required

</td>

</tr>

`;

        return;

    }

    const user =
        getUser();

    dashboard.reorderProducts.forEach(product => {

        let action = "";

        if (

            user.role === "Admin" ||

            user.role === "Manager"

        ) {

            action = `

<button

class="btn btn-primary"

onclick="reorderProduct('${product.id}')">

Reorder

</button>

`;

        }

        else {

            action = `

<span class="pending">

Awaiting Manager

</span>

`;

        }

        tbody.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.stock}</td>

<td>${product.minimumStock}</td>

<td>

${action}

</td>

</tr>

`;

    });

}

// ==========================================
// Manual Reorder
// ==========================================

async function reorderProduct(productId) {

    try {

        const user =
            getUser();

        await apiPost(

            "reorderProduct/" + productId,

            {

                role: user.role

            }

        );

        alert(

            "Product reordered successfully."

        );

        await loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert(

            error.message ||

            "Unable to reorder product."

        );

    }

}
// ==========================================
// Inventory Trend Chart
// ==========================================

function renderInventoryChart() {

    const canvas =
        document.getElementById("inventoryChart");

    if (!canvas)
        return;

    if (inventoryChart) {

        inventoryChart.destroy();

    }

    const trend =
        dashboard.inventoryTrend || [];

    const labels =
        trend.map(item => item.category);

    const values =
        trend.map(item => item.stock);

    inventoryChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels,

            datasets: [

                {

                    label: "Available Stock",

                    data: values,

                    backgroundColor:
                        labels.map((_, index) => [

                            "#2563eb",
                            "#16a34a",
                            "#f59e0b",
                            "#dc2626",
                            "#7c3aed",
                            "#0f766e",
                            "#ea580c"

                        ][index % 7]),

                    borderRadius: 10,
                    barPercentage: 0.6,

                    categoryPercentage: 0.7,

                    borderWidth: 1

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            animation: {

                duration: 1200,

                easing: "easeOutQuart"

            },

            plugins: {

                legend: {

                    display: false

                },

                title: {

                    display: true,

                    text: "Current Inventory Distribution",

                    font: {

                        size: 18

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: {

                        color: "#ececec"

                    },

                    title: {

                        display: true,

                        text: "Stock Quantity"

                    }

                },

                x: {

                    grid: {

                        display: false

                    },

                    title: {

                        display: true,

                        text: "Product Category"

                    }

                }

            }

        }

    });

}

// ==========================================

loadDashboard();