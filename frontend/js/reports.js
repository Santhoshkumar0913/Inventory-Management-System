// ==========================================
// Generate Inventory Report
// ==========================================

async function generateReport() {

    try {

        const response =
            await apiGet("uploadReport");

        const status =
            document.getElementById("reportStatus");

        status.innerHTML = `

<p>

<b>Report Generated Successfully!</b>

</p>

<br>

<p>

<b>File Name:</b>

${response.fileName}

</p>

<br>

<p>

<b>Blob URL:</b>

<a href="${response.url}" target="_blank">

${response.url}

</a>

</p>

`;

        alert("Inventory Report uploaded to Azure Blob Storage.");

    }

    catch (error) {

        console.error(error);

        alert("Unable to generate report.");

    }

}