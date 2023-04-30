const express = require('express');
const {
  getOveriew,
  getFile,
  login,
  signup,
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authenController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base');
// });
router.get('/', isLoggedIn, getOveriew);
router.get('/login', login);
router.get('/signup', signup);
router.get('/:slug', isLoggedIn, getFile);

module.exports = router;
