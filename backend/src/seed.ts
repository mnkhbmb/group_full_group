import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import { Property } from "./models/Property.js";
import { Tenant } from "./models/Tenant.js";
import { MeterReading } from "./models/MeterReading.js";
import { User } from "./models/User.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ubgroup";

await connectDB(MONGODB_URI);

await User.deleteMany({});
await Property.deleteMany({});
await Tenant.deleteMany({});
await MeterReading.deleteMany({});
console.log("✓ DB бүтэн цэвэрлэгдлээ");

await User.create({
  email: "admin",
  password: await bcrypt.hash("admin1234", 10),
  name: "Админ",
  role: "admin",
});
console.log("✓ admin / admin1234 үүслээ");

process.exit(0);
