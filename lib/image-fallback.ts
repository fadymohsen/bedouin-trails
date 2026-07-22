export function getLocalFallbackImage(src: string | null | undefined): string {
  if (!src) return "/img/adventure.webp";
  return src;
}
