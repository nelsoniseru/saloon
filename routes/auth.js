const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const auth = require('../middleware/authMiddleware');

router.get('/login', controller.loginPage);
router.post('/login', controller.loginUser);
router.get('/register', controller.registerPage);
router.post('/register', controller.registerUser);
router.get('/dashboard', auth, controller.dashboard);
router.get('/logout', controller.logout);

module.exports = router;
