const express = require('express');
const { signup, login, protected } = require('../controllers/authenController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/user').get(protected, getAllUsers);

module.exports = router;
