const { app } = require("@azure/functions");
const { QueueClient } = require("@azure/storage-queue");

const connectionString =
    process.env.AZURE_STORAGE_CONNECTION_STRING;

const queueName = "reorderqueue";

app.http("reorderQueue", {

    methods: ["POST"],

    authLevel: "anonymous",

    route: "reorderQueue",

    handler: async (request, context) => {

        try {

            const body =
                await request.json();

            const queueClient =
                new QueueClient(
                    connectionString,
                    queueName
                );

            await queueClient.createIfNotExists();

            const message = {

                productId:
                    body.productId,

                product:
                    body.product,

                stock:
                    body.stock,

                minimumStock:
                    body.minimumStock,

                alert:
                    "Reorder Required",

                createdOn:
                    new Date().toISOString()

            };

            await queueClient.sendMessage(

                Buffer
                    .from(JSON.stringify(message))
                    .toString("base64")

            );

            return {

                status: 200,

                jsonBody: {

                    success: true,

                    message: "Reorder alert added to Azure Queue."

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