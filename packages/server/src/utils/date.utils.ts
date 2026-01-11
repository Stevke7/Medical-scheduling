import { 
  addDays, 
  parseISO, 
  isAfter, 
  isBefore, 
  startOfDay, 
  endOfDay,
  eachDayOfInterval,
  format
} from 'date-fns';

/**
 * Get all dates in a range (inclusive)
 * Used for batch event creation
 * 
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns Array of date strings (YYYY-MM-DD)
 */
export const getDateRange = (startDate: string, endDate: string): string[] => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  const dates = eachDayOfInterval({ start, end });
  
  return dates.map(date => format(date, 'yyyy-MM-dd'));
};

/**
 * Check if a date is within a range
 */
export const isDateInRange = (
  date: Date,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  return !isBefore(date, rangeStart) && !isAfter(date, rangeEnd);
};

/**
 * Get start and end of a day in UTC
 */
export const getDayBoundsUTC = (date: Date): { start: Date; end: Date } => {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
};

/**
 * Add days to a date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Format date as YYYY-MM-DD
 */
export const formatDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse YYYY-MM-DD string to Date
 */
export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};
