import { promises as fs } from "fs";
import path from "path";
import { head, put } from "@vercel/blob";
import { defaultContent, normalizeContent, type SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const CONTENT_BLOB_PATH = "content/site-content.json";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function getContentFromBlob(): Promise<SiteContent> {
  const blob = await head(CONTENT_BLOB_PATH);
  const response = await fetch(blob.url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Content blob not found");
  }

  return normalizeContent(await response.json());
}

async function saveContentToBlob(content: SiteContent): Promise<void> {
  await put(CONTENT_BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function getContentFromDisk(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_FILE, "utf-8");
  return normalizeContent(JSON.parse(raw));
}

async function saveContentToDisk(content: SiteContent): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export async function getContent(): Promise<SiteContent> {
  try {
    if (useBlobStorage()) {
      return await getContentFromBlob();
    }
    return await getContentFromDisk();
  } catch {
    await saveContent(defaultContent);
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  if (useBlobStorage()) {
    await saveContentToBlob(content);
    return;
  }
  await saveContentToDisk(content);
}

export function isAuthenticated(password: string | null): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}

export function usesBlobStorage(): boolean {
  return useBlobStorage();
}
