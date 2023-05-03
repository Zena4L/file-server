const express = require('express');
const {
  getOveriew,
  getFile,
  login,
  signup,
  getProfile,
  // updateUserData,
  
  
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authenController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base');
// });
router.get('/', isLoggedIn, getOveriew);
router.get('/login',isLoggedIn ,login);
router.get('/signup', signup);
router.get('/profile',isLoggedIn,getProfile)
router.get('/:slug', isLoggedIn, getFile);



// router.post('/submit-user-data', isLoggedIn,updateUserData)


module.exports = router;
