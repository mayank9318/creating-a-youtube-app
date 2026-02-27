import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...")
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`\n✅ MongoDB connected successfully!`)
        console.log(`📡 Host: ${connectionInstance.connection.host}`)
        console.log(`🏠 Database: ${connectionInstance.connection.name}`)
    } catch (error) {
        console.log("\n❌ MongoDB connection failed!")
        console.log("Error details:", error.message)
    }
}

export default connectDB;
