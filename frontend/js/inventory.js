// =======================================
// Inventory Management
// frontend/js/inventory.js
// =======================================

const searchInput = document.getElementById("searchProduct");
const tableBody = document.getElementById("productTable");

let products = [

    {
        id: "P001",
        name: "Dell Laptop",
        category: "Laptop",
        price: 800,
        stock: 15
    },

    {
        id: "P002",
        name: "Wireless Mouse",
        category: "Accessories",
        price: 25,
        stock: 6
    },

    {
        id: "P003",
        name: "Router",
        category: "Networking",
        price: 95,
        stock: 18
    }

];

function renderProducts(data){

    tableBody.innerHTML = "";

    data.forEach(product=>{

        const status =
            product.stock <= 10
            ? "Low Stock"
            : "Available";

        const badge =
            product.stock <= 10
            ? "pending"
            : "completed";

        tableBody.innerHTML += `

        <tr>

            <td>${product.id}</td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>$${product.price}</td>

            <td>${product.stock}</td>

            <td>

                <span class="${badge}">

                    ${status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-primary"
                    onclick="editProduct('${product.id}')">

                    Edit

                </button>

                <button
                    class="btn btn-danger"
                    onclick="deleteProduct('${product.id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

renderProducts(products);

// =========================
// Search
// =========================

searchInput.addEventListener("keyup",()=>{

    const keyword =
        searchInput.value.toLowerCase();

    const filtered =
        products.filter(product=>

            product.name
            .toLowerCase()
            .includes(keyword)

            ||

            product.category
            .toLowerCase()
            .includes(keyword)

        );

    renderProducts(filtered);

});

// =========================
// Delete
// =========================

function deleteProduct(id){

    if(confirm("Delete Product ?")){

        products =
            products.filter(p=>p.id!==id);

        renderProducts(products);

    }

}

// =========================
// Edit
// =========================

function editProduct(id){

    const product =
        products.find(p=>p.id===id);

    alert(

`Product

ID : ${product.id}

Name : ${product.name}

Category : ${product.category}

Price : $${product.price}

Stock : ${product.stock}

(We'll replace this alert with an Edit Modal later.)`

    );

}