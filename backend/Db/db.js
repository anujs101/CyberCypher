const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anuj:mongo2024@cluster0.hyvqjrf.mongodb.net/charcoal')
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.error("MongoDB Connection Failed:", err));

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
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };