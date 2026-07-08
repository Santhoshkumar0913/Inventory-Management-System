const { app } = require("@azure/functions");
const { BlobServiceClient } = require("@azure/storage-blob");
const { getContainer } = require("../config/cosmosClient");

const connectionString =
    process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName =
    "inventoryreports";

app.http("uploadReport", {

    methods: ["GET"],

    authLevel: "anonymous",

    route: "uploadReport",

    handler: async (request, context) => {

        try {

            const role =
                request.query.get("role");

            if (

                role !== "Admin" &&
                role !== "Manager"

            ) {

                return {

                    status: 403,

                    jsonBody: {

                        success: false,

                        message: "Access Denied"

                    }

                };

            }

            const cosmos =
                getContainer();

            const query = {

                query: `
                    SELECT *
                    FROM c
                    WHERE c.documentType = "Product"
                `

            };

            const {

                resources: products

            } = await cosmos.items
                .query(query)
                .fetchAll();

            // =====================================
            // Generate CSV
            // =====================================

            let csv =
                "Product ID,Name,Category,Price,Stock,Minimum Stock,Supplier\n";

            products.forEach(product => {

                csv +=
`${product.id},${product.name},${product.category},${product.price},${product.stock},${product.minimumStock},${product.supplier}\n`;

            });

            // =====================================
            // Upload to Blob Storage
            // =====================================

            const blobServiceClient =

                BlobServiceClient
                    .fromConnectionString(

                        connectionString

                    );

            const containerClient =

                blobServiceClient
                    .getContainerClient(

                        containerName

                    );

            await containerClient
                .createIfNotExists();

            const fileName =

                `Inventory_Report_${Date.now()}.csv`;

            const blobClient =

                containerClient
                    .getBlockBlobClient(

                        fileName

                    );

            await blobClient.upload(

                csv,

                Buffer.byteLength(csv)

            );

            return {

                status: 200,

                jsonBody: {

                    success: true,

                    fileName,

                    url: blobClient.url

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