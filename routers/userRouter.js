const express = require('express');
const {
  signup,
  login,
  protected,
  restrictTo,
} = require('../controllers/authenController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/user').get(protected, restrictTo('admin'), getAllUsers);

module.exports = router;
