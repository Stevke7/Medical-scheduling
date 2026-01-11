import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Get the user's IANA timezone string
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Format a UTC ISO string to local time for display
 * 
 * @param isoString - UTC ISO string from server
 * @param formatStr - date-fns format string
 * @returns Formatted string in user's local timezone
 */
export const formatToLocalTime = (
  isoString: string,
  formatStr: string = 'MMM d, yyyy h:mm a'
): string => {
  const timezone = getUserTimezone();
  const date = parseISO(isoString);
  return formatInTimeZone(date, timezone, formatStr);
};

/**
 * Format date for API (ISO string)
 */
export const formatForAPI = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format a date for display (local)
 */
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Format time for input fields (HH:mm)
 */
export const formatTimeForInput = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Format date for input fields (yyyy-MM-dd)
 */
export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Combine date and time strings into ISO string with timezone consideration
 * Used when doctor creates an event
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): string => {
  return `${dateStr}T${timeStr}:00`;
};
