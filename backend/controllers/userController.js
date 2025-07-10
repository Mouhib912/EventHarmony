const User = require('../models/User');
const Event = require('../models/Event');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Prevent updating role or other sensitive fields
    const allowedFields = ['firstName', 'lastName', 'company', 'position', 'phone'];
    const updateData = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    // Handle file upload (implementation depends on file upload middleware)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Filter by role
    if (req.query.role) {
      queryObj.role = req.query.role;
    }

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Build query
    let query = User.find(JSON.parse(queryStr));

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
      query = query.select('-password -__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const users = await query;
    const total = await User.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single user (admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get clients (admin only)
exports.getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password -__v')
      .populate('accessibleEvents', 'name startDate endDate');

    res.status(200).json({
      success: true,
      count: clients.length,
      data: {
        clients
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting clients',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create client (admin only)
exports.createClient = async (req, res) => {
  try {
    // Set role to client
    req.body.role = 'client';

    const client = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        client
      }
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update client events (admin only)
exports.updateClientEvents = async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of event IDs'
      });
    }

    // Verify all events exist
    for (const eventId of events) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: `Event with ID ${eventId} not found`
        });
      }
    }

    const client = await User.findByIdAndUpdate(
      req.params.id,
      { accessibleEvents: events },
      {
        new: true,
        runValidators: true
      }
    ).populate('accessibleEvents', 'name startDate endDate');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        client
      }
    });
  } catch (error) {
    console.error('Update client events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update client modules (admin only)
exports.updateClientModules = async (req, res) => {
  try {
    const { modules } = req.body;

    if (!modules || !Array.isArray(modules)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of module names'
      });
    }

    // Validate modules
    const validModules = ['b2b_networking', 'participant_management', 'qr_code_scanning', 'analytics'];
    for (const module of modules) {
      if (!validModules.includes(module)) {
        return res.status(400).json({
          success: false,
          message: `Invalid module: ${module}. Valid modules are: ${validModules.join(', ')}`
        });
      }
    }

    const client = await User.findByIdAndUpdate(
      req.params.id,
      { accessibleModules: modules },
      {
        new: true,
        runValidators: true
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        client
      }
    });
  } catch (error) {
    console.error('Update client modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client modules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};