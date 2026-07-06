// ================================
// Dashboard Chart
// frontend/js/dashboard.js
// ================================

const ctx = document.getElementById("inventoryChart");

if (ctx) {

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Laptops",
                "Monitors",
                "Mouse",
                "Keyboard",
                "SSD",
                "Router"
            ],

            datasets: [{

                label: "Available Stock",

                data: [
                    120,
                    80,
                    40,
                    35,
                    60,
                    25
                ],

                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#8b5cf6",
                    "#06b6d4"
                ],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        stepSize: 20

                    }

                }

            }

        }

    });

}