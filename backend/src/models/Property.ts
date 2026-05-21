import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    objectName: { type: String, required: true },
    floor: { type: String, required: true },
    areaId: { type: String, required: true, unique: true },
    areaSize: { type: Number, required: true },
    rentalAmount: { type: Number, required: true },
    pricePerSqm: { type: Number, required: true },
    managementFeePerSqm: { type: Number, required: true },
    status: { type: String, enum: ["rented", "vacant"], default: "vacant" },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", propertySchema);
