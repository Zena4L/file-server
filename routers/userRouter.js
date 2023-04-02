const express = require('express');
const {
  signup,
  login,
  protected,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authenController');
const {
  getAllUsers,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const router = express.Router();

// authorization routes, these routes are for authorization only
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/updatepassword').patch(protected, updatePassword);

// user routes
router.route('/user').get(protected, restrictTo('admin'), getAllUsers);
router.route('/user/updateme').patch(protected, updateMe);
router.route('/user/deleteme').delete(protected, deleteMe);

module.exports = router;
