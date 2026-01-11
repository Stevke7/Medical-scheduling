import React, { useState, useEffect } from 'react';
import {
  getCalendarDays,
  getWeekDays,
  getNextMonth,
  getPrevMonth,
  isInMonth,
  isSameDayCheck,
  isTodayCheck,
  formatMonthYear,
  formatDayNumber,
  isDateInAllowedRange,
} from '../../utils/date.utils';
import { addMonths } from 'date-fns';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  daysWithEvents: Date[];
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  daysWithEvents,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const weekDays = getWeekDays();
  const calendarDays = getCalendarDays(currentMonth);

  const today = new Date();
  const maxMonth = addMonths(today, 3);

  const canGoPrev = currentMonth > today;
  const canGoNext = currentMonth < maxMonth;

  const handlePrevMonth = () => {
    if (canGoPrev) {
      setCurrentMonth(getPrevMonth(currentMonth));
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setCurrentMonth(getNextMonth(currentMonth));
    }
  };

  const hasEvents = (date: Date): boolean => {
    return daysWithEvents.some((eventDate) => isSameDayCheck(eventDate, date));
  };

  const handleDayClick = (date: Date) => {
    if (isDateInAllowedRange(date)) {
      onDateSelect(date);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{formatMonthYear(currentMonth)}</h2>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth} disabled={!canGoPrev}>
            ← Prev
          </button>
          <button onClick={() => setCurrentMonth(new Date())}>Today</button>
          <button onClick={handleNextMonth} disabled={!canGoNext}>
            Next →
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {calendarDays.map((date, index) => {
          const isCurrentMonth = isInMonth(date, currentMonth);
          const isSelected = selectedDate && isSameDayCheck(date, selectedDate);
          const isToday = isTodayCheck(date);
          const dayHasEvents = hasEvents(date);
          const isAllowed = isDateInAllowedRange(date);

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                isToday ? 'today' : ''
              } ${dayHasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => isAllowed && handleDayClick(date)}
              style={{ cursor: isAllowed ? 'pointer' : 'not-allowed', opacity: isAllowed ? 1 : 0.5 }}
            >
              {formatDayNumber(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
