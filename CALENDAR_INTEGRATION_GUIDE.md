# 📅 Neural Reminders - Calendar Integration Guide

## Overview

The Neural Reminders system now includes comprehensive calendar integration, allowing users to sync their AI-generated health insights with their preferred calendar applications.

## Features

### 🎯 Custom Time Selection
- **Quick Time Presets**: Morning (8:00), Noon (12:00), Afternoon (15:00), Evening (18:00), Night (21:00)
- **Custom Time Picker**: Select any specific time for your reminders
- **Smart Defaults**: AI suggests optimal times based on insight category:
  - Hydration: 8:00 AM
  - Exercise: 5:00 PM
  - Nutrition: 12:00 PM
  - Sleep: 9:00 PM
  - Stress Management: 3:00 PM

### 📱 Multi-Platform Calendar Support

#### 1. Google Calendar
- Direct integration via Google Calendar API
- Opens in new tab for immediate event creation
- Supports recurring events (daily, weekly, monthly)
- Includes all reminder details and categories

#### 2. Outlook Calendar
- Direct integration via Outlook Live Calendar
- Opens in new tab for immediate event creation
- Supports recurring events
- Compatible with Outlook.com and Office 365

#### 3. Universal .ics Export
- Download standard iCalendar (.ics) files
- Compatible with:
  - Apple Calendar (macOS, iOS)
  - Microsoft Outlook (Desktop)
  - Google Calendar (Import)
  - Any calendar app supporting .ics format
- Includes:
  - Event title and description
  - Start and end times
  - Recurrence rules
  - Priority levels
  - Categories and tags
  - 15-minute reminder alerts

## How to Use

### Applying Insights with Calendar Integration

1. **Initialize the System**
   - Click "INITIALIZE SYSTEM" to generate AI insights
   - Wait for the system to analyze your health profile

2. **Select an Insight**
   - Review the AI-generated health insights
   - Click "APPLY" on any insight you want to add

3. **Choose Your Time**
   - A time picker modal will appear
   - Select a quick preset or enter a custom time
   - The default time is optimized for the insight category

4. **Add to Calendar (Optional)**
   - Check "Add to Calendar" to enable calendar export
   - Choose your preferred calendar:
     - **Google**: Opens Google Calendar in browser
     - **Outlook**: Opens Outlook Calendar in browser
     - **Download .ics**: Downloads universal calendar file

5. **Confirm**
   - Click "Confirm & Apply"
   - The reminder is added to your Neural Reminders
   - If calendar integration is enabled, the event is exported

### Exporting Existing Reminders

Each reminder card includes a calendar export button (📅):
- Click the calendar icon on any reminder
- An .ics file is automatically downloaded
- Import this file into any calendar application

## Technical Details

### Calendar Event Structure

Each exported event includes:
```
- Title: Reminder title with emoji
- Description: Full insight description + metadata
- Start Time: User-selected time
- Duration: 30 minutes
- Recurrence: Based on reminder frequency
- Priority: Mapped from AI priority (critical=1, high=3, medium=5, low=7)
- Categories: Health, wellness, specific category
- Alarm: 15-minute advance notification
```

### Supported Frequencies
- **Daily**: Repeats every day
- **Weekly**: Repeats every week
- **Monthly**: Repeats every month
- **Custom**: One-time event (no recurrence)

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## File Structure

```
frontend/src/
├── services/
│   └── calendarService.ts          # Calendar integration logic
├── smart-reminders/
│   ├── SmartReminders.tsx          # Main component with calendar features
│   ├── SmartReminders.css          # Styling
│   ├── TimePickerModal.tsx         # Time selection modal
│   └── TimePickerModal.css         # Modal styling
```

## API Reference

### CalendarService Methods

#### `generateICS(event: CalendarEvent): string`
Generates iCalendar (.ics) file content from event data.

#### `downloadICS(event: CalendarEvent, filename?: string): void`
Downloads an .ics file to the user's device.

#### `addToGoogleCalendar(event: CalendarEvent): void`
Opens Google Calendar with pre-filled event data.

#### `addToOutlookCalendar(event: CalendarEvent): void`
Opens Outlook Calendar with pre-filled event data.

#### `createEventFromReminder(...): CalendarEvent`
Converts reminder data into a calendar event object.

#### `parseTimeToDate(timeString: string): Date`
Converts time string (HH:MM) to Date object.

#### `getUserTimezone(): string`
Returns the user's current timezone.

## Privacy & Security

- **No Data Storage**: Calendar integration doesn't store any data on external servers
- **Direct Export**: All calendar operations happen client-side
- **User Control**: Users explicitly choose when to export to calendar
- **No Tracking**: No analytics or tracking on calendar exports

## Troubleshooting

### Calendar Export Not Working
- **Check Pop-up Blocker**: Browser may block calendar windows
- **Enable Downloads**: Ensure browser allows file downloads
- **Try .ics Export**: Universal format works with all calendar apps

### Events Not Appearing in Calendar
- **Google/Outlook**: Make sure you're logged into the correct account
- **.ics Files**: Manually import the downloaded file into your calendar app

### Time Zone Issues
- Events use your browser's detected timezone
- Verify your system time zone settings are correct

## Future Enhancements

Planned features for future releases:
- [ ] Direct calendar API integration (OAuth)
- [ ] Two-way sync with calendar apps
- [ ] Bulk export of all reminders
- [ ] Calendar conflict detection
- [ ] Custom reminder durations
- [ ] Multiple reminder times per insight
- [ ] Integration with native device calendars

## Support

For issues or questions:
1. Check this guide first
2. Review the AI_SETUP_GUIDE.md for general setup
3. Check browser console for error messages
4. Ensure you have the latest version of the app

---

**Powered by Buddy Your Health - Neural Reminders System**
