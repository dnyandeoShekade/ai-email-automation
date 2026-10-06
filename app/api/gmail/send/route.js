import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../lib/models/User";
import Email from "../../../../lib/models/Email";
import { sendEmail } from "../../../../lib/gmail";

export async function POST(request) {
  try {
    const { emailId, reply } = await request.json();

    if (!emailId || !reply) {
      return NextResponse.json(
        {
          error: "Email ID and reply are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const email = await Email.findById(emailId);

    if (!email) {
      return NextResponse.json(
        {
          error: "Email not found",
        },
        { status: 404 }
      );
    }

    const user = await User.findById(email.user);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    await sendEmail(
      user.accessToken,
      user.refreshToken,
      email.from,
      `Re: ${email.subject}`,
      reply
    );

    email.aiReply = reply;

    await email.save();

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
    });

  } catch (error) {
    console.error("Send Email Error:", error);

    return NextResponse.json(
      {
        error: "Failed to send email",
        message: error.message,
      },
      { status: 500 }
    );
  }
}