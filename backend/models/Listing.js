import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
  type: { type: String },
  size: { type: Number },
  uploadedAt: { type: String },
});

const listingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String },
  website: { type: String },
  keyFeatures: [String],
  attachments: [fileSchema], // ✅ store file objects
  verificationDocuments: [fileSchema], // ✅ store file objects
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Listing || mongoose.model("Listing", listingSchema);
