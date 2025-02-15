const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://anuj:mongo2024@cluster0.hyvqjrf.mongodb.net/charcoal")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    dataEntries: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "DataModel" 
    }]  // Store references to data entries
}, { timestamps: true });

const dataSchema = new mongoose.Schema({
    sector: { type: String, required: true },
    age: { type: Number, required: true },
    teamSize: { type: Number, required: true },
    amtInvest: { type: Number, required: true },
    qualifications: { type: String, required: true },
    goal: { type: String, required: true },
    advantages: { type: String, required: true },
    jobExp: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const dataModel = mongoose.model("dataModel", dataSchema);

module.exports = { User, dataModel };