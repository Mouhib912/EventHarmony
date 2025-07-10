const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  coverImage: {
    type: String
  },
  logoImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  capacity: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  registrationDeadline: {
    type: Date
  },
  website: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  activeModules: [{
    type: String,
    enum: ['b2b_networking', 'participant_management', 'qr_code_scanning', 'analytics'],
    default: ['participant_management']
  }],
  badgeSettings: {
    template: {
      type: String,
      default: 'default'
    },
    fields: [{
      name: String,
      isVisible: Boolean
    }],
    customizations: {
      backgroundColor: String,
      textColor: String,
      logoPosition: String
    }
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'checked_in', 'cancelled'],
      default: 'registered'
    },
    badgePrinted: {
      type: Boolean,
      default: false
    },
    remarks: String
  }],
  b2bMeetings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting'
  }],
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

// Virtual for current participant count
EventSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Method to check if event is active (current date is between start and end date)
EventSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

// Method to check if registration is open
EventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return !this.registrationDeadline || now <= this.registrationDeadline;
};

// Method to check if event is at capacity
EventSchema.methods.isAtCapacity = function() {
  return this.capacity > 0 && this.participants.length >= this.capacity;
};

module.exports = mongoose.model('Event', EventSchema);