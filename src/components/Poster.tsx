import Image from "next/image";
import { TMDB_IMAGE_BASE } from "@/lib/tmdb";

type Props = {
  path: string | null;
  alt: string;
  size?: "w185" | "w342" | "w500";
  className?: string;
};

export function Poster({ path, alt, size = "w342", className }: Props) {
  if (!path) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-xs text-neutral-500 ${className ?? ""}`}
      >
        no poster
      </div>
    );
  }
  return (
    <Image
      src={`${TMDB_IMAGE_BASE}/${size}${path}`}
      alt={alt}
      width={342}
      height={513}
      className={className}
      unoptimized
    />
  );
}
