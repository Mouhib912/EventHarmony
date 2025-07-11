const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createB2BMeeting,
  getEventB2BMeetings,
  getUserB2BMeetings,
  updateB2BMeetingStatus,
  deleteB2BMeeting,
} = require('../controllers/b2bMeetingController');

// Create a new B2B meeting
router.post('/', protect, createB2BMeeting);

// Get B2B meetings for an event
router.get('/event/:eventId', protect, getEventB2BMeetings);

// Get user's B2B meetings
router.get('/user', protect, getUserB2BMeetings);

// Update B2B meeting status
router.patch('/:meetingId/status', protect, updateB2BMeetingStatus);

// Delete B2B meeting
router.delete('/:meetingId', protect, deleteB2BMeeting);

module.exports = router;
