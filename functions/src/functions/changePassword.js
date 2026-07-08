const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

app.http("changePassword", {

    methods: ["PUT"],

    authLevel: "anonymous",

    route: "changePassword",

    handler: async (request, context) => {

        try {

            const body = await request.json();

            const email = body.email?.trim();
            const oldPassword = body.oldPassword;
            const newPassword = body.newPassword;

            const container = getContainer();

            const querySpec = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = @type
                    AND c.email = @email
                `,

                parameters: [

                    {
                        name: "@type",
                        value: "User"
                    },

                    {
                        name: "@email",
                        value: email
                    }

                ]

            };

            const { resources } =
                await container.items
                    .query(querySpec)
                    .fetchAll();

            if (resources.length === 0) {

                return {

                    status: 404,

                    jsonBody: {

                        success: false,

                        message: "User not found"

                    }

                };

            }

            const user = resources[0];

            if (user.password !== oldPassword) {

                return {

                    status: 401,

                    jsonBody: {

                        success: false,

                        message: "Old password is incorrect"

                    }

                };

            }

            user.password = newPassword;
            user.mustChangePassword = false;

            // IMPORTANT:
            // Partition Key = documentType

            await container
                .item(
                    user.id,
                    user.documentType
                )
                .replace(user);

            return {

                status: 200,

                jsonBody: {

                    success: true,

                    message: "Password updated successfully"

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