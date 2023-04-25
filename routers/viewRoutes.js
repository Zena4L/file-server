const express = require('express');
const {
  getOveriew,
  getFile,
  login,
  signup,
} = require('../controllers/viewsController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base');
// });
router.get('/', getOveriew);
router.get('/login', login);
router.get('/signup', signup);
router.get('/:slug', getFile);

module.exports = router;
