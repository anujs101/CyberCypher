const { dataModel, User } = require("../Db/db");

const createDataEntry = async (req, res) => {
    try {
        const { userId, sector, age, teamSize, amtInvest, qualifications, goal, advantages, jobExp } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Create new data entry
        const dataEntry = await DataModel.create({
            sector,
            age,
            teamSize,
            amtInvest,
            qualifications,
            goal,
            advantages,
            jobExp,
            user: userId
        });

        // Add the new data entry to the user's dataEntries array
        user.dataEntries.push(dataEntry._id);
        await user.save();  // Save updated user

        res.json({ msg: "Data entry added successfully", dataEntry });
    } catch (error) {
        res.status(500).json({ msg: "Error adding data entry", error: error.message });
    }
};

module.exports = { createDataEntry };