import { run } from "../gemini-radar.cjs";

async function updateChart() {
    try {
        const outputjson = await run(); // Fetch live Gemini data

        // Ensure outputjson is valid before updating chart
        if (!outputjson) {
            console.error("Error: Invalid JSON received from Gemini.");
            return;
        }

        const data = {
            labels: ["Market Demand", "Competition", "Profitability", "Scalability", "Investment Risk"],
            datasets: [{
                label: "Business Idea Score",
                data: [
                    outputjson["Market Demand"] || 0,
                    outputjson["Competition"] || 0,
                    outputjson["Profitability"] || 0,
                    outputjson["Scalability"] || 0,
                    outputjson["Investment Risk"] || 0
                ], // Ensure values exist, default to 0
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2
            }]
        };

        const config = {
            type: "radar",
            data: data,
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        suggestedMax: 100
                    }
                }
            }
        };

        // Initialize Chart.js
        const ctx = document.getElementById("radarChart").getContext("2d");
        new Chart(ctx, config);
    } catch (error) {
        console.error("Error fetching Gemini data:", error);
    }
}

// Fetch Gemini data and update the chart
updateChart();
