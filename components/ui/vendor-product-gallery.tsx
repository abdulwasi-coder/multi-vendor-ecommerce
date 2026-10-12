"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ZOOM_FACTOR = 3.5;

export function VendorProductGallery({
  images,
  name,
  discount,
  sku,
}: {
  images: string[];
  name: string;
  discount: number;
  sku: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomPanelRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLDivElement>(null);
  const image = images[activeImage];

  function trackPointer(event: MouseEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    const photo = imageRef.current;
    const lens = lensRef.current;
    const panel = zoomPanelRef.current;
    const zoomImage = zoomImageRef.current;
    if (!stage || !photo || !photo.naturalWidth || !photo.naturalHeight) return;

    const bounds = stage.getBoundingClientRect();
    const coverScale = Math.max(
      bounds.width / photo.naturalWidth,
      bounds.height / photo.naturalHeight,
    );
    const photoWidth = photo.naturalWidth * coverScale;
    const photoHeight = photo.naturalHeight * coverScale;
    const photoLeft = (bounds.width - photoWidth) / 2;
    const photoTop = (bounds.height - photoHeight) / 2;
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    if (
      localX < photoLeft ||
      localX > photoLeft + photoWidth ||
      localY < photoTop ||
      localY > photoTop + photoHeight
    ) {
      setZoomOpen(false);
      return;
    }
    setZoomOpen(true);
    if (!lens || !panel || !zoomImage) return;
    const imageX = (localX - photoLeft) / photoWidth;
    const imageY = (localY - photoTop) / photoHeight;

    const availableWidth = Math.max(0, window.innerWidth - bounds.right - 28);
    const panelWidth = availableWidth;
    const panelHeight = Math.min(680, window.innerHeight * 0.76);
    panel.style.width = `${panelWidth}px`;
    panel.style.height = `${panelHeight}px`;
    const lensWidth = panelWidth / ZOOM_FACTOR;
    const lensHeight = panelHeight / ZOOM_FACTOR;
    const pointX = photoLeft + imageX * photoWidth;
    const pointY = photoTop + imageY * photoHeight;

    lens.style.left = `${pointX}px`;
    lens.style.top = `${pointY}px`;
    lens.style.width = `${lensWidth}px`;
    lens.style.height = `${lensHeight}px`;
    zoomImage.style.backgroundSize = `${photo.naturalWidth * coverScale * ZOOM_FACTOR}px ${photo.naturalHeight * coverScale * ZOOM_FACTOR}px`;
    zoomImage.style.backgroundPosition = `${panelWidth / 2 - imageX * photoWidth * ZOOM_FACTOR}px ${panelHeight / 2 - imageY * photoHeight * ZOOM_FACTOR}px`;
  }

  return (
    <div
      className="relative flex h-full min-h-0 flex-col-reverse gap-3 overflow-visible sm:flex-row"
      onMouseLeave={() => setZoomOpen(false)}
    >
      <div className="flex shrink-0 gap-2 overflow-x-auto py-1 sm:w-16 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:py-0">
        {images.length > 0 ? (
          images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === activeImage}
              onMouseEnter={() => setActiveImage(index)}
              onFocus={() => setActiveImage(index)}
              onClick={() => setActiveImage(index)}
              className={`size-12 shrink-0 overflow-hidden rounded-md border bg-background transition ${index === activeImage ? "border-sky-600 ring-1 ring-sky-600" : "border-border hover:border-foreground/50"}`}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No photos</span>
        )}
      </div>

      <div
        ref={stageRef}
        className={`relative min-h-0 min-w-0 flex-1 bg-background ${zoomOpen ? "cursor-none" : "cursor-crosshair"}`}
        onMouseLeave={() => setZoomOpen(false)}
        onMouseMove={trackPointer}
      >
        {image ? (
          <img
            ref={imageRef}
            src={image}
            alt={name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-12 text-muted-foreground/40" />
          </div>
        )}
        {discount > 0 && (
          <Badge
            className="absolute bg-black text-yellow-300 border border-white left-3 top-3 "
          >
            -{discount}%
          </Badge>
        )}
        {sku && (
          <Badge
            variant="outline"
            className="absolute text-slate-200 right-3 top-3 "
          >
            {sku}
          </Badge>
        )}
        {image && zoomOpen && (
          <>
            <div
              ref={lensRef}
              className="inline pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/90 bg-sky-300/15 shadow-[0_1px_8px_rgba(0,0,0,0.2)] ring-1 ring-sky-600/50"
            >
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(2,132,199,0.65)]" />
            </div>
            <div
              ref={zoomPanelRef}
              className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-lg border border-border/80 bg-neutral-950 shadow-xl lg:block"
            >
              <div
                ref={zoomImageRef}
                className="size-full bg-no-repeat"
                style={{ backgroundImage: `url("${image}")` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
