// this api will send an email to the user with a link to reset the password. The link will contain a token that will be used to verify the user and then the user can reset the password. The password will be updated in the database with the new password provided by the user in the request body

import connectToDB from "../../Backend/database/mongoose";
import User from "../../Backend/Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const handler = async (req, res) => {
    // this api is for sending the email to the user with the link to reset the password
    let success = true;
    try {
        if (req.method === "POST") {
            const { email } = req.body;
            if (!email) {
                return res.status(422).json({ error: "Please add all the fields", success: false });
            }
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(422).json({ error: "User does not exist with that email", success: false });
                }
                const token = crypto.randomBytes(20).toString("hex");
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                await user.save();
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD,
                    },
                });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Link To Reset Password",
                    html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n http://${req.headers.host}/reset/${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`, // html body
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal server error", success: false });
                    }
                    res.status(201).json({ message: "Email sent successfully", success });
                });
            } catch (error) {
                res.status(500).json({ error: "Internal server error", success: false });
            }
        } else {
            res.status(405).json({ error: "Method not allowed", success: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error", success: false });
    }

};

export default connectToDB(handler);