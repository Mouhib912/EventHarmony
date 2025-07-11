const B2BMeeting = require('../models/B2BMeeting');
const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new B2B meeting request
const createB2BMeeting = asyncHandler(async (req, res) => {
  const { eventId, recipientId, meetingTime, duration, location, agenda, notes } = req.body;

  // Verify event exists and is active
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Verify recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  // Create the meeting
  const meeting = await B2BMeeting.create({
    event: eventId,
    requester: req.user.id,
    recipient: recipientId,
    requesterCompany: {
      name: req.user.company,
      position: req.user.position,
      industry: req.user.industry,
    },
    recipientCompany: {
      name: recipient.company,
      position: recipient.position,
      industry: recipient.industry,
    },
    meetingTime,
    duration,
    location,
    agenda,
    notes,
  });

  // Populate meeting details
  await meeting.populate(['requester', 'recipient', 'event']);
  return res.status(201).json({ meeting });
});

// Get B2B meetings for an event
const getEventB2BMeetings = asyncHandler(async (req, res) => {
  const meetings = await B2BMeeting.find({ event: req.params.eventId })
    .populate(['requester', 'recipient', 'event']);
  return res.json({ meetings });
});

// Get user's B2B meetings
const getUserB2BMeetings = asyncHandler(async (req, res) => {
  const meetings = await B2BMeeting.find({
    $or: [
      { requester: req.user.id },
      { recipient: req.user.id },
    ],
  }).populate(['requester', 'recipient', 'event']);
  return res.json({ meetings });
});

// Update B2B meeting status
const updateB2BMeetingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const meeting = await B2BMeeting.findById(req.params.meetingId);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  // Only recipient can update status
  if (meeting.recipient.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this meeting' });
  }

  meeting.status = status;
  await meeting.save();
  await meeting.populate(['requester', 'recipient', 'event']);

  return res.json({ meeting });
});

// Delete B2B meeting
const deleteB2BMeeting = asyncHandler(async (req, res) => {
  const meeting = await B2BMeeting.findById(req.params.meetingId);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  // Only requester or recipient can delete
  if (meeting.requester.toString() !== req.user.id && 
      meeting.recipient.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this meeting' });
  }

  await meeting.deleteOne();
  return res.json({ message: 'Meeting deleted successfully' });
});

module.exports = {
  createB2BMeeting,
  getEventB2BMeetings,
  getUserB2BMeetings,
  updateB2BMeetingStatus,
  deleteB2BMeeting,
};
