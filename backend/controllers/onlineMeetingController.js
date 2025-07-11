const OnlineMeeting = require('../models/OnlineMeeting');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new online meeting
exports.createOnlineMeeting = asyncHandler(async (req, res) => {
  const {
    title,
    startTime,
    endTime,
    meetingLink,
    description,
    agenda,
    participants,
  } = req.body;

  // Create the meeting
  const meeting = await OnlineMeeting.create({
    title,
    organizer: req.user.id,
    startTime,
    endTime,
    meetingLink,
    description,
    agenda,
    participants: participants.map(participantId => ({
      user: participantId,
      status: 'pending',
    })),
  });

  // Populate meeting details
  await meeting.populate([
    { path: 'organizer', select: 'firstName lastName email' },
    { path: 'participants.user', select: 'firstName lastName email' },
  ]);

  return res.status(201).json({ meeting });
});

// Get all meetings organized by user
exports.getOrganizedMeetings = asyncHandler(async (req, res) => {
  const meetings = await OnlineMeeting.find({ organizer: req.user.id })
    .populate([
      { path: 'organizer', select: 'firstName lastName email' },
      { path: 'participants.user', select: 'firstName lastName email' },
    ])
    .sort({ startTime: 1 });

  return res.json({ meetings });
});

// Get all meetings where user is a participant
exports.getParticipatingMeetings = asyncHandler(async (req, res) => {
  const meetings = await OnlineMeeting.find({
    'participants.user': req.user.id,
  })
    .populate([
      { path: 'organizer', select: 'firstName lastName email' },
      { path: 'participants.user', select: 'firstName lastName email' },
    ])
    .sort({ startTime: 1 });

  return res.json({ meetings });
});

// Update meeting status (for organizer)
exports.updateMeetingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const meeting = await OnlineMeeting.findById(req.params.meetingId);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  if (meeting.organizer.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this meeting' });
  }

  meeting.status = status;
  await meeting.save();
  await meeting.populate([
    { path: 'organizer', select: 'firstName lastName email' },
    { path: 'participants.user', select: 'firstName lastName email' },
  ]);

  return res.json({ meeting });
});

// Update participant status
exports.updateParticipantStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const meeting = await OnlineMeeting.findById(req.params.meetingId);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  const participant = meeting.participants.find(
    p => p.user.toString() === req.user.id
  );

  if (!participant) {
    return res.status(404).json({ message: 'Not a participant in this meeting' });
  }

  participant.status = status;
  await meeting.save();
  await meeting.populate([
    { path: 'organizer', select: 'firstName lastName email' },
    { path: 'participants.user', select: 'firstName lastName email' },
  ]);

  return res.json({ meeting });
});

// Delete meeting (organizer only)
exports.deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await OnlineMeeting.findById(req.params.meetingId);

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  if (meeting.organizer.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this meeting' });
  }

  await meeting.deleteOne();
  return res.json({ message: 'Meeting deleted successfully' });
});
