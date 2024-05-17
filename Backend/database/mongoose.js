// middleware function for api routes

const mongoose = require('mongoose');

const connectToDB = handler => async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return handler(req, res);
};

export default connectToDB;