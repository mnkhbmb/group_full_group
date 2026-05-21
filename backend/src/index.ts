import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import propertiesRouter from "./routes/properties.js";
import tenantsRouter from "./routes/tenants.js";
import meterReadingsRouter from "./routes/meterReadings.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ubgroup";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "";

app.use(cors({
  origin: (origin, callback) => {
    // Production: CORS_ORIGIN env-ээс авна
    // Development: 5173 port болон origin байхгүй (curl/postman) → зөвшөөр
    if (!origin) return callback(null, true);
    if (CORS_ORIGIN && origin === CORS_ORIGIN) return callback(null, true);
    if (!CORS_ORIGIN && origin.endsWith(":5173")) return callback(null, true);
    callback(new Error("CORS: зөвшөөрөгдөөгүй origin"));
  },
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/tenants", tenantsRouter);
app.use("/api/meter-readings", meterReadingsRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server ажиллаж байна: http://localhost:${PORT}`));
});
