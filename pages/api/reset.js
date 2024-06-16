import connectToDB from "../../Backend/database/mongoose";
import User from "../../Backend/Models/User";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
    // this api is for resetting the password of the user by email verification and then updating the password in the database with the new password provided by the user in the request body
    let success = true;
    try {
        if (req.method === "POST") {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(422).json({ error: "Please add all the fields", success: false });
            }
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(422).json({ error: "User does not exist with that email", success: false });
                }
                bcrypt.genSalt(10, async (err, salt) => {
                    bcrypt.hash(password, salt, async (err, hashedPassword) => {
                        user.password = hashedPassword;
                        await user.save();
                        res.status(201).json({ message: "Password reset successfully", success, user });
                    });
                });
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
};

export default connectToDB(handler);