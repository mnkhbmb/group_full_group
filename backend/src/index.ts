import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import propertiesRouter from "./routes/properties.js";
import tenantsRouter from "./routes/tenants.js";
import meterReadingsRouter from "./routes/meterReadings.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import objectsRouter from "./routes/objects.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ubgroup";

// CORS — бүх origin зөвшөөр (production-д хожим хязгаарлана)
app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/objects", objectsRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/tenants", tenantsRouter);
app.use("/api/meter-readings", meterReadingsRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server ажиллаж байна: http://localhost:${PORT}`));

connectDB(MONGODB_URI).catch((err) => {
  console.error("MongoDB холбогдоход алдаа:", err.message);
});
