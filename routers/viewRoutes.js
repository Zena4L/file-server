const express = require('express');
const {
  getOveriew,
  getFile,
  login,
  signup,
  getAccount
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authenController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base');
// });
router.get('/', isLoggedIn, getOveriew);
router.get('/login',isLoggedIn ,login);
router.get('/signup', signup);
router.get('/:slug', isLoggedIn, getFile);
router.get('/profile',isLoggedIn ,getAccount);
// router.get('/me', isLoggedIn, account);


module.exports = router;
