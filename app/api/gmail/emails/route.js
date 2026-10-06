import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../lib/models/User";
import Email from "../../../../lib/models/Email";
import { createGmailClient } from "../../../../lib/gmail";

function decodeBase64(data) {
  if (!data) return "";

  return Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf-8");
}

function getEmailBody(payload) {
  if (!payload) return "";

  // Simple email body
  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // Multipart email
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }

      const nestedBody = getEmailBody(part);

      if (nestedBody) {
        return nestedBody;
      }
    }
  }

  return "";
}

export async function GET() {
  try {
    await connectDB();

    // Find user
    const user = await User.findOne({
      email: "dnyandeoshekade5@gmail.com",
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Gmail client
    const gmail = createGmailClient(user.accessToken, user.refreshToken);

    // Get latest 10 emails
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = listResponse.data.messages || [];

    const emails = [];

    for (const message of messages) {
      // Get complete email
      const response = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      const data = response.data;
      const payload = data.payload;

      const headers = payload.headers || [];

      const getHeader = (name) => {
        const header = headers.find(
          (item) => item.name.toLowerCase() === name.toLowerCase(),
        );

        return header ? header.value : "";
      };

      const emailData = {
        user: user._id,
        gmailMessageId: data.id,
        threadId: data.threadId,
        from: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        body: getEmailBody(payload),
        receivedAt: new Date(Number(data.internalDate)),
        isRead: !data.labelIds?.includes("UNREAD"),
        isProcessed: false,
      };

      // Save or update email
      const savedEmail = await Email.findOneAndUpdate(
        {
          user: user._id,
          gmailMessageId: data.id,
        },
        emailData,
        {
          new: true,
          upsert: true,
        },
      );

      emails.push(savedEmail);
    }

    return NextResponse.json({
      success: true,
      count: emails.length,
      message: "Emails fetched and saved successfully",
      emails,
    });
  } catch (error) {
    console.error("Gmail Fetch Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch and save Gmail emails",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
