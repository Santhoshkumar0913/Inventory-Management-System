# Azure Resource Manager (ARM) Template

## Project

Cloud-based Inventory Management System

## Purpose

This ARM template deploys the Azure infrastructure required for the Inventory Management System.

## Azure Resources Included

- Azure App Service
- Azure Function App
- Azure Storage Account
- Azure Cosmos DB
- Azure App Service Plan

## Folder Structure

```
arm-templates/

│── template.json

│── parameters.json

└── README.md
```

## Deployment Command

```bash
az deployment group create \
--resource-group InventoryManagement-RG \
--template-file template.json \
--parameters parameters.json
```

## Azure Services Used

- Azure Cosmos DB
- Azure Blob Storage
- Azure Functions
- Azure Queue Storage
- Azure App Service
- Azure Resource Manager (ARM)

## Authors
