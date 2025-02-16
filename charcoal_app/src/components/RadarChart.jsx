import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:3000/get-gemini-data");
                const data = await response.json();

                if (!data) {
                    console.error("Error: No valid data received from Gemini.");
                    return;
                }

                setChartData({
                    labels: ["Market Demand", "Competition", "Profitability", "Scalability", "Investment Risk"],
                    datasets: [{
                        label: "Business Idea Score",
                        data: [
                            data["Market Demand"] || 0,
                            data["Competition"] || 0,
                            data["Profitability"] || 0,
                            data["Scalability"] || 0,
                            data["Investment Risk"] || 0
                        ],
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 2
                    }]
                });

            } catch (error) {
                console.error("Error fetching Gemini data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h2>AI-Generated Business Idea Analysis</h2>
            {chartData ? <Radar data={chartData} options={{ responsive: true }} /> : <p>Loading...</p>}
        </div>
    );
};

export default RadarChart;
