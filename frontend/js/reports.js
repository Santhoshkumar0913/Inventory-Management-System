// ==========================================
// Authentication
// ==========================================

requireLogin();

const currentUser =
    getUser();

const canGenerate =
    hasRole("Admin", "Manager");

// ==========================================
// Initialize
// ==========================================

window.onload = function () {

    const btn =
        document.getElementById(
            "generateReportBtn"
        );

    if (btn && !canGenerate) {

        btn.style.display = "none";

    }

};

// ==========================================
// Generate Inventory Report
// ==========================================

async function generateReport() {

    if (!canGenerate) {

        alert("Access Denied");

        return;

    }

    try {

        const response =
            await apiGet(

                `uploadReport?role=${currentUser.role}`

            );

        const status =

            document.getElementById(
                "reportStatus"
            );

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

<a
href="${response.url}"
target="_blank">

${response.url}

</a>

</p>

`;

        alert(

            "Inventory Report uploaded to Azure Blob Storage."

        );

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}