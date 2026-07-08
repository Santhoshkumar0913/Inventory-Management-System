const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

// ==========================================
// GET USERS
// ==========================================

app.http("users", {

    methods: ["GET"],

    authLevel: "anonymous",

    route: "users",

    handler: async () => {

        try {

            const container = getContainer();

            const query = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType=@type
                    ORDER BY c.name
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
                    .query(query)
                    .fetchAll();

            return {

                status: 200,

                jsonBody: resources

            };

        }

        catch (error) {

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

// ==========================================
// ADD USER
// ==========================================

app.http("addUser", {

    methods: ["POST"],

    authLevel: "anonymous",

    route: "users",

    handler: async (request) => {

        try {

            const body = await request.json();

            const container = getContainer();

            const id =
                "EMP" + Date.now();

            const user = {

                id,

                documentType: "User",

                name: body.name,

                email: body.email,

                password: "Welcome@123",

                role: body.role,

                status: body.status,

                mustChangePassword: true

            };

            await container.items.create(user);

            return {

                status: 201,

                jsonBody: {

                    success: true,

                    message: "User Created Successfully",

                    user

                }

            };

        }

        catch (error) {

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