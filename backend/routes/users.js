const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/profile/image', userController.updateProfileImage);

// Admin and product owner routes
router.use(restrictTo('admin', 'product_owner'));
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Client management routes
router.get('/clients', userController.getClients);
router.post('/clients', userController.createClient);
router.patch('/clients/:id/events', userController.updateClientEvents);
router.patch('/clients/:id/modules', userController.updateClientModules);

module.exports = router;