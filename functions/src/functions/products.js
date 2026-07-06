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

            // ===========================
            // GET
            // ===========================

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

            // ===========================
            // POST
            // ===========================

            if (method === "POST") {

                const body =
                    await request.json();

                const product =
                    await productService.createProduct(body);

                return {

                    status: 201,

                    jsonBody: product

                };

            }

            // ===========================
            // PUT
            // ===========================

            if (method === "PUT") {

                if (!id) {

                    return {

                        status: 400,

                        jsonBody: {

                            message: "Product ID is required"

                        }

                    };

                }

                const body =
                    await request.json();

                body.id = id;

                body.documentType = "Product";

                const updated =
                    await productService.updateProduct(body);

                return {

                    status: 200,

                    jsonBody: updated

                };

            }

            // ===========================
            // DELETE
            // ===========================

            if (method === "DELETE") {

                if (!id) {

                    return {

                        status: 400,

                        jsonBody: {

                            message: "Product ID is required"

                        }

                    };

                }

                const deleted =
                    await productService.deleteProduct(id);

                return {

                    status: 200,

                    jsonBody: {

                        message: "Product deleted",

                        product: deleted

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