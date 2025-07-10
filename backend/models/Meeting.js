const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
    default: 'pending'
  },
  proposedTimes: [{
    startTime: Date,
    endTime: Date
  }],
  confirmedTime: {
    startTime: Date,
    endTime: Date
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent self-meetings
MeetingSchema.pre('save', function(next) {
  if (this.requester.toString() === this.recipient.toString()) {
    return next(new Error('Cannot create a meeting with yourself'));
  }
  next();
});

// Method to check if meeting is upcoming
MeetingSchema.methods.isUpcoming = function() {
  if (!this.confirmedTime || !this.confirmedTime.startTime) return false;
  
  const now = new Date();
  return this.status === 'accepted' && now < this.confirmedTime.startTime;
};

// Method to check if meeting is in progress
MeetingSchema.methods.isInProgress = function() {
  if (!this.confirmedTime || !this.confirmedTime.startTime || !this.confirmedTime.endTime) return false;
  
  const now = new Date();
  return this.status === 'accepted' && 
         now >= this.confirmedTime.startTime && 
         now <= this.confirmedTime.endTime;
};

module.exports = mongoose.model('Meeting', MeetingSchema);