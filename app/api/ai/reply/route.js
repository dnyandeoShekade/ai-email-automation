import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Email from "../../../../lib/models/Email";
import { generateReply } from "../../../../lib/ai";

export async function GET() {
  try {
    await connectDB();

    const email = await Email.findOne({
      isProcessed: true,
      aiReply: { $in: [null, ""] },
    });

    if (!email) {
      return NextResponse.json({
        success: true,
        message: "No email found for reply generation",
      });
    }

    const reply = await generateReply(email.subject, email.body);

    email.aiReply = reply;

    await email.save();

    return NextResponse.json({
      success: true,
      message: "AI reply generated successfully",
      email: {
        id: email._id,
        subject: email.subject,
        aiSummary: email.aiSummary,
        category: email.category,
        aiReply: email.aiReply,
      },
    });
  } catch (error) {
    console.error("AI Reply Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate AI reply",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
