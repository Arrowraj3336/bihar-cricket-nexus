import { useEffect, useState } from "react";

type TransparentLogoImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const processedCache = new Map<string, string>();

const colorSpread = (r: number, g: number, b: number) => Math.max(r, g, b) - Math.min(r, g, b);

const isNeutralBackgroundPixel = (r: number, g: number, b: number, a: number) => {
  if (a === 0) return false;
  const spread = colorSpread(r, g, b);
  const brightness = (r + g + b) / 3;

  const isLightNeutral = spread <= 16 && brightness >= 150;
  const isDarkNeutral = spread <= 16 && brightness <= 40;

  return isLightNeutral || isDarkNeutral;
};

const TransparentLogoImage = ({ src, alt, className }: TransparentLogoImageProps) => {
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    if (!src) return;

    if (processedCache.has(src)) {
      setDisplaySrc(processedCache.get(src)!);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      if (cancelled) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setDisplaySrc(src);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;
        const visited = new Uint8Array(width * height);

        const queue: number[] = [];

        const pushIfBackground = (x: number, y: number) => {
          const pos = y * width + x;
          if (visited[pos]) return;

          const i = pos * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (!isNeutralBackgroundPixel(r, g, b, a)) return;

          visited[pos] = 1;
          queue.push(pos);
        };

        for (let x = 0; x < width; x++) {
          pushIfBackground(x, 0);
          pushIfBackground(x, height - 1);
        }

        for (let y = 0; y < height; y++) {
          pushIfBackground(0, y);
          pushIfBackground(width - 1, y);
        }

        while (queue.length > 0) {
          const pos = queue.shift()!;
          const i = pos * 4;

          data[i + 3] = 0;

          const x = pos % width;
          const y = Math.floor(pos / width);

          if (x > 0) pushIfBackground(x - 1, y);
          if (x < width - 1) pushIfBackground(x + 1, y);
          if (y > 0) pushIfBackground(x, y - 1);
          if (y < height - 1) pushIfBackground(x, y + 1);
        }

        ctx.putImageData(imageData, 0, 0);

        const processedSrc = canvas.toDataURL("image/png");
        processedCache.set(src, processedSrc);

        if (!cancelled) {
          setDisplaySrc(processedSrc);
        }
      } catch {
        if (!cancelled) {
          setDisplaySrc(src);
        }
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        setDisplaySrc(src);
      }
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return <img src={displaySrc} alt={alt} loading="lazy" className={className} />;
};

export default TransparentLogoImage;
