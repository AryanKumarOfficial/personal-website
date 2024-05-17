import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../Backend/Models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            authorize: async (credentials) => {
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("No user found");
                    }
                    console.log('====================================');
                    console.log(credentials);
                    console.log('====================================');
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error("Login failed. Please check your credentials.");
                }
            },
        }),
    ],
    session: {
        maxAge: 30 * 24 * 60 * 60,
        strategy: "jwt",
        updateAge: 24 * 60 * 60,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    debug: true,
    callbacks: {
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session(session, token) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.name = token.name;
            return session;
        },
    },

    pages: {
        signIn: "/admin/login",

    }
};

export default NextAuth(AuthOptions);
