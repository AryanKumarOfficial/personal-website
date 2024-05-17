import User from "../../Backend/Models/User";
import connectToDB from "../../Backend/database/mongoose";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
    let success = true;
    try {
        if (req.method === "POST") {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                return res.status(422).json({ error: "Please add all the fields", success: false });
            }
            try {
                const user = await User.findOne({ email });
                if (user) {
                    return res.status(422).json({ error: "User already exists with that email", success: false });
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = new User({
                    email,
                    password: hashedPassword,
                    name,
                });
                await newUser.save();
                res.status(201).json({ message: "User created successfully", success, user });
            } catch (error) {
                res.status(500).json({ error: "Internal server error", success: false });
            }
        }
        else {
            res.status(405).json({ error: "Method not allowed", success: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error", success: false });
    }
}

export default connectToDB(handler);