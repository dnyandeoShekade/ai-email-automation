import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Email from "../../../../lib/models/Email";
import { analyzeEmail } from "../../../../lib/ai";

export async function GET() {
  try {
    await connectDB();

    // Get one unprocessed email
    const email = await Email.findOne({
      isProcessed: false,
    });

    if (!email) {
      return NextResponse.json({
        success: true,
        message: "No unprocessed emails found",
      });
    }

    // Send email to Gemini
    const aiResult = await analyzeEmail(email.subject, email.body);

    email.aiSummary = aiResult.summary;
    email.category = aiResult.category;
    email.isProcessed = true;

    await email.save();

    // return NextResponse.json({
    //   success: true,
    //   message: "Email analyzed successfully",
    //   email: {
    //     id: email._id,
    //     subject: email.subject,
    //     aiSummary: email.aiSummary,
    //   },
    // });
    return NextResponse.json({
      success: true,
      message: "Email analyzed successfully",
      email: {
        id: email._id,
        subject: email.subject,
        aiSummary: email.aiSummary,
        category: email.category,
      },
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze email",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
