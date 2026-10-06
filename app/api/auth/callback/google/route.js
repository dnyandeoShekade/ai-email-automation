import { NextResponse } from "next/server";
import { google } from "googleapis";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../lib/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 },
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Use tokens to get Google user information
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: profile } = await oauth2.userinfo.get();

    // Connect MongoDB
    await connectDB();

    // Save or update user
    const user = await User.findOneAndUpdate(
      { email: profile.email },
      {
        name: profile.name,
        email: profile.email,
        googleId: profile.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
      {
        new: true,
        upsert: true,
      },
    );

    console.log("Google user saved:", user.email);

    return NextResponse.json({
      message: "Gmail connected successfully!",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google OAuth Error:", error);

    return NextResponse.json(
      {
        error: "Google authentication failed",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
