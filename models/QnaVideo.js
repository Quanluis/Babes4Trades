// models/QnaVideo.js
const mongoose = require("mongoose");

const QnaVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    modelSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    videoId: { type: String, required: true, trim: true },
    tier: { type: String, enum: ["basic", "premium"], default: "basic", index: true },
    uploadedAt: { type: Date, default: Date.now, index: true },
  },
  { collection: "qnaVideos" }
);

// ✅ model name should be singular; collection is controlled above
module.exports = mongoose.models.QnaVideo || mongoose.model("QnaVideo", QnaVideoSchema);
