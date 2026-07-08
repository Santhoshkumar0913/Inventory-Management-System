// ==========================================
// Inventory Management
// ==========================================

requireLogin();

let products = [];
let editMode = false;
let editProductId = null;

const currentUser = getUser();

const canAdd =
    hasRole("Admin", "Manager");

const canEdit =
    hasRole("Admin", "Manager");

const canDelete =
    hasRole("Admin");

window.onload = function () {

    const addBtn =
        document.getElementById("addProductBtn");

    if (addBtn && !canAdd) {

        addBtn.style.display = "none";

    }

    loadProducts();

};

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        products =
            await apiGet("products");

        renderProducts(products);

    }

    catch (error) {

        console.error(error);

        alert("Unable to load products.");

    }

}

// ==========================================
// Render Products
// ==========================================

function renderProducts(productList) {

    const tbody =
        document.getElementById(
            "inventoryTableBody"
        );

    tbody.innerHTML = "";

    productList.forEach(product => {

        const status =
            product.stock <= product.minimumStock
                ? "Low Stock"
                : "Available";

        const statusClass =
            product.stock <= product.minimumStock
                ? "pending"
                : "completed";

        let actions = "";

        if (canEdit) {

            actions += `

<button
class="btn btn-primary"
onclick="editProduct('${product.id}')">

Edit

</button>

`;

        }

        if (canDelete) {

            actions += `

<button
class="btn btn-danger"
onclick="deleteProduct('${product.id}')">

Delete

</button>

`;

        }

        tbody.innerHTML += `

<tr>

<td>${product.id}</td>

<td>${product.name}</td>

<td>${product.category}</td>

<td>$${product.price}</td>

<td>${product.stock}</td>

<td>

<span class="${statusClass}">

${status}

</span>

</td>

<td>

${actions}

</td>

</tr>

`;

    });

}

// ==========================================
// Search
// ==========================================

function searchProducts() {

    const keyword =

        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const filtered =

        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(keyword)

            ||

            product.category
                .toLowerCase()
                .includes(keyword)

        );

    renderProducts(filtered);

}
// ==========================================
// Open Modal
// ==========================================

function openProductModal() {

    if (!canAdd) {

        alert("Access Denied");

        return;

    }

    editMode = false;

    editProductId = null;

    document
        .getElementById("productForm")
        .reset();

    document
        .getElementById("modalTitle")
        .innerHTML = "Add Product";

    document
        .getElementById("productModal")
        .style.display = "flex";

}

// ==========================================
// Close Modal
// ==========================================

function closeProductModal() {

    document
        .getElementById("productModal")
        .style.display = "none";

}

// ==========================================
// Save Product
// ==========================================

async function saveProduct() {

    if (!canAdd && !canEdit) {

        alert("Access Denied");

        return;

    }

    const product = {

        id:
            document
                .getElementById("productId")
                .value,

        name:
            document
                .getElementById("productName")
                .value,

        category:
            document
                .getElementById("category")
                .value,

        price:
            Number(
                document
                    .getElementById("price")
                    .value
            ),

        stock:
            Number(
                document
                    .getElementById("stock")
                    .value
            ),

        minimumStock:
            Number(
                document
                    .getElementById("minimumStock")
                    .value
            ),

        supplier:
            document
                .getElementById("supplier")
                .value,

        role:
            currentUser.role

    };

    try {

        if (editMode) {

            if (!canEdit) {

                alert("Access Denied");

                return;

            }

            await apiPut(

                `products/${editProductId}`,

                product

            );

        }

        else {

            if (!canAdd) {

                alert("Access Denied");

                return;

            }

            await apiPost(

                "products",

                product

            );

        }

        closeProductModal();

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ==========================================
// Edit Product
// ==========================================

function editProduct(id) {

    if (!canEdit) {

        alert("Access Denied");

        return;

    }

    const product =
        products.find(p => p.id === id);

    if (!product) {

        return;

    }

    editMode = true;

    editProductId = id;

    document
        .getElementById("modalTitle")
        .innerHTML = "Edit Product";

    document
        .getElementById("productId")
        .value = product.id;

    document
        .getElementById("productName")
        .value = product.name;

    document
        .getElementById("category")
        .value = product.category;

    document
        .getElementById("price")
        .value = product.price;

    document
        .getElementById("stock")
        .value = product.stock;

    document
        .getElementById("minimumStock")
        .value = product.minimumStock;

    document
        .getElementById("supplier")
        .value = product.supplier;

    document
        .getElementById("productModal")
        .style.display = "flex";

}
// ==========================================
// Delete Product
// ==========================================

async function deleteProduct(id) {

    if (!canDelete) {

        alert("Access Denied");

        return;

    }

    if (!confirm("Delete this product?")) {

        return;

    }

    try {

        await apiDelete(

            `products/${id}?role=${currentUser.role}`

        );

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ==========================================
// Close Modal on Outside Click
// ==========================================

window.onclick = function (event) {

    const modal =
        document.getElementById("productModal");

    if (event.target === modal) {

        closeProductModal();

    }

};