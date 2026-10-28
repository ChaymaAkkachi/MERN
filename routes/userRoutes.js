
const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    updatePassword
} = require('../controllers/userController');

const {
    protect,
    adminOnly
} = require('../middlewares/authMiddleware');

// Public authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private profile route protected by JWT
router.get('/profile', protect, getUserProfile);

// Administrator-only route (valid JWT + admin role)
router.get('/', protect, adminOnly, getAllUsers);

router.put('/update-password', protect, updatePassword);

module.exports = router;
