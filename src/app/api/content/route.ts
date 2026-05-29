import { NextRequest, NextResponse } from "next/server";
import { getContent, isAuthenticated, saveContent } from "@/lib/content";
import { normalizeContent, type SiteContent } from "@/lib/types";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const password = request.headers.get("x-admin-password");

  if (!isAuthenticated(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = normalizeContent(
      (await request.json()) as Record<string, unknown>
    );
    await saveContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
}
