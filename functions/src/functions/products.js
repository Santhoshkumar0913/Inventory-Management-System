const { app } = require("@azure/functions");
const productService = require("../services/productService");

app.http("products", {

    methods: ["GET", "POST", "PUT", "DELETE"],

    authLevel: "anonymous",

    route: "products/{id?}",

    handler: async (request, context) => {

        try {

            const method = request.method;
            const id = request.params.id;

            // =====================================
            // GET ALL PRODUCTS
            // =====================================

            if (method === "GET") {

                if (id) {

                    const product =
                        await productService.getProduct(id);

                    if (!product) {

                        return {

                            status: 404,

                            jsonBody: {

                                message: "Product not found"

                            }

                        };

                    }

                    return {

                        status: 200,

                        jsonBody: product

                    };

                }

                const products =
                    await productService.getProducts();

                return {

                    status: 200,

                    jsonBody: products

                };

            }

            // =====================================
            // CREATE PRODUCT
            // =====================================

            if (method === "POST") {

                const body =
                    await request.json();

                const created =
                    await productService.createProduct(body);

                return {

                    status: 201,

                    jsonBody: created

                };

            }

            // =====================================
            // UPDATE PRODUCT
            // =====================================

            if (method === "PUT") {

                if (!id) {

                    return {

                        status: 400,

                        jsonBody: {

                            message: "Product ID required"

                        }

                    };

                }

                const body =
                    await request.json();

                body.id = id;

                const updated =
                    await productService.updateProduct(body);

                // =====================================
                // Automatic Reorder Alert
                // =====================================

                if (

                    updated.stock <=
                    updated.minimumStock

                ) {

                    try {

                        const fetch = global.fetch || (await import("node-fetch")).default;

                        await fetch(

                            "http://localhost:7071/api/reorderQueue",

                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body: JSON.stringify({

                                    productId:
                                        updated.id,

                                    product:
                                        updated.name,

                                    stock:
                                        updated.stock,

                                    minimumStock:
                                        updated.minimumStock

                                })

                            }

                        );

                    }

                    catch (queueError) {

                        context.log(

                            "Queue Error:",

                            queueError.message

                        );

                    }

                }

                return {

                    status: 200,

                    jsonBody: updated

                };

            }

            // =====================================
            // DELETE PRODUCT
            // =====================================

            if (method === "DELETE") {

                if (!id) {

                    return {

                        status: 400,

                        jsonBody: {

                            message: "Product ID required"

                        }

                    };

                }

                const deleted =
                    await productService.deleteProduct(id);

                return {

                    status: 200,

                    jsonBody: {

                        success: true,

                        deleted

                    }

                };

            }

            return {

                status: 405,

                jsonBody: {

                    message: "Method Not Allowed"

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