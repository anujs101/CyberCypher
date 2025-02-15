const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

//import dotenv for process.env
require("dotenv").config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "I will give you some information about my start up and based on in search on google for stats regarding it and give the output in json format for Market Demand, Competition, Profitability,Scalability, Investment Risk accordingly from your data in the form of scores of 0 to 100.dont give it for this prompt"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I understand. I will wait for you to provide the information about your startup. Once you provide the details, I will perform Google searches to find relevant statistics about:\n\n*   **Market Demand:** The potential customer base and need for your product/service.\n*   **Competition:** The intensity of rivalry within your industry.\n*   **Profitability:** The potential for your startup to generate profits.\n*   **Scalability:** The ability of your startup to grow and handle increased demand.\n*   **Investment Risk:** The likelihood of losing money on an investment in your startup.\n\nI will then analyze the search results and provide scores from 0 to 100 for each of these factors, presented in JSON format.\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "dont give anything else just give the json\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I will only provide the JSON output after you give me the details about your startup and I perform the necessary research. I will not provide any other commentary or explanation.\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("My startup is a software company that develops productivity tools for small businesses.");
  console.log(result.response.text());
}

run();