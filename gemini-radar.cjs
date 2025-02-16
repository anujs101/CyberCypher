const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

function splitAndConvertToJson(string) {
    try {
        const position = string.indexOf("{"); 
        const jsonString = string.slice(position, string.length - 4).trim(); 

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Invalid JSON format:", error);
        return null;
    }
}

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run() {
    const parts = [
        { text: "input: I want to create a startup which solves problems related to datascience and machine learning based on this give me stats based on google data" },
        { text: "output: `{\n  \"Market Demand\": 75,\n  \"Competition\": 65,\n  \"Profitability\": 70,\n  \"Scalability\": 80,\n  \"Investment Risk\": 55\n}`" },
        { text: "input: I want to establish a startup which sells online courses related to programming" },
        { text: "output: " },
        {text: "input:Now give the explanation of why you took those values in point form,give heading as 'explanation'"},
        {text: "output: "}
       
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
    });
    const responseText = result.response.text();
    const responses = responseText.split("Explanation");
    console.log("Stats Output:\n", responses[0]?.trim());

    console.log("Stats Output:\n", responses[0]?.trim());
    console.log("\nExplanation Output:\n", responses[1]?.trim());
   
   

}

run();
