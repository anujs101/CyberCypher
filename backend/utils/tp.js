
  const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const mongoose = require("mongoose");
  const jwt = require("jsonwebtoken");
  const dataModel = require("./backend/Db/db").dataModel;
  require("dotenv").config();
  
  const apiKey = process.env.API_KEY;
  const mongoURI = process.env.MONGODB_URI;
  const JWT_SECRET = process.env.JWT_SECRET; // Your JWT secret
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
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
  
  async function callGeminiApi(req) {
    try {
      // MongoDB connection
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
  
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        console.error("No token provided.");
        return;
      }
  
      return new Promise((resolve, reject) => { // Use a Promise to handle async jwt.verify
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
          if (err) {
            console.error("Invalid token:", err);
            reject(err); // Reject the promise if the token is invalid
            return;
          }
  
          const userId = decoded.userId;
  
          if (!userId) {
            console.error("User ID not found in token.");
            reject("User ID not found");
            return;
          }
  
          const jsonData = await dataModel.findOne({ user: userId });
  
          if (!jsonData) {
            console.error("No data found for this user in MongoDB.");
            reject("No data found");
            return;
          }
  
          const jsonString = JSON.stringify(jsonData);
  
          const parts = [
            {
              text: "input: {\n  \"sector\": \"technology\",\n  \"age\": 25,\n  \"teamSize\": 10,\n  \"amtInvest\": 5000000,\n  \"qualifications\": \"MTech AI\",\n  \"goal\": \"Launch an AI-powered SaaS platform with 100K users\",\n  \"advantages\": \"Experience in ML research, strong connections in AI community\",\n  \"jobExp\": \"5 years as ML Engineer at OpenAI\",\n\n}"
            },
            {
              text: "output: 1. Validating Your Business IdeaBefore diving deep into development, it's crucial to validate your AI-powered SaaS platform. Here’s how you can approach it:Problem-Solution Fit: Ensure your AI solution is addressing a real and pressing problem. Conduct customer interviews, run pilot programs, and gather early feedback.Market Research: AI-powered SaaS is competitive—identify your Unique Value Proposition (UVP) by studying competitors and analyzing gaps in their offerings.Prototype & MVP Development: Given your technical expertise, focus on building a lean MVP to test core functionalities with early adopters.User Testing & Iteration: Engage beta testers from your AI community and refine the product based on their feedback.2. Strategic Advice on Company Building & GrowthTeam Building: Since you have a 10-member team, ensure clear role definitions. Focus on a strong mix of tech (AI engineers, data scientists) and non-tech (growth, marketing, sales).Sales & GTM Strategy: Start with a niche target audience. Use inbound marketing (content, webinars, case studies) and outbound sales (cold outreach, partnerships) to acquire initial users.Partnerships & Networking: Leverage your AI community connections for early adopters, advisors, and potential customers.3. Challenges for Solo Founders & How to Overcome ThemWhile you have a team, as a founder, you may face these solo challenges:Decision Fatigue: Build an advisory network to consult for high-stakes decisions.Product vs. Business Balance: Avoid over-engineering; focus on business traction (user acquisition, retention, revenue) alongside development.Loneliness & Burnout: Set realistic goals, delegate effectively, and seek mentorship.4. Fundraising Preparation & Investor ConnectionsWith $5M already raised, the next steps involve efficient capital allocation and future fundraising readiness.Use of Funds: Prioritize spending on customer acquisition, hiring key talent (growth & sales), and infrastructure scalability.Investor Pitch: Prepare a compelling growth narrative (traction, revenue model, scalability) for future rounds.Networking: Engage with VCs, angel investors, and AI-focused funds early on, even if you don’t need funding immediately.5. Additional Insights & Growth StrategiesUser Growth: Use freemium models, referral incentives, and community-driven engagement to scale towards 100K users.Competitive Moat: Develop proprietary AI models or data network effects to differentiate your product.Exit Strategy: Whether IPO or acquisition, maintain a long-term vision aligned with industry trends.Final Takeaway:Your AI expertise and network are major strengths, but balancing business growth, product-market fit, and strategic execution will be key to success. Stay agile, iterate fast, and leverage your community to scale effectively. 🚀"
            },
            { text: `input: ${jsonString}` },
            { text: "output: " },
          ];
  
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
          });
  
          const responseText = result.response.text();
  
          await mongoose.disconnect();
          console.log("Disconnected from MongoDB");
          resolve(responseText); // Resolve the promise with the response text
  
        }); // end of jwt.verify
      }); // end of new Promise
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error to be caught by the route handler
    }
  }
  
  // Express route handler
  const express = require('express');
  const app = express();
  app.use(express.json()); // Important for parsing JSON request bodies
  
  app.post('/generate', async (req, res) => {
    try {
      const geminiResponse = await callGeminiApi(req);
      res.send(geminiResponse); // Send the Gemini API response back to the client
    } catch (err) {
      console.error("Error in route handler:", err);
      res.status(500).send("An error occurred.");
    }
  });
  
  module.exports = { callGeminiApi };