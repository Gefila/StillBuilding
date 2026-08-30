/**
 * Format a Date object into 'YYYY-MM-DD' string according to the provided timezone.
 * Defaults to 'Asia/Jakarta' if invalid or not provided.
 */
export const getLocalDateString = (
  timeZone = "Asia/Jakarta",
  date: Date = new Date(),
): string => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (_err) {
    // Fallback to UTC if timezone is invalid
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }
};

/**
 * Get yesterday's date string 'YYYY-MM-DD' in the user's timezone.
 */
export const getYesterdayLocalDateString = (
  timeZone = "Asia/Jakarta",
  fromDate: Date = new Date(),
): string => {
  const yesterday = new Date(fromDate.getTime());
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(timeZone, yesterday);
};
