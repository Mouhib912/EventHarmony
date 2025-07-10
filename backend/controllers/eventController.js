const Event = require('../models/Event');
const User = require('../models/User');

// Get all events (with filtering)
exports.getAllEvents = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Filter by status
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate) {
      queryObj.startDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      queryObj.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      queryObj.tags = { $in: tags };
    }

    // Filter by location
    if (req.query.location) {
      queryObj.location = { $regex: req.query.location, $options: 'i' };
    }

    // For public API, only show published events
    if (!req.user || req.user.role === 'user') {
      queryObj.isPublic = true;
      queryObj.status = 'published';
    }

    // For clients, only show events they have access to
    if (req.user && req.user.role === 'client') {
      const user = await User.findById(req.user.id);
      queryObj._id = { $in: user.accessibleEvents };
    }

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Build query
    let query = Event.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const events = await query;
    const total = await Event.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        events
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email company')
      .populate('participants.user', 'firstName lastName email company position');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to the event
    if (!event.isPublic && req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      if (req.user.role === 'client') {
        const user = await User.findById(req.user.id);
        if (!user.accessibleEvents.includes(event._id)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this event'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        event
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    // Check if user has permission to create events
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create events'
      });
    }

    // Set organizer to current user
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        event
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to update the event
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      if (req.user.role === 'client') {
        const user = await User.findById(req.user.id);
        if (!user.accessibleEvents.includes(event._id)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this event'
        });
      }
    }

    // Prevent changing organizer
    if (req.body.organizer) {
      delete req.body.organizer;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to delete the event
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is published
    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for an unpublished event'
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration for this event is closed'
      });
    }

    // Check if event is at capacity
    if (event.isAtCapacity()) {
      return res.status(400).json({
        success: false,
        message: 'This event is at capacity'
      });
    }

    // Check if user is already registered
    const isRegistered = event.participants.some(
      participant => participant.user.toString() === req.user.id
    );

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Add user to participants
    event.participants.push({
      user: req.user.id,
      registrationDate: Date.now(),
      status: 'registered'
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get event participants
exports.getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.user', 'firstName lastName email company position phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to the event
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      if (req.user.role === 'client') {
        const user = await User.findById(req.user.id);
        if (!user.accessibleEvents.includes(event._id)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }

        // Check if user has access to participant management module
        if (!user.accessibleModules.includes('participant_management')) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to the participant management module'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this event'
        });
      }
    }

    // Apply filters
    let participants = event.participants;

    // Filter by status
    if (req.query.status) {
      participants = participants.filter(p => p.status === req.query.status);
    }

    // Filter by badge printed
    if (req.query.badgePrinted) {
      const badgePrinted = req.query.badgePrinted === 'true';
      participants = participants.filter(p => p.badgePrinted === badgePrinted);
    }

    // Search by name or email
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      participants = participants.filter(p => {
        const user = p.user;
        if (!user) return false;
        
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(search) || 
               (user.email && user.email.toLowerCase().includes(search)) ||
               (user.company && user.company.toLowerCase().includes(search));
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedParticipants = participants.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: participants.length,
      total: participants.length,
      totalPages: Math.ceil(participants.length / limit),
      currentPage: page,
      data: {
        participants: paginatedParticipants
      }
    });
  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting event participants',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update participant status
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    const { status, remarks, badgePrinted } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to the event
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      if (req.user.role === 'client') {
        const user = await User.findById(req.user.id);
        if (!user.accessibleEvents.includes(event._id)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }

        // Check if user has access to participant management module
        if (!user.accessibleModules.includes('participant_management')) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to the participant management module'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this event'
        });
      }
    }

    // Find participant
    const participantIndex = event.participants.findIndex(
      p => p._id.toString() === participantId
    );

    if (participantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Update participant
    if (status) {
      event.participants[participantIndex].status = status;
    }

    if (remarks !== undefined) {
      event.participants[participantIndex].remarks = remarks;
    }

    if (badgePrinted !== undefined) {
      event.participants[participantIndex].badgePrinted = badgePrinted;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Participant updated successfully',
      data: {
        participant: event.participants[participantIndex]
      }
    });
  } catch (error) {
    console.error('Update participant status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating participant status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get event statistics
exports.getEventStatistics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to the event
    if (req.user.role !== 'admin' && req.user.role !== 'product_owner') {
      if (req.user.role === 'client') {
        const user = await User.findById(req.user.id);
        if (!user.accessibleEvents.includes(event._id)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }

        // Check if user has access to analytics module
        if (!user.accessibleModules.includes('analytics')) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to the analytics module'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this event'
        });
      }
    }

    // Calculate statistics
    const totalParticipants = event.participants.length;
    
    // Status breakdown
    const statusCounts = {
      registered: 0,
      confirmed: 0,
      checked_in: 0,
      cancelled: 0
    };

    event.participants.forEach(p => {
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status]++;
      }
    });

    // Badge printing stats
    const badgePrinted = event.participants.filter(p => p.badgePrinted).length;
    const badgeNotPrinted = totalParticipants - badgePrinted;

    // Registration timeline
    const registrationDates = event.participants.map(p => {
      return {
        date: p.registrationDate,
        status: p.status
      };
    });

    // Group registrations by day
    const registrationsByDay = {};
    registrationDates.forEach(reg => {
      const date = new Date(reg.date).toISOString().split('T')[0];
      if (!registrationsByDay[date]) {
        registrationsByDay[date] = 0;
      }
      registrationsByDay[date]++;
    });

    // Convert to array for chart data
    const registrationTimeline = Object.keys(registrationsByDay).map(date => {
      return {
        date,
        count: registrationsByDay[date]
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      data: {
        totalParticipants,
        statusCounts,
        badgeStats: {
          printed: badgePrinted,
          notPrinted: badgeNotPrinted
        },
        registrationTimeline
      }
    });
  } catch (error) {
    console.error('Get event statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting event statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};