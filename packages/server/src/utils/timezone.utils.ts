import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { parseISO, addMinutes } from 'date-fns';

/**
 * Convert a local datetime string to UTC Date object
 * Used when doctor creates an event - they input local time, we store UTC
 * 
 * @param dateTimeString - ISO string or datetime string
 * @param timezone - IANA timezone (e.g., "Europe/Belgrade")
 * @returns Date object in UTC
 */
export const localToUTC = (dateTimeString: string, timezone: string): Date => {
  // Parse the datetime string as if it's in the given timezone, return UTC
  const date = parseISO(dateTimeString);
  return fromZonedTime(date, timezone);
};

/**
 * Convert UTC Date to local time string for display
 * Used when patient views events - we store UTC, they see local
 * 
 * @param utcDate - Date object (UTC)
 * @param timezone - IANA timezone for display
 * @param format - date-fns format string
 * @returns Formatted string in local timezone
 */
export const utcToLocalString = (
  utcDate: Date,
  timezone: string,
  format: string = "yyyy-MM-dd'T'HH:mm:ssXXX"
): string => {
  return formatInTimeZone(utcDate, timezone, format);
};

/**
 * Create a UTC Date from date and time components
 * Used for batch event creation
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @param timeString - Time in HH:mm format
 * @param timezone - Doctor's timezone
 * @returns Date object in UTC
 */
export const createUTCFromDateAndTime = (
  dateString: string,
  timeString: string,
  timezone: string
): Date => {
  const dateTimeString = `${dateString}T${timeString}:00`;
  return localToUTC(dateTimeString, timezone);
};

/**
 * Add duration to a date
 * 
 * @param date - Starting date
 * @param minutes - Minutes to add
 * @returns New Date object
 */
export const addMinutesToDate = (date: Date, minutes: number): Date => {
  return addMinutes(date, minutes);
};

/**
 * Check if a datetime is in the past
 */
export const isPast = (date: Date): boolean => {
  return date.getTime() < Date.now();
};

/**
 * Get minutes until a future date
 */
export const getMinutesUntil = (futureDate: Date): number => {
  const now = Date.now();
  const diff = futureDate.getTime() - now;
  return Math.floor(diff / (1000 * 60));
};

/**
 * Format a date for logging (UTC)
 */
export const formatForLog = (date: Date): string => {
  return date.toISOString();
};
