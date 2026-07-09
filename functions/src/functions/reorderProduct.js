const { app } = require("@azure/functions");
const productService = require("../services/productService");

app.http("reorderProduct", {

    methods: ["POST"],

    authLevel: "anonymous",

    route: "reorderProduct/{id}",

    handler: async (request, context) => {

        try {

            const id =
                request.params.id;

            const body =
                await request.json();

            // =====================================
            // ROLE VALIDATION
            // =====================================

            if (

                body.role !== "Admin" &&
                body.role !== "Manager"

            ) {

                return {

                    status: 403,

                    jsonBody: {

                        success: false,

                        message: "Access Denied"

                    }

                };

            }

            // =====================================
            // GET PRODUCT
            // =====================================

            const product =
                await productService.getProduct(id);

            if (!product) {

                return {

                    status: 404,

                    jsonBody: {

                        success: false,

                        message: "Product not found"

                    }

                };

            }

            // =====================================
            // MANUAL REORDER
            // =====================================

            product.stock =
                product.minimumStock + 20;

            product.lastUpdated =
                new Date()
                    .toISOString()
                    .split("T")[0];

            const updated =
                await productService.updateProduct(product);

            // =====================================
            // RESPONSE
            // =====================================

            return {

                status: 200,

                jsonBody: {

                    success: true,

                    message:
                        "Product reordered successfully.",

                    product: updated

                }

            };

        }

        catch (error) {

            context.error(error);

            return {

                status: 500,

                jsonBody: {

                    success: false,

                    message: error.message

                }

            };

        }

    }

});