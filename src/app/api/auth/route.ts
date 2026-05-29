import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/content";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (isAuthenticated(password)) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
