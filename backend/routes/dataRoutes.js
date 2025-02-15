const express = require("express");
const { User, dataModel } = require("../Db/db");

const router = express.Router();

// Add Data Entry and Link to User
router.post("/addData", async (req, res) => {
    try {
        const { userId, dataPayload } = req.body; // Extract userId and dataPayload

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Create new data entry
        const newData = new dataModel({
            ...dataPayload, // Spread the data payload
            user: userId // Link data entry to user
        });

        await newData.save(); // Save new data entry

        // Push data entry into user’s `dataEntries` array
        user.dataEntries.push(newData._id);
        await user.save(); // Save updated user

        return res.json({ msg: "Data entry created", data: newData });
    } catch (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ msg: "Error adding data", error: error.message });
    }
});

module.exports = router;
