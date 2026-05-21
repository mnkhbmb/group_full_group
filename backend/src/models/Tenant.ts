import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    propertyIds: [{ type: String }],
  },
  { timestamps: true }
);

export const Tenant = mongoose.model("Tenant", tenantSchema);
