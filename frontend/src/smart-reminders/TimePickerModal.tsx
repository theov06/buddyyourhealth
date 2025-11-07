import React, { useState } from 'react';
import './TimePickerModal.css';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string, addToCalendar: boolean, calendarType?: string) => void;
  insightTitle: string;
  defaultTime?: string;
}

export default function TimePickerModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  insightTitle,
  defaultTime = '09:00'
}: TimePickerModalProps) {
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState<string>('ics');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedTime, addToCalendar, calendarType);
    onClose();
  };

  const quickTimeOptions = [
    { label: 'Morning', time: '08:00', icon: '🌅' },
    { label: 'Noon', time: '12:00', icon: '☀️' },
    { label: 'Afternoon', time: '15:00', icon: '🌤️' },
    { label: 'Evening', time: '18:00', icon: '🌆' },
    { label: 'Night', time: '21:00', icon: '🌙' }
  ];

  return (
    <div className="time-picker-overlay" onClick={onClose}>
      <div className="time-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⏰ Set Reminder Time</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="insight-preview">
            <span className="preview-icon">💡</span>
            <span className="preview-text">{insightTitle}</span>
          </div>

          <div className="time-selection-section">
            <label className="section-label">Quick Select</label>
            <div className="quick-time-grid">
              {quickTimeOptions.map((option) => (
                <button
                  key={option.time}
                  className={`quick-time-btn ${selectedTime === option.time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(option.time)}
                >
                  <span className="quick-time-icon">{option.icon}</span>
                  <span className="quick-time-label">{option.label}</span>
                  <span className="quick-time-value">{option.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="custom-time-section">
            <label className="section-label">Custom Time</label>
            <input
              type="time"
              className="time-input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>

          <div className="calendar-integration-section">
            <div className="calendar-toggle">
              <input
                type="checkbox"
                id="add-to-calendar"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
              />
              <label htmlFor="add-to-calendar">
                <span className="toggle-icon">📅</span>
                Add to Calendar
              </label>
            </div>

            {addToCalendar && (
              <div className="calendar-options">
                <label className="section-label">Choose Calendar</label>
                <div className="calendar-type-grid">
                  <button
                    className={`calendar-type-btn ${calendarType === 'google' ? 'selected' : ''}`}
                    onClick={() => setCalendarType('google')}
                  >
                    <span className="calendar-icon">🔵</span>
                    <span className="calendar-name">Google</span>
                  </button>
                  <button
                    className={`calendar-type-btn ${calendarType === 'outlook' ? 'selected' : ''}`}
                    onClick={() => setCalendarType('outlook')}
                  >
                    <span className="calendar-icon">🔷</span>
                    <span className="calendar-name">Outlook</span>
                  </button>
                  <button
                    className={`calendar-type-btn ${calendarType === 'ics' ? 'selected' : ''}`}
                    onClick={() => setCalendarType('ics')}
                  >
                    <span className="calendar-icon">📥</span>
                    <span className="calendar-name">Download .ics</span>
                  </button>
                </div>
                <p className="calendar-hint">
                  {calendarType === 'ics' 
                    ? '📥 Download a universal calendar file that works with Apple Calendar, Outlook, and more'
                    : `🔗 Opens ${calendarType === 'google' ? 'Google' : 'Outlook'} Calendar in a new tab`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            <span className="btn-icon">✓</span>
            Confirm & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
