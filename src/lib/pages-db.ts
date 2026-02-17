import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export interface PublishedPage {
  uuid: string;
  gameSlug: string;
  pageName: string;
  email: string;
  createdAt: string;
}

const DB_PATH = join(process.cwd(), "data", "pages.json");

function readDb(): PublishedPage[] {
  if (!existsSync(DB_PATH)) {
    return [];
  }
  const raw = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(pages: PublishedPage[]): void {
  writeFileSync(DB_PATH, JSON.stringify(pages, null, 2), "utf-8");
}

export function getAllPages(): PublishedPage[] {
  return readDb();
}

export function getPageByUuid(uuid: string): PublishedPage | undefined {
  return readDb().find((p) => p.uuid === uuid);
}

export function getPagesByEmail(email: string): PublishedPage[] {
  return readDb().filter(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );
}

export function createPage(
  gameSlug: string,
  pageName: string,
  email: string
): PublishedPage {
  const pages = readDb();
  const page: PublishedPage = {
    uuid: randomUUID(),
    gameSlug,
    pageName,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  pages.push(page);
  writeDb(pages);
  return page;
}

export function deletePageByUuid(uuid: string, email: string): boolean {
  const pages = readDb();
  const idx = pages.findIndex(
    (p) => p.uuid === uuid && p.email.toLowerCase() === email.toLowerCase()
  );
  if (idx === -1) return false;
  pages.splice(idx, 1);
  writeDb(pages);
  return true;
}
