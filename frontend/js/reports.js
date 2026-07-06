// ==========================================
// Reports
// ==========================================

let dashboard = {};

// ==========================================
// Load Reports
// ==========================================

async function loadReports() {

    try {

        dashboard = await apiGet("dashboard");

        updateCards();

        renderLowStock();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load reports.");

    }

}

// ==========================================
// Update Cards
// ==========================================

function updateCards() {

    document.getElementById("inventoryValue").innerText =
        "$" + dashboard.inventoryValue.toLocaleString();

    document.getElementById("reportProducts").innerText =
        dashboard.totalProducts;

    document.getElementById("reportLowStock").innerText =
        dashboard.lowStock;

    if (dashboard.lowStock > 5) {

        document.getElementById("forecast").innerText =
            "Restock Required";

    }

    else {

        document.getElementById("forecast").innerText =
            "Stable";

    }

}

// ==========================================
// Low Stock Table
// ==========================================

function renderLowStock() {

    const tbody =
        document.getElementById("reportTable");

    tbody.innerHTML = "";

    dashboard.recentProducts
        .filter(product =>
            product.stock <= product.minimumStock
        )
        .forEach(product => {

            tbody.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>${product.stock}</td>

<td>${product.minimumStock}</td>

</tr>

`;

        });

}

// ==========================================

loadReports();