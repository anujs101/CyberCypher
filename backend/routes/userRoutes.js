const express = require("express");
const { User } = require("../Db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.json({ msg: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ msg: "Error registering user", error: error.message });
    }
});
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        res.json(req.user); // `req.user` is set by authMiddleware
    } catch (error) {
        res.status(500).json({ msg: "Error fetching user", error: error.message });
    }
});

// Fetch User with Populated Data Entries
router.get("/:id",authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("dataEntries"); // Populate linked data
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching user", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

        res.json({ msg: "Login successful", token });
    } catch (error) {
        res.status(500).json({ msg: "Error logging in", error: error.message });
    }
});

module.exports = router;
