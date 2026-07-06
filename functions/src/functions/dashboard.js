const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("dashboard", {

    methods: ["GET"],

    authLevel: "anonymous",

    route: "dashboard",

    handler: async (request, context) => {

        try {

            const container = getContainer();

            // ===================================
            // PRODUCTS
            // ===================================

            const productQuery = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = "Product"
                `

            };

            const {

                resources: products

            } = await container.items
                .query(productQuery)
                .fetchAll();

            // ===================================
            // ORDERS
            // ===================================

            const orderQuery = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = "Order"
                `

            };

            const {

                resources: orders

            } = await container.items
                .query(orderQuery)
                .fetchAll();

            // ===================================
            // RETURNS
            // ===================================

            const returnQuery = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = "Return"
                `

            };

            const {

                resources: returns

            } = await container.items
                .query(returnQuery)
                .fetchAll();

            // ===================================
            // DASHBOARD CALCULATIONS
            // ===================================

            const totalProducts =
                products.length;

            const totalOrders =
                orders.length;

            const totalReturns =
                returns.length;

            const lowStock =
                products.filter(

                    p => p.stock <= p.minimumStock

                ).length;

            const inventoryValue =
                products.reduce(

                    (sum, p) =>

                        sum + (p.price * p.stock),

                    0

                );

            const demandForecast =

                totalOrders > 20

                    ? "High Demand"

                    : totalOrders > 10

                    ? "Medium Demand"

                    : "Low Demand";

            const reorderProducts =

                products.filter(

                    p => p.stock <= p.minimumStock

                );

            return {

                status: 200,

                jsonBody: {

                    totalProducts,

                    totalOrders,

                    totalReturns,

                    lowStock,

                    inventoryValue,

                    demandForecast,

                    reorderProducts,

                    recentProducts:

                        products.slice(0, 5)

                }

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