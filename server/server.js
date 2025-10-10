import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

//create http app
const app = express();

const server = http.createServer(app);

//middelware

// This allows the server to accept JSON in request bodies
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/status", (req, res) => {
  res.send("Server is live and running!");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // (Here, you would also connect to your database)
  // connectToDatabase();
});
