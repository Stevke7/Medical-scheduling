import { EventService, NotificationService } from '../services/index.js';
import { REMINDER_MINUTES_BEFORE, REMINDER_CHECK_INTERVAL_MS } from '@medical/shared';

let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Check for events that need reminders and send them
 * This runs on a regular interval
 */
const checkAndSendReminders = async (): Promise<void> => {
  try {
    // Get events starting in the next 5 minutes that haven't had reminders sent
    const events = await EventService.getEventsNeedingReminder(REMINDER_MINUTES_BEFORE);

    if (events.length === 0) {
      return;
    }

    console.log(`⏰ Found ${events.length} event(s) needing reminders`);

    for (const event of events) {
      try {
        // Type assertion for populated fields
        const populatedEvent = event as unknown as {
          _id: string;
          title: string;
          startTime: Date;
          endTime: Date;
          doctorId: { name: string };
          patientId: { _id: string; name: string; email: string; timezone: string };
        };

        // Send the reminder notification
        NotificationService.sendReminder(populatedEvent as any);

        // Mark reminder as sent
        await EventService.markReminderSent(event._id.toString());
        
        console.log(`✅ Reminder sent and marked for event: ${event.title}`);
      } catch (error) {
        console.error(`Failed to send reminder for event ${event._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Reminder scheduler error:', error);
  }
};

/**
 * Start the reminder scheduler
 * Runs every minute to check for upcoming events
 */
export const startReminderScheduler = (): void => {
  if (schedulerInterval) {
    console.log('⚠️ Reminder scheduler already running');
    return;
  }

  console.log('🕐 Starting reminder scheduler...');
  console.log(`   - Checking every ${REMINDER_CHECK_INTERVAL_MS / 1000} seconds`);
  console.log(`   - Sending reminders ${REMINDER_MINUTES_BEFORE} minutes before events`);

  // Run immediately on start
  checkAndSendReminders();

  // Then run on interval
  schedulerInterval = setInterval(checkAndSendReminders, REMINDER_CHECK_INTERVAL_MS);

  console.log('✅ Reminder scheduler started');
};

/**
 * Stop the reminder scheduler
 */
export const stopReminderScheduler = (): void => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('🛑 Reminder scheduler stopped');
  }
};

/**
 * Manually trigger a reminder check (useful for testing)
 */
export const triggerReminderCheck = async (): Promise<void> => {
  console.log('🔄 Manually triggering reminder check...');
  await checkAndSendReminders();
};
