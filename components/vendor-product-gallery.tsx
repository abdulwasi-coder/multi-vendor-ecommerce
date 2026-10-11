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
    <div className="relative flex h-full min-h-0 flex-col overflow-visible rounded-xl border bg-card shadow-sm" onMouseLeave={() => setZoomOpen(false)}>
      <div className="relative min-h-0 flex-1 bg-muted/50" onMouseEnter={() => setZoomOpen(true)} onMouseMove={trackPointer}>
        {image ? <img src={image} alt={name} className="size-full object-contain" /> : <div className="flex size-full items-center justify-center"><ImageIcon className="size-12 text-muted-foreground/40" /></div>}
        {discount > 0 && <Badge className="absolute left-3 top-3 z-10">-{discount}%</Badge>}
        {image && zoomOpen && <>
          <div className="pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 border border-white/90 bg-white/35 shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }} />
          <div className="absolute left-[calc(100%+0.75rem)] top-0 z-40 hidden h-[calc(100%-0.75rem)] w-[min(70%,22rem)] overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:block">
            <div className="size-full bg-no-repeat" style={{ backgroundImage: `url("${image}")`, backgroundSize: "250%", backgroundPosition: `${pointer.x}% ${pointer.y}%` }} />
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/85 px-2.5 py-1.5 text-xs text-foreground shadow-sm backdrop-blur">Move cursor to zoom</span>
        </>}
      </div>
      <div className="flex h-[4.75rem] shrink-0 items-center gap-2 overflow-x-auto border-t bg-background px-3">
        {images.length > 0 ? images.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={index === activeImage} onClick={() => setActiveImage(index)} className={`size-12 shrink-0 overflow-hidden rounded-md border bg-muted transition ${index === activeImage ? "border-foreground ring-1 ring-foreground" : "opacity-70 hover:opacity-100"}`}><img src={src} alt="" className="size-full object-cover" /></button>) : <span className="text-sm text-muted-foreground">No product photos yet.</span>}
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">{images.length} photos</span>
      </div>
    </div>
  );
}
