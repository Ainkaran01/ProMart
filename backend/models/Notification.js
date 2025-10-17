// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["new_listing", "status_update", "re_approval"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Notification", notificationSchema);