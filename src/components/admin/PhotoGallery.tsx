"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Link2, Star, Trash2, Upload } from "lucide-react";

export function PhotoGallery({ initialImages }: { initialImages: string[] }) {
  const [urls, setUrls] = useState(initialImages);
  const [link, setLink] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    const input = fileInput.current;
    if (input) {
      const data = new DataTransfer();
      files.forEach((file) => data.items.add(file));
      input.files = data.files;
    }
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function addLink() {
    const value = link.trim();
    if (!value) return;
    setUrls((current) => (current.includes(value) ? current : [...current, value]));
    setLink("");
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Photos du plat</p>
      <p className="mb-3 text-xs text-muted">
        Plusieurs visuels possibles. La première photo (étoile) est celle affichée sur le site.
      </p>
      {urls.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}
      <input ref={fileInput} type="file" name="files" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((url, index) => (
          <figure key={url} className="relative overflow-hidden rounded-2xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-36 w-full object-cover" />
            {index === 0 ? (
              <span className="absolute top-2 left-2 rounded-full bg-quince px-2 py-0.5 text-[10px] font-semibold">
                Principale
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setUrls((current) => [url, ...current.filter((item) => item !== url)])}
                className="absolute top-2 left-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
                aria-label="Définir comme photo principale"
              >
                <Star className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setUrls((current) => current.filter((item) => item !== url))}
              className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
              aria-label="Retirer la photo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </figure>
        ))}
        {previews.map((url, index) => (
          <figure key={url} className="relative overflow-hidden rounded-2xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-36 w-full object-cover" />
            <span className="absolute bottom-2 left-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-white">
              Import {index + 1}
            </span>
            <button
              type="button"
              onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
              aria-label="Retirer l’import"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </figure>
        ))}
        <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-cream text-sm text-muted hover:bg-cream-dark">
          <Upload className="h-5 w-5" />
          Importer
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(event) => {
              const next = Array.from(event.target.files ?? []);
              if (next.length) setFiles((current) => [...current, ...next]);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addLink();
              }
            }}
            placeholder="Coller un lien https://…"
            className="h-11 w-full rounded-xl border border-line bg-cream pr-3 pl-10 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={addLink}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white"
        >
          <ImagePlus className="h-4 w-4" />
          Ajouter le lien
        </button>
      </div>
    </div>
  );
}
