/**
 * Returns a time-appropriate greeting based on the current hour.
 * - 05:00 - 11:59 -> Good morning
 * - 12:00 - 16:59 -> Good afternoon
 * - 17:00 - 04:59 -> Good evening
 *
 * @param date Optional Date object to derive hours from (defaults to `new Date()`)
 * @returns greeting string ("Good morning" | "Good afternoon" | "Good evening")
 */
export const getGreeting = (date: Date = new Date()): string => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return 'Good morning';
  }
  if (hours >= 12 && hours < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};
