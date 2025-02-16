const express = require('express');
const router = express.Router();
const { callGeminiApi } = require('../utils/geminiUtils'); // Import the utility function

router.post('/', async (req, res) => {
  try {
    const geminiResponse = await callGeminiApi(req); // Call the utility function
    res.send(geminiResponse);
  } catch (err) {
    console.error("Error in /gemini route:", err);
    if (err.message === "No token provided.") {
      res.status(401).send("Unauthorized: No token provided."); // 401 for unauthorized
    } else if (err.message === "Invalid token:") {
       res.status(401).send("Unauthorized: Invalid token."); // 401 for unauthorized
    } else if (err === "User ID not found") {
      res.status(400).send("Bad Request: User ID not found in token."); // 400 for bad request
    } else if (err === "No data found") {
      res.status(404).send("Not Found: No data found for this user."); // 404 for not found
    }
    else {
      res.status(500).send("Internal Server Error: An error occurred."); // 500 for internal server error
    }
  }
});

module.exports = router;