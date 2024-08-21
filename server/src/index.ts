import express from "express";
import cors from "cors";

import authRoute from "./routes/auth"

const app = express()

app.use(express.json())
app.use(cors());

app.use("/auth", authRoute)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})