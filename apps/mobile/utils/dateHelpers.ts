export function formatDateID(dateString: string): string {
  const date = new Date(dateString);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");

  return `${tanggal}, ${jam}:${menit}`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");
  return `${jam}:${menit}`;
}
