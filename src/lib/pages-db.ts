import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export interface PublishedPage {
  uuid: string;
  gameSlug: string;
  pageName: string;
  email: string;
  createdAt: string;
}

const USERS_DIR = join(process.cwd(), "data", "users");

/** Turn an email into a safe directory name: john@gmail.com → john-at-gmail-com */
function emailToDir(email: string): string {
  return email.toLowerCase().replace("@", "-at-").replace(/[^a-z0-9\-]/g, "-");
}

function userDir(email: string): string {
  return join(USERS_DIR, emailToDir(email));
}

function readPageFile(filePath: string): PublishedPage | null {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

/** Scan all user directories and collect every page. */
export function getAllPages(): PublishedPage[] {
  if (!existsSync(USERS_DIR)) return [];
  const pages: PublishedPage[] = [];
  for (const dir of readdirSync(USERS_DIR)) {
    const dirPath = join(USERS_DIR, dir);
    for (const file of readdirSync(dirPath)) {
      if (!file.endsWith(".json")) continue;
      const page = readPageFile(join(dirPath, file));
      if (page) pages.push(page);
    }
  }
  return pages;
}

/** Find a page by UUID across all user directories. */
export function getPageByUuid(uuid: string): PublishedPage | undefined {
  if (!existsSync(USERS_DIR)) return undefined;
  for (const dir of readdirSync(USERS_DIR)) {
    const filePath = join(USERS_DIR, dir, `${uuid}.json`);
    if (existsSync(filePath)) {
      return readPageFile(filePath) ?? undefined;
    }
  }
  return undefined;
}

/** List all pages belonging to a specific email. */
export function getPagesByEmail(email: string): PublishedPage[] {
  const dir = userDir(email);
  if (!existsSync(dir)) return [];
  const pages: PublishedPage[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const page = readPageFile(join(dir, file));
    if (page) pages.push(page);
  }
  return pages;
}

/** Create a new page and write it as data/users/<email-slug>/<uuid>.json */
export function createPage(
  gameSlug: string,
  pageName: string,
  email: string
): PublishedPage {
  const page: PublishedPage = {
    uuid: randomUUID(),
    gameSlug,
    pageName,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  const dir = userDir(email);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${page.uuid}.json`), JSON.stringify(page, null, 2), "utf-8");
  return page;
}

/** Delete a page only if it belongs to the given email. */
export function deletePageByUuid(uuid: string, email: string): boolean {
  const filePath = join(userDir(email), `${uuid}.json`);
  if (!existsSync(filePath)) return false;
  unlinkSync(filePath);
  return true;
}
