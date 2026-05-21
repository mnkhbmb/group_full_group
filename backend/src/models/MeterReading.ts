import mongoose from "mongoose";

const meterReadingSchema = new mongoose.Schema(
  {
    period: { type: String, required: true },     // "YYYY-MM"
    tenantId: { type: String, required: true },
    hotWater: { type: Number, required: true },
    coldWater: { type: Number, required: true },
    heating: { type: Number, required: true },
    electricity: { type: Number, required: true },
  },
  { timestamps: true }
);

meterReadingSchema.index({ period: 1, tenantId: 1 }, { unique: true });

export const MeterReading = mongoose.model("MeterReading", meterReadingSchema);
