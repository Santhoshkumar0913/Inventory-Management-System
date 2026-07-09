// ==========================================
// Orders
// ==========================================

let products = [];
let orders = [];

// ==========================================
// Initialize
// ==========================================

async function initializeOrders() {

    await loadProducts();

    await loadOrders();

}

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        products = await apiGet("products");

        const select =
            document.getElementById("productSelect");

        if (!select) return;

        select.innerHTML =
            "<option value=''>Select Product</option>";

        products.forEach(product => {

            select.innerHTML += `

<option value="${product.id}">

${product.name} (Stock : ${product.stock})

</option>

`;

        });

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Load Orders
// ==========================================

async function loadOrders() {

    try {

        orders = await apiGet("orders");

        renderOrders();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Render Orders
// ==========================================

function renderOrders() {

    const tbody =
        document.getElementById("ordersTable");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (orders.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="6">

No Orders Available

</td>

</tr>

`;

        return;

    }

    orders.forEach(order => {

        tbody.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${order.customer}</td>

<td>${order.product}</td>

<td>${order.quantity}</td>

<td>₹${order.total}</td>

<td>

<span class="completed">

${order.status}

</span>

</td>

</tr>

`;

    });

}

// ==========================================
// Create Order
// ==========================================

async function createOrder() {

    try {

        const order = {

            customer:

                document
                    .getElementById("customerName")
                    .value,

            productId:

                document
                    .getElementById("productSelect")
                    .value,

            quantity:

                Number(

                    document
                        .getElementById("quantity")
                        .value

                )

        };

        if (

            order.customer === "" ||

            order.productId === "" ||

            order.quantity <= 0

        ) {

            alert("Fill all fields.");

            return;

        }

        await apiPost(

            "orders",

            order

        );

        alert("Order Created Successfully");

        document
            .getElementById("orderForm")
            .reset();

        await loadProducts();

        await loadOrders();

    }

    catch (error) {

        console.error(error);

        alert("Unable to create order");

    }

}

// ==========================================

initializeOrders();