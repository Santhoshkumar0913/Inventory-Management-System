const { CosmosClient } = require("@azure/cosmos");

let container = null;

function getContainer() {

    if (container) {
        return container;
    }

    const client = new CosmosClient(
        process.env.COSMOS_CONNECTION_STRING
    );

    const database = client.database(
        process.env.DATABASE_NAME
    );

    container = database.container(
        process.env.COSMOS_CONTAINER_NAME
    );

    return container;
}

module.exports = {
    getContainer
};