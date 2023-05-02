const express = require('express');
const {
  signup,
  login,
  stricted,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
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
router.get('/logout', logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);
router.route('/updatepassword').patch(stricted, updatePassword);


// user routes
router.route('/').get(stricted, restrictTo('admin'), getAllUsers);
router.route('/updateme').patch(stricted, updateMe);
router.route('/deleteme').delete(stricted, deleteMe);

module.exports = router;
