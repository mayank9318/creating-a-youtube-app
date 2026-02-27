import connectDB from "./db/index.js"
import dotenv from "dotenv"
import app from "./app.js"

const envResult = dotenv.config({ path: "./.env" })
if (envResult.error) {
    console.error("Failed to load .env:", envResult.error.message)
}

const PORT = process.env.PORT || 8800

connectDB().catch((error) => {
    console.log("MongoDB connection failed:", error?.message || error)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


