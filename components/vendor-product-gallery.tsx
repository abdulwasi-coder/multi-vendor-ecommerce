"use client";

import { useState, type MouseEvent } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function VendorProductGallery({ images, name, discount }: { images: string[]; name: string; discount: number }) {
  const [activeImage, setActiveImage] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [zoomOpen, setZoomOpen] = useState(false);
  const image = images[activeImage];

  function trackPointer(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    setPointer({ x, y });
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col-reverse gap-3 overflow-visible sm:flex-row" onMouseLeave={() => setZoomOpen(false)}>
      <div className="flex shrink-0 gap-2 overflow-x-auto py-1 sm:w-16 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:py-0">
        {images.length > 0 ? images.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={index === activeImage} onMouseEnter={() => setActiveImage(index)} onFocus={() => setActiveImage(index)} onClick={() => setActiveImage(index)} className={`size-12 shrink-0 overflow-hidden rounded-md border bg-background transition ${index === activeImage ? "border-sky-600 ring-1 ring-sky-600" : "border-border hover:border-foreground/50"}`}><img src={src} alt="" className="size-full object-cover" /></button>) : <span className="text-xs text-muted-foreground">No photos</span>}
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 bg-background" onMouseEnter={() => setZoomOpen(true)} onMouseMove={trackPointer}>
        {image ? <img src={image} alt={name} className="size-full object-contain" /> : <div className="flex size-full items-center justify-center"><ImageIcon className="size-12 text-muted-foreground/40" /></div>}
        {discount > 0 && <Badge className="absolute left-3 top-3 z-10">-{discount}%</Badge>}
        {image && zoomOpen && <>
          <div className="pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 border border-white/90 bg-white/35 shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }} />
          <div className="absolute left-[calc(100%+0.75rem)] top-0 z-40 hidden h-full w-[min(70%,22rem)] overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:block">
            <div className="size-full bg-no-repeat" style={{ backgroundImage: `url("${image}")`, backgroundSize: "250%", backgroundPosition: `${pointer.x}% ${pointer.y}%` }} />
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/85 px-2.5 py-1.5 text-xs text-foreground shadow-sm backdrop-blur">Move cursor to zoom</span>
        </>}
      </div>
    </div>
  );
}
