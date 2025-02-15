const jwt = require("jsonwebtoken");
const { User } = require("../Db/db");

const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.header("Authorization")?.split(" ")[1];
        
        if (!token) {
            console.log("No token found"); // Log when no token is found
            return res.status(401).json({ msg: "Access Denied: No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, "your_jwt_secret");
        // Attach user to request object
        req.user = await User.findById(decoded.id);
        
        if (!req.user) return res.status(404).json({ msg: "User not found" });
        
        next();
    } catch (error) {
        console.log("Auth Error:", error.message); // Log any errors
        res.status(400).json({ msg: "Invalid Token", error: error.message });
    }
};

module.exports = authMiddleware;