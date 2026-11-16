"use client";
import { useState } from "react";

export function PhoenixGallery({ images, name, german }: { images: string[]; name: string; german: boolean }) {
  const [selected, setSelected] = useState(0);
  return <div className="phoenix-gallery">
    <div className="phoenix-main-image"><img src={images[selected]} alt={name} /></div>
    {images.length > 1 && <div className="phoenix-thumbs">{images.map((url, index) =>
      <button key={url} type="button" aria-label={(german ? "Bild " : "Image ") + (index + 1)}
        aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <img src={url} alt="" loading="lazy" />
      </button>)}</div>}
  </div>;
}
