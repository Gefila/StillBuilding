const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

export function formatDateID(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const tanggal = fullDateFormatter.format(date);
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");

  return `${tanggal}, ${jam}:${menit}`;
}

export function formatTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");
  return `${jam}:${menit}`;
}

export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "Hari Ini";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Hari Ini";
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return "Hari Ini";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

  return shortDateFormatter.format(date);
}

export function formatLastSessionTime(dateString?: string): string {
  if (!dateString) return "";
  const relativeDate = formatRelativeDate(dateString);
  const time = formatTime(dateString);
  if (!time) return relativeDate;
  return `${relativeDate}, ${time}`;
}
