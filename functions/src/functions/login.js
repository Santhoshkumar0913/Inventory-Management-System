const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("login", {

    methods: ["POST"],

    authLevel: "anonymous",

    route: "login",

    handler: async (request, context) => {

        try {

            const body = await request.json();

            const email = body.email;
            const password = body.password;

            const container = getContainer();

            const querySpec = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = @type
                    AND c.email = @email
                    AND c.password = @password
                `,

                parameters: [

                    {
                        name: "@type",
                        value: "User"
                    },

                    {
                        name: "@email",
                        value: email
                    },

                    {
                        name: "@password",
                        value: password
                    }

                ]

            };

            const { resources } =
                await container.items
                    .query(querySpec)
                    .fetchAll();

            if (resources.length === 0) {

                return {

                    status: 401,

                    jsonBody: {

                        success: false,

                        message: "Invalid Email or Password"

                    }

                };

            }

            const user = resources[0];

            return {

                status: 200,

                jsonBody: {

                    success: true,

                    user: {

                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role

                    }

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