import { useEffect, useRef, useState } from "react";

type PortfolioImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'/%3E";

export default function PortfolioImage({ src, alt, sizes, priority = false }: PortfolioImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority || shouldLoad) return;
    const image = imageRef.current;
    if (!image) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(image);
    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  return (
    <img
      ref={imageRef}
      src={shouldLoad ? src : PLACEHOLDER}
      data-src={shouldLoad ? undefined : src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
    />
  );
}
