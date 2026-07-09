const { app } = require("@azure/functions");
const { getContainer } = require("../config/cosmosClient");

// =====================================================
// USERS API
// =====================================================

app.http("users", {

    methods: ["GET", "POST", "PUT"],

    authLevel: "anonymous",

    route: "users/{id?}",

    handler: async (request) => {

        try {

            const container = getContainer();

            const method = request.method;
            const id = request.params.id;

            // ==========================================
            // GET USERS
            // ==========================================

            if (method === "GET") {

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

            // ==========================================
            // ADD USER
            // ==========================================

            if (method === "POST") {

                const body =
                    await request.json();

                // -----------------------------
                // Email Already Exists
                // -----------------------------

                const emailQuery = {

                    query: `
                        SELECT *
                        FROM c
                        WHERE c.documentType="User"
                        AND LOWER(c.email)=LOWER(@email)
                    `,

                    parameters: [

                        {

                            name: "@email",

                            value: body.email

                        }

                    ]

                };

                const {

                    resources: emailUsers

                } = await container.items
                    .query(emailQuery)
                    .fetchAll();

                if (emailUsers.length > 0) {

                    return {

                        status: 409,

                        jsonBody: {

                            success: false,

                            message:
                                "Email already exists."

                        }

                    };

                }

                // -----------------------------
                // Name + Email Exists
                // -----------------------------

                const duplicateQuery = {

                    query: `
                        SELECT *
                        FROM c
                        WHERE c.documentType="User"
                        AND LOWER(c.name)=LOWER(@name)
                        AND LOWER(c.email)=LOWER(@email)
                    `,

                    parameters: [

                        {

                            name: "@name",

                            value: body.name

                        },

                        {

                            name: "@email",

                            value: body.email

                        }

                    ]

                };

                const {

                    resources: duplicateUsers

                } = await container.items
                    .query(duplicateQuery)
                    .fetchAll();

                if (duplicateUsers.length > 0) {

                    return {

                        status: 409,

                        jsonBody: {

                            success: false,

                            message:
                                "User already exists."

                        }

                    };

                }

                const user = {

                    id:
                        "EMP" + Date.now(),

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

                        message:
                            "User Created Successfully",

                        user

                    }

                };

            }

            // ==========================================
            // UPDATE USER STATUS
            // ==========================================

            if (method === "PUT") {

                if (!id) {

                    return {

                        status: 400,

                        jsonBody: {

                            success: false,

                            message:
                                "User ID required."

                        }

                    };

                }

                const body =
                    await request.json();

                const {

                    resource: user

                } = await container
                    .item(id, id)
                    .read();

                if (!user) {

                    return {

                        status: 404,

                        jsonBody: {

                            success: false,

                            message:
                                "User not found."

                        }

                    };

                }

                user.status =
                    body.status;

                await container
                    .item(id, id)
                    .replace(user);

                return {

                    status: 200,

                    jsonBody: {

                        success: true,

                        message:
                            "User status updated.",

                        user

                    }

                };

            }

            return {

                status: 405,

                jsonBody: {

                    success: false,

                    message:
                        "Method Not Allowed"

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