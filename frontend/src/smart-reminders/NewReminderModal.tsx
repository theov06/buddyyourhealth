import React, { useState } from 'react';
import './NewReminderModal.css';

interface NewReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reminder: NewReminderData) => void;
}

export interface NewReminderData {
  title: string;
  description: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'medication' | 'exercise' | 'checkup' | 'wellness' | 'nutrition';
  priority: 'low' | 'medium' | 'high' | 'critical';
  addToCalendar: boolean;
  calendarType?: string;
}

export default function NewReminderModal({ isOpen, onClose, onSubmit }: NewReminderModalProps) {
  const [formData, setFormData] = useState<NewReminderData>({
    title: '',
    description: '',
    time: '09:00',
    frequency: 'daily',
    category: 'wellness',
    priority: 'medium',
    addToCalendar: false,
    calendarType: 'ics'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        time: '09:00',
        frequency: 'daily',
        category: 'wellness',
        priority: 'medium',
        addToCalendar: false,
        calendarType: 'ics'
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: keyof NewReminderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const categoryOptions = [
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
    { value: 'checkup', label: 'Checkup', icon: '🩺' },
    { value: 'wellness', label: 'Wellness', icon: '🧘‍♀️' },
    { value: 'nutrition', label: 'Nutrition', icon: '🥗' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#FFD700' },
    { value: 'medium', label: 'Medium', color: '#FFA500' },
    { value: 'high', label: 'High', color: '#FF8800' },
    { value: 'critical', label: 'Critical', color: '#FF4444' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '📆' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' },
    { value: 'custom', label: 'One-time', icon: '⏰' }
  ];

  return (
    <div className="new-reminder-overlay" onClick={onClose}>
      <div className="new-reminder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Create New Reminder</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="form-section">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g., Take morning vitamins"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-section">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Add details about this reminder..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              maxLength={500}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input time-input"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>

            <div className="form-section">
              <label className="form-label">Frequency</label>
              <select
                className="form-select"
                value={formData.frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {categoryOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`category-btn ${formData.category === option.value ? 'selected' : ''}`}
                  onClick={() => handleChange('category', option.value)}
                >
                  <span className="category-icon">{option.icon}</span>
                  <span className="category-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Priority</label>
            <div className="priority-grid">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`priority-btn ${formData.priority === option.value ? 'selected' : ''}`}
                  onClick={() => handleChange('priority', option.value)}
                  style={{
                    borderColor: formData.priority === option.value ? option.color : 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span 
                    className="priority-indicator"
                    style={{ backgroundColor: option.color }}
                  ></span>
                  <span className="priority-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section calendar-section">
            <div className="calendar-toggle">
              <input
                type="checkbox"
                id="new-reminder-calendar"
                checked={formData.addToCalendar}
                onChange={(e) => handleChange('addToCalendar', e.target.checked)}
              />
              <label htmlFor="new-reminder-calendar">
                <span className="toggle-icon">📅</span>
                Add to Calendar
              </label>
            </div>

            {formData.addToCalendar && (
              <div className="calendar-options">
                <div className="calendar-type-grid">
                  <button
                    type="button"
                    className={`calendar-type-btn ${formData.calendarType === 'google' ? 'selected' : ''}`}
                    onClick={() => handleChange('calendarType', 'google')}
                  >
                    <span className="calendar-icon">🔵</span>
                    <span className="calendar-name">Google</span>
                  </button>
                  <button
                    type="button"
                    className={`calendar-type-btn ${formData.calendarType === 'outlook' ? 'selected' : ''}`}
                    onClick={() => handleChange('calendarType', 'outlook')}
                  >
                    <span className="calendar-icon">🔷</span>
                    <span className="calendar-name">Outlook</span>
                  </button>
                  <button
                    type="button"
                    className={`calendar-type-btn ${formData.calendarType === 'ics' ? 'selected' : ''}`}
                    onClick={() => handleChange('calendarType', 'ics')}
                  >
                    <span className="calendar-icon">📥</span>
                    <span className="calendar-name">Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <span className="btn-icon">✓</span>
              Create Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
