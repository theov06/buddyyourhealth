// Calendar Integration Service for Neural Reminders
// Supports Google Calendar, Apple Calendar, Outlook, and universal .ics export

interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: string;
  priority: string;
}

class CalendarService {
  // Generate iCalendar (.ics) file content
  generateICS(event: CalendarEvent): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const getRecurrenceRule = (frequency: string): string => {
      switch (frequency) {
        case 'daily':
          return 'RRULE:FREQ=DAILY';
        case 'weekly':
          return 'RRULE:FREQ=WEEKLY';
        case 'monthly':
          return 'RRULE:FREQ=MONTHLY';
        default:
          return '';
      }
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Buddy Your Health//Neural Reminders//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@buddyyourhealth.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(event.startTime)}`,
      `DTEND:${formatDate(event.endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}\\n\\nCategory: ${event.category}\\nPriority: ${event.priority}`,
      `CATEGORIES:${event.category},health,wellness`,
      `PRIORITY:${event.priority === 'critical' ? '1' : event.priority === 'high' ? '3' : event.priority === 'medium' ? '5' : '7'}`,
      getRecurrenceRule(event.frequency),
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(line => line).join('\r\n');

    return icsContent;
  }

  // Open with default calendar app (attempts to trigger calendar app directly)
  openWithCalendarApp(event: CalendarEvent): void {
    const icsContent = this.generateICS(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Create a link that will trigger the calendar app
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `neural-reminder-${Date.now()}.ics`;
    link.type = 'text/calendar';
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Click the link to trigger download/open
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    // On macOS/iOS, the .ics file will automatically prompt to open in Calendar app
    // On Windows, it will open in default calendar app (Outlook, etc.)
    // On other systems, it will download and user can click to open
  }

  // Download .ics file (legacy method, kept for compatibility)
  downloadICS(event: CalendarEvent, filename: string = 'neural-reminder.ics'): void {
    const icsContent = this.generateICS(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // Add to Google Calendar
  addToGoogleCalendar(event: CalendarEvent): void {
    const formatGoogleDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const getRecurrence = (frequency: string): string => {
      switch (frequency) {
        case 'daily':
          return '&recur=RRULE:FREQ=DAILY';
        case 'weekly':
          return '&recur=RRULE:FREQ=WEEKLY';
        case 'monthly':
          return '&recur=RRULE:FREQ=MONTHLY';
        default:
          return '';
      }
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      details: `${event.description}\n\nCategory: ${event.category}\nPriority: ${event.priority}\n\nPowered by Buddy Your Health - Neural Reminders`,
      dates: `${formatGoogleDate(event.startTime)}/${formatGoogleDate(event.endTime)}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}${getRecurrence(event.frequency)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Add to Outlook Calendar
  addToOutlookCalendar(event: CalendarEvent): void {
    const formatOutlookDate = (date: Date): string => {
      return date.toISOString();
    };

    const getRecurrence = (frequency: string): string => {
      switch (frequency) {
        case 'daily':
          return '&rru=daily';
        case 'weekly':
          return '&rru=weekly';
        case 'monthly':
          return '&rru=monthly';
        default:
          return '';
      }
    };

    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      body: `${event.description}\n\nCategory: ${event.category}\nPriority: ${event.priority}\n\nPowered by Buddy Your Health - Neural Reminders`,
      startdt: formatOutlookDate(event.startTime),
      enddt: formatOutlookDate(event.endTime),
      allday: 'false'
    });

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}${getRecurrence(event.frequency)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Parse time string (HH:MM) and create Date object for today
  parseTimeToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Create event from reminder data
  createEventFromReminder(
    title: string,
    description: string,
    timeString: string,
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom',
    category: string,
    priority: string
  ): CalendarEvent {
    const startTime = this.parseTimeToDate(timeString);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

    return {
      title,
      description,
      startTime,
      endTime,
      frequency,
      category,
      priority
    };
  }

  // Check if browser supports calendar APIs
  supportsCalendarAPI(): boolean {
    return 'showOpenFilePicker' in window || 'showSaveFilePicker' in window;
  }

  // Get user's timezone
  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export default new CalendarService();
