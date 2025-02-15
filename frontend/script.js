const data = {
    labels: ["Market Demand", "Competition", "Profitability", "Scalability", "Investment Risk"],
    datasets: [{
        label: "Business Idea Score",
        data: [85, 65, 75, 90, 50], // Scores for each category
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2
    }]
};

// Chart Configuration
const config = {
    type: "radar",
    data: data,
    options: {
        responsive: true,
        scales: {
            r: { // 'r' is for radar chart-specific scaling
                beginAtZero: true,
                suggestedMax: 100
            }
        }
    }
};

// Initialize the Chart
const ctx = document.getElementById("radarChart").getContext("2d");
new Chart(ctx, config);