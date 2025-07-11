const mongoose = require('mongoose');

const B2BMeetingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  requesterCompany: {
    name: String,
    position: String,
    industry: String
  },
  recipientCompany: {
    name: String,
    position: String,
    industry: String
  },
  meetingTime: {
    type: Date,
    required: [true, 'Meeting time is required']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Duration is required']
  },
  location: {
    type: String,
    required: [true, 'Meeting location or booth number is required']
  },
  agenda: {
    type: String,
    required: [true, 'Meeting agenda is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

B2BMeetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('B2BMeeting', B2BMeetingSchema);
