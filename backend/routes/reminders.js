const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   GET /api/reminders
// @desc    Get all reminders for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      reminders: user.reminders || []
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reminders'
    });
  }
});

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, time, frequency, category, priority } = req.body;

    if (!title || !time) {
      return res.status(400).json({
        success: false,
        message: 'Title and time are required'
      });
    }

    const userReminders = remindersStore.get(userId) || [];
    
    const newReminder = {
      id: `reminder-${Date.now()}`,
      title,
      description: description || '',
      time,
      frequency: frequency || 'daily',
      category: category || 'wellness',
      isActive: true,
      nextReminder: new Date(),
      aiGenerated: true,
      priority: priority || 'medium',
      createdAt: new Date()
    };

    userReminders.push(newReminder);
    remindersStore.set(userId, userReminders);

    res.json({
      success: true,
      reminder: newReminder,
      message: 'Reminder created successfully'
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reminder'
    });
  }
});

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    const userReminders = remindersStore.get(userId) || [];
    const reminderIndex = userReminders.findIndex(r => r.id === id);

    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    userReminders[reminderIndex] = {
      ...userReminders[reminderIndex],
      ...updates,
      updatedAt: new Date()
    };

    remindersStore.set(userId, userReminders);

    res.json({
      success: true,
      reminder: userReminders[reminderIndex],
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reminder'
    });
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const initialLength = user.reminders.length;
    user.reminders = user.reminders.filter(r => r.id !== id);

    if (user.reminders.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reminder'
    });
  }
});

// @route   POST /api/reminders/migrate-descriptions
// @desc    Update old reminder descriptions
// @access  Private
router.post('/migrate-descriptions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update descriptions for old reminders
    user.reminders.forEach(reminder => {
      if (reminder.description === 'Reminder created by B.A.G.AI') {
        if (reminder.category === 'wellness' && /water|hydrat/i.test(reminder.title)) {
          reminder.description = 'Stay hydrated throughout the day';
        } else if (reminder.category === 'exercise') {
          reminder.description = 'Daily workout session';
        } else if (reminder.category === 'medication') {
          reminder.description = 'Take your prescribed medication';
        } else if (reminder.category === 'nutrition') {
          reminder.description = 'Healthy meal time';
        } else {
          reminder.description = 'Health reminder for your wellness';
        }
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Reminder descriptions updated',
      reminders: user.reminders
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to migrate descriptions'
    });
  }
});

module.exports = router;
