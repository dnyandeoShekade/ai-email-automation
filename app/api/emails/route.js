import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getEmails } from "@/lib/gmail";

export async function GET() {
  try {
    await connectDB();

    const user = await User.findOne();

    if (!user) {
      return NextResponse.json(
        { error: "User not connected" },
        { status: 401 },
      );
    }

    const emails = await getEmails(user.accessToken, user.refreshToken);

    return NextResponse.json({
      emails,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 },
    );
  }
}
