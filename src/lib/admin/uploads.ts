import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function saveProductUploads(productId: string, files: File[]) {
  const urls: string[] = [];
  if (!files.length) return urls;
  await mkdir(UPLOAD_DIR, { recursive: true });

  for (const file of files) {
    if (!file.size) continue;
    if (file.size > MAX_BYTES) {
      throw new Error(`« ${file.name} » dépasse 6 Mo.`);
    }
    if (!ALLOWED.has(file.type)) {
      throw new Error(`« ${file.name} » n’est pas une image acceptée (JPG, PNG, WebP, GIF).`);
    }
    const name = `${productId}-${Date.now()}-${Math.round(Math.random() * 9999)}.${extFor(file.type)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, name), buffer);
    urls.push(`/uploads/products/${name}`);
  }
  return urls;
}

export function uniqueImages(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const url = value.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    result.push(url);
  }
  return result;
}
