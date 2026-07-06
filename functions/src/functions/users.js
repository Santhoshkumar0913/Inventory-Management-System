const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("users", {

    methods: ["GET", "POST"],

    authLevel: "anonymous",

    route: "users/{id?}",

    handler: async (request, context) => {

        try {

            const container = getContainer();

            // ===================================
            // GET USERS
            // ===================================

            if (request.method === "GET") {

                const querySpec = {

                    query: `
                        SELECT *
                        FROM c
                        WHERE c.documentType = @type
                    `,

                    parameters: [

                        {
                            name: "@type",
                            value: "User"
                        }

                    ]

                };

                const { resources } =
                    await container.items
                        .query(querySpec)
                        .fetchAll();

                return {

                    status: 200,

                    jsonBody: resources

                };

            }

            // ===================================
            // CREATE USER
            // ===================================

            if (request.method === "POST") {

                const body =
                    await request.json();

                body.documentType = "User";

                body.status = "Active";

                body.createdDate =
                    new Date().toISOString().split("T")[0];

                const { resource } =
                    await container.items.create(body);

                return {

                    status: 201,

                    jsonBody: resource

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