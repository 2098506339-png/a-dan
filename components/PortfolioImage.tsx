type PortfolioImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

export default function PortfolioImage({ src, alt, priority = false }: PortfolioImageProps) {
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />;
}
