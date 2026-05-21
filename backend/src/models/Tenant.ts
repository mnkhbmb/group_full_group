import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    contractNumber: { type: String, required: true, unique: true },
    lastName: { type: String, default: "" },
    firstName: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    company: { type: String, default: "" },
    registerNumber: { type: String, default: "" },
    propertyIds: [{ type: String }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model("Tenant", tenantSchema);
