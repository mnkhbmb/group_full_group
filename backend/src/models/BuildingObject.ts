import mongoose from "mongoose";

const objectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const BuildingObject = mongoose.model("BuildingObject", objectSchema);
