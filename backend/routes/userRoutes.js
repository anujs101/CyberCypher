const express = require("express");
const { User } = require("../Db/db");
const router = express.Router();
// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        const newUser = await User.create({ name, email, password });

        res.status(201).json({ msg: "User created", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ msg: "Error creating user", error: error.message });
    }
});
// Fetch User with Populated Data Entries
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("dataEntries"); // Populate linked data
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching user", error: error.message });
    }
});
// Login Route (Automated Sign-in)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        res.json({ msg: "Login successful", userId: user._id });
    } catch (error) {
        res.status(500).json({ msg: "Login failed", error: error.message });
    }
});

module.exports = router;
