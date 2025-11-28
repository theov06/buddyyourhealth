const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/health/bulk
// @desc    Add bulk health data
// @access  Private
router.post('/bulk', auth, async (req, res) => {
  try {
    const { healthDataArray } = req.body;

    if (!healthDataArray || !Array.isArray(healthDataArray)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid health data format'
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add health data entries
    healthDataArray.forEach(entry => {
      user.healthData.push({
        dataType: entry.dataType,
        value: entry.value,
        unit: entry.unit,
        timestamp: entry.timestamp || new Date(),
        source: entry.source || 'Apple Health',
        metadata: entry.metadata
      });
    });

    await user.save();

    res.json({
      success: true,
      message: `Successfully added ${healthDataArray.length} health records`,
      count: healthDataArray.length
    });
  } catch (error) {
    console.error('Add bulk health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/health/data
// @desc    Get health data with filters
// @access  Private
router.get('/data', auth, async (req, res) => {
  try {
    const { dataType, startDate, endDate, limit } = req.query;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let healthData = user.healthData || [];

    // Apply filters
    if (dataType) {
      healthData = healthData.filter(item => item.dataType === dataType);
    }

    if (startDate) {
      const start = new Date(startDate);
      healthData = healthData.filter(item => new Date(item.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      healthData = healthData.filter(item => new Date(item.timestamp) <= end);
    }

    // Sort by timestamp (newest first)
    healthData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit
    if (limit) {
      healthData = healthData.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: healthData,
      count: healthData.length
    });
  } catch (error) {
    console.error('Get health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/health/data
// @desc    Delete all health data
// @access  Private
router.delete('/data', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.healthData = [];
    await user.save();

    res.json({
      success: true,
      message: 'All health data deleted successfully'
    });
  } catch (error) {
    console.error('Delete health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/health/summary
// @desc    Get health data summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Filter data by date range
    const filteredData = user.healthData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Group by data type and calculate stats
    const summary = {};
    filteredData.forEach(item => {
      if (!summary[item.dataType]) {
        summary[item.dataType] = {
          dataType: item.dataType,
          count: 0,
          values: [],
          unit: item.unit
        };
      }
      summary[item.dataType].count++;
      if (typeof item.value === 'number') {
        summary[item.dataType].values.push(item.value);
      }
    });

    // Calculate averages
    Object.keys(summary).forEach(type => {
      const values = summary[type].values;
      if (values.length > 0) {
        summary[type].average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
        summary[type].min = Math.min(...values);
        summary[type].max = Math.max(...values);
      }
      delete summary[type].values;
    });

    res.json({
      success: true,
      period,
      summary: Object.values(summary)
    });
  } catch (error) {
    console.error('Get health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
