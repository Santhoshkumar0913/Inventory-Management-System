const { getContainer } = require("../config/cosmosClient");

// =======================================
// GET ALL PRODUCTS
// =======================================

async function getProducts() {

    const container = getContainer();

    const querySpec = {

        query: `
            SELECT *
            FROM c
            WHERE c.documentType = @type
        `,

        parameters: [

            {
                name: "@type",
                value: "Product"
            }

        ]

    };

    const { resources } =
        await container.items
            .query(querySpec)
            .fetchAll();

    return resources.map(product => ({

        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minimumStock: product.minimumStock,
        supplier: product.supplier,
        lastUpdated: product.lastUpdated

    }));

}

// =======================================
// GET PRODUCT BY ID
// =======================================

async function getProduct(id) {

    const container = getContainer();

    const querySpec = {

        query: `
            SELECT *
            FROM c
            WHERE c.id = @id
            AND c.documentType = @type
        `,

        parameters: [

            {
                name: "@id",
                value: id
            },

            {
                name: "@type",
                value: "Product"
            }

        ]

    };

    const { resources } =
        await container.items
            .query(querySpec)
            .fetchAll();

    return resources[0] || null;

}

// =======================================
// CREATE PRODUCT
// =======================================

async function createProduct(product) {

    const container = getContainer();

    product.documentType = "Product";

    product.lastUpdated =
        new Date().toISOString().split("T")[0];

    const { resource } =
        await container.items.create(product);

    return resource;

}

// =======================================
// UPDATE PRODUCT
// =======================================

async function updateProduct(product) {

    const container = getContainer();

    const existing =
        await getProduct(product.id);

    if (!existing) {

        throw new Error("Product not found");

    }

    const updatedProduct = {

        ...existing,

        ...product,

        documentType: "Product",

        lastUpdated:
            new Date().toISOString().split("T")[0]

    };

    const { resource } =
        await container
            .item(existing.id, existing.documentType)
            .replace(updatedProduct);

    return resource;

}

// =======================================
// DELETE PRODUCT
// =======================================

async function deleteProduct(id) {

    const container = getContainer();

    const existing =
        await getProduct(id);

    if (!existing) {

        throw new Error("Product not found");

    }

    await container
        .item(existing.id, existing.documentType)
        .delete();

    return existing;

}

module.exports = {

    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct

};