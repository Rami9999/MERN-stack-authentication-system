import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch (error) {
        console.log(`Error in connection to MongoDB: ${error.message}`);
        process.exit(1)
    }
}