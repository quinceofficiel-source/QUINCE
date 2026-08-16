import fs from "node:fs";
import path from "node:path";
import type { AdminState } from "@/lib/admin/types";

const FILE = path.join(process.cwd(), ".data", "admin-store.json");

export function storeFileMtime() {
  try {
    return fs.statSync(FILE).mtimeMs;
  } catch {
    return 0;
  }
}

export function readPersistedState(): AdminState | null {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as AdminState;
  } catch {
    return null;
  }
}

export function writePersistedState(state: AdminState) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(state));
  } catch {
    /* filesystem may be read-only in some hosts */
  }
}
