// ==========================================
// Returns
// ==========================================

let products = [];
let returns = [];

// ==========================================
// Initialize
// ==========================================

async function initializeReturns() {

    await loadProducts();

    await loadReturns();

}

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        products = await apiGet("products");

        const select =
            document.getElementById("returnProduct");

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
// Load Returns
// ==========================================

async function loadReturns() {

    try {

        returns = await apiGet("returns");

        renderReturns();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Render Returns
// ==========================================

function renderReturns() {

    const tbody =
        document.getElementById("returnsTable");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (returns.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="6">

No Returns Available

</td>

</tr>

`;

        return;

    }

    returns.forEach(item => {

        tbody.innerHTML += `

<tr>

<td>${item.id}</td>

<td>${item.orderId}</td>

<td>${item.product}</td>

<td>${item.quantity}</td>

<td>${item.reason}</td>

<td>

<span class="completed">

${item.status}

</span>

</td>

</tr>

`;

    });

}

// ==========================================
// Create Return
// ==========================================

async function createReturn() {

    try {

        const data = {

            orderId:

                document
                    .getElementById("orderId")
                    .value,

            productId:

                document
                    .getElementById("returnProduct")
                    .value,

            quantity:

                Number(

                    document
                        .getElementById("returnQuantity")
                        .value

                ),

            reason:

                document
                    .getElementById("reason")
                    .value

        };

        if (

            data.orderId === "" ||

            data.productId === "" ||

            data.quantity <= 0 ||

            data.reason === ""

        ) {

            alert("Fill all fields.");

            return;

        }

        await apiPost(

            "returns",

            data

        );

        alert("Return Processed Successfully");

        document
            .getElementById("returnForm")
            .reset();

        await loadProducts();

        await loadReturns();

    }

    catch (error) {

        console.error(error);

        alert("Unable to process return.");

    }

}

// ==========================================

initializeReturns();