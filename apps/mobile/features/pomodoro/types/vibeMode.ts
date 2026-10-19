export interface VibePreset {
  id: string;
  title: string;
  category: "lofi" | "nature" | "cafe" | "fireplace";
  videoId: string;
  description: string;
}

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: "lofi-girl",
    title: "Lofi Girl Study Stream",
    category: "lofi",
    videoId: "5qap5aO4i9A",
    description: "Lofi hip hop beats to study/relax to",
  },
  {
    id: "coffee-shop",
    title: "Cozy Coffee Shop",
    category: "cafe",
    videoId: "u68W-yOzE2M",
    description: "Suasana hangat kedai kopi & jazz santai",
  },
  {
    id: "rain-tokyo",
    title: "Rain in Tokyo",
    category: "nature",
    videoId: "s3rnPr_8Drs",
    description: "Rintik hujan malam hari di Tokyo",
  },
  {
    id: "cozy-fireplace",
    title: "Cozy Fireplace Library",
    category: "fireplace",
    videoId: "drLwMwNOo9g",
    description: "Perapian hangat di perpustakaan klasik",
  },
];

/**
 * Helper to extract an 11-character YouTube video ID from a URL or raw ID string.
 */
export function extractYoutubeVideoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // URL matching (youtu.be, watch?v=, embed/, live/, etc.)
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}
