import { promises as fs } from "fs";
import path from "path";
import { defaultContent, normalizeContent, type SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    const content = normalizeContent(JSON.parse(raw));
    return content;
  } catch {
    await saveContent(defaultContent);
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export function isAuthenticated(password: string | null): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}
