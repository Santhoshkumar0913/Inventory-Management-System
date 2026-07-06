const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("orders", {

    methods: ["GET", "POST"],

    authLevel: "anonymous",

    route: "orders/{id?}",

    handler: async (request, context) => {

        try {

            const container = getContainer();

            // =====================================
            // GET ORDERS
            // =====================================

            if (request.method === "GET") {

                const query = {

                    query: `
                        SELECT *
                        FROM c
                        WHERE c.documentType = @type
                        ORDER BY c.orderDate DESC
                    `,

                    parameters: [

                        {
                            name: "@type",
                            value: "Order"
                        }

                    ]

                };

                const { resources } =
                    await container.items
                        .query(query)
                        .fetchAll();

                return {

                    status: 200,

                    jsonBody: resources

                };

            }

            // =====================================
            // CREATE ORDER
            // =====================================

            const order =
                await request.json();

            // -------------------------
            // Find Product
            // -------------------------

            const productQuery = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType="Product"
                    AND c.id=@id
                `,

                parameters: [

                    {
                        name: "@id",
                        value: order.productId
                    }

                ]

            };

            const { resources } =
                await container.items
                    .query(productQuery)
                    .fetchAll();

            if (resources.length === 0) {

                return {

                    status: 404,

                    jsonBody: {

                        message: "Product not found"

                    }

                };

            }

            const product =
                resources[0];

            // -------------------------
            // Stock Check
            // -------------------------

            if (product.stock < order.quantity) {

                return {

                    status: 400,

                    jsonBody: {

                        message: "Insufficient stock"

                    }

                };

            }

            // -------------------------
            // Reduce Stock
            // -------------------------

            product.stock -= order.quantity;

            product.lastUpdated =
                new Date().toISOString().split("T")[0];

            await container
                .item(product.id, product.documentType)
                .replace(product);

            // -------------------------
            // Save Order
            // -------------------------

            const orderDocument = {

                id:
                    "O" + Date.now(),

                documentType:
                    "Order",

                customer:
                    order.customer,

                productId:
                    product.id,

                product:
                    product.name,

                quantity:
                    order.quantity,

                total:
                    product.price * order.quantity,

                status:
                    "Completed",

                orderDate:
                    new Date().toISOString()

            };

            const { resource } =
                await container.items
                    .create(orderDocument);

            return {

                status: 201,

                jsonBody: resource

            };

        }

        catch (error) {

            context.error(error);

            return {

                status: 500,

                jsonBody: {

                    message: error.message

                }

            };

        }

    }

});