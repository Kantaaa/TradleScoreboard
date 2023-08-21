
/**
 * Get the weekday of a date.
 * @param date - The date object.
 * @returns The weekday (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
 */
export const getWeekday = (date: Date): number => {
  return date.getDay();
};
