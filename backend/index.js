const express = require("express");
const { User } = require("./Db/db");

const app = express();
app.use(express.json());

app.post('/signup', async (req, res, next) => {
    try {
        const createPayload = req.body;

        await User.create({
            name: createPayload.name,
            email: createPayload.email,
            password: createPayload.password  // Fixed the typo here
        });

        res.json({ msg: "User created" });
    } catch (error) {
        res.status(500).json({ msg: "Error creating user", error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));