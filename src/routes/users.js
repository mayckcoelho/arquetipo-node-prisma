const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', UserController.list);
router.post('/login', UserController.authenticate)

module.exports = router;