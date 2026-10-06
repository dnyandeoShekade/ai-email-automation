import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    gmailMessageId: String,

    threadId: String,

    from: String,

    to: String,

    subject: String,

    body: String,

    receivedAt: Date,

    aiSummary: String,

    aiReply: String,

    category: String,

    isRead: Boolean,

    isProcessed: Boolean,
  },
  {
    timestamps: true,
  },
);

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
