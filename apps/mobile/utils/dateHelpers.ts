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

export function formatSessionDuration(seconds?: number): string {
  const s = Math.max(0, Math.round(seconds || 0));
  if (s < 60) {
    return `${s}d`;
  }
  const m = Math.floor(s / 60);
  const remainingSec = s % 60;
  if (m < 60) {
    return remainingSec > 0 ? `${m}m ${remainingSec}d` : `${m}m`;
  }
  const h = Math.floor(m / 60);
  const remainingMin = m % 60;
  return remainingMin > 0 ? `${h}j ${remainingMin}m` : `${h}j`;
}

export function getDeviceTimeZone(): string {
  try {
    const intlTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset(); // in minutes behind UTC (e.g. UTC+7 is -420)

    // In Hermes on Android release builds, intlTz often defaults to "UTC" or "Etc/UTC"
    // even though the device is set to an Indonesian or local timezone.
    if (intlTz && intlTz !== "UTC" && intlTz !== "Etc/UTC") {
      return intlTz;
    }

    // If offset is actually 0 and timezone says UTC, it is legitimately UTC
    if (offset === 0) {
      return "UTC";
    }

    // Indonesian timezone mappings based on standard offsets:
    // UTC+7 (WIB: Jakarta, Sumatra, Java, West/Central Kalimantan) -> -420 minutes
    if (offset === -420) return "Asia/Jakarta";
    // UTC+8 (WITA: Bali, NTB, NTT, South/East/North Kalimantan, Sulawesi) -> -480 minutes
    if (offset === -480) return "Asia/Makassar";
    // UTC+9 (WIT: Maluku, Papua) -> -540 minutes
    if (offset === -540) return "Asia/Jayapura";

    // General fallback for Indonesia default
    return "Asia/Jakarta";
  } catch {
    return "Asia/Jakarta";
  }
}
