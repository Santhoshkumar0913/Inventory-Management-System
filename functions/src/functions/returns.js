const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("returns", {

    methods: ["GET", "POST"],

    authLevel: "anonymous",

    route: "returns/{id?}",

    handler: async (request, context) => {

        try {

            const container = getContainer();

            // =====================================
            // GET RETURNS
            // =====================================

            if (request.method === "GET") {

                const query = {

                    query: `
                        SELECT *
                        FROM c
                        WHERE c.documentType=@type
                        ORDER BY c.returnDate DESC
                    `,

                    parameters: [

                        {
                            name: "@type",
                            value: "Return"
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
            // CREATE RETURN
            // =====================================

            const body =
                await request.json();

            // -----------------------------
            // Find Product
            // -----------------------------

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
                        value: body.productId
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

            // -----------------------------
            // Restore Stock
            // -----------------------------

            product.stock += body.quantity;

            product.lastUpdated =
                new Date().toISOString().split("T")[0];

            await container
                .item(product.id, product.documentType)
                .replace(product);

            // -----------------------------
            // Save Return
            // -----------------------------

            const returnDoc = {

                id:
                    "R" + Date.now(),

                documentType:
                    "Return",

                orderId:
                    body.orderId,

                productId:
                    product.id,

                product:
                    product.name,

                quantity:
                    body.quantity,

                reason:
                    body.reason,

                status:
                    "Completed",

                returnDate:
                    new Date().toISOString()

            };

            const { resource } =
                await container.items
                    .create(returnDoc);

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