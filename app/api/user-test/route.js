import { connectDB } from "../../../lib/db";
import User from "../../../lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const user = await User.create({
      name: "Dnyandeo",
      email: "test@example.com",
      googleId: "test-google-id",
    });

    return Response.json({
      success: true,
      message: "User saved successfully",
      user,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "User save failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
