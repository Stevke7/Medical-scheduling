import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addDays,
} from 'date-fns';

/**
 * Get all days to display in a calendar month view
 * Includes days from prev/next months to fill the grid
 */
export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/**
 * Get weekday names
 */
export const getWeekDays = (): string[] => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
};

/**
 * Navigate to next month
 */
export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

/**
 * Navigate to previous month
 */
export const getPrevMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

/**
 * Check if a date is in the given month
 */
export const isInMonth = (date: Date, monthDate: Date): boolean => {
  return isSameMonth(date, monthDate);
};

/**
 * Check if two dates are the same day
 */
export const isSameDayCheck = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * Check if date is today
 */
export const isTodayCheck = (date: Date): boolean => {
  return isToday(date);
};

/**
 * Format month and year for display
 */
export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

/**
 * Format day number
 */
export const formatDayNumber = (date: Date): string => {
  return format(date, 'd');
};

/**
 * Get date range for API calls (3 months ahead)
 */
export const getCalendarDateRange = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const endDate = addDays(addMonths(today, 3), 1);
  
  return {
    startDate: today.toISOString(),
    endDate: endDate.toISOString(),
  };
};

/**
 * Check if a date is within allowed range (today to 3 months ahead)
 */
export const isDateInAllowedRange = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = addMonths(today, 3);
  
  return date >= today && date <= maxDate;
};
