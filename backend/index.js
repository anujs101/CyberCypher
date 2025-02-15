const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(express.json());

// Use modular routes
app.use("/user", userRoutes);
app.use("/data", dataRoutes);

// MongoDB connection
mongoose.connect("mongodb+srv://anuj:mongo2024@cluster0.hyvqjrf.mongodb.net/charcoal", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
