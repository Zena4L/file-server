const express = require('express');
const { getOveriew, getFile } = require('../controllers/viewsController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base');
// });
router.get('/', getOveriew);
router.get('/:slug', getFile);

module.exports = router;
