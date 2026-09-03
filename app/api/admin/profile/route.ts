export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, hashPassword, comparePassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function getAuthedUser() {
  const token = cookies().get("rama_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  await connectDB();
  return User.findById(payload.id);
}

// GET — fetch current admin profile
export async function GET() {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    return NextResponse.json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: (user as any).avatarUrl || null,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (e) {
    console.error("[profile GET]", e);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PUT — update name / password / avatarUrl
export async function PUT(req: Request) {
  try {
    const user = await getAuthedUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { name, currentPassword, newPassword, avatarUrl } = body;

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update avatar
    if (avatarUrl !== undefined) {
      (user as any).avatarUrl = avatarUrl;
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: "Current password is required to set a new password" }, { status: 400 });
      }
      const ok = await comparePassword(currentPassword, user.passwordHash);
      if (!ok) {
        return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: "New password must be at least 6 characters" }, { status: 400 });
      }
      user.passwordHash = await hashPassword(newPassword);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: (user as any).avatarUrl || null,
      },
    });
  } catch (e) {
    console.error("[profile PUT]", e);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
