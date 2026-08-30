export const statsKeys = {
  all: ["stats"] as const,
  heatmap: (weeks = 16) => [...statsKeys.all, "heatmap", weeks] as const,
};
