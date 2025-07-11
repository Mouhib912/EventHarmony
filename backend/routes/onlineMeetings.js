const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOnlineMeeting,
  getOrganizedMeetings,
  getParticipatingMeetings,
  updateMeetingStatus,
  updateParticipantStatus,
  deleteMeeting,
} = require('../controllers/onlineMeetingController');

// Create a new online meeting
router.post('/', protect, createOnlineMeeting);

// Get meetings organized by the user
router.get('/organized', protect, getOrganizedMeetings);

// Get meetings where user is a participant
router.get('/participating', protect, getParticipatingMeetings);

// Update meeting status (organizer only)
router.patch('/:meetingId/status', protect, updateMeetingStatus);

// Update participant status
router.patch('/:meetingId/participant-status', protect, updateParticipantStatus);

// Delete meeting (organizer only)
router.delete('/:meetingId', protect, deleteMeeting);

module.exports = router;
