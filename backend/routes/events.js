const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes
router.use(protect);

// Register for event (any authenticated user)
router.post('/:id/register', eventController.registerForEvent);

// Admin and product owner routes
router.post('/', authorize('admin', 'product_owner'), eventController.createEvent);
router.patch('/:id', authorize('admin', 'product_owner', 'client'), eventController.updateEvent);
router.delete('/:id', authorize('admin', 'product_owner'), eventController.deleteEvent);

// Participant management
router.get('/:id/participants', authorize('admin', 'product_owner', 'client'), eventController.getEventParticipants);
router.patch('/:id/participants/:participantId', authorize('admin', 'product_owner', 'client'), eventController.updateParticipantStatus);

// Statistics
router.get('/:id/statistics', authorize('admin', 'product_owner', 'client'), eventController.getEventStatistics);

module.exports = router;