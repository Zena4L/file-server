const express = require('express');
const {
  upload,
  getAllFiles,
  getFile,
  downloadFile,
  sendViaEmail,
} = require('../controllers/fileController');
const { stricted } = require('../controllers/authenController');

const router = express.Router();

// upload route is for admin only
router.route('/upload').post(stricted, upload);

router.route('/').get(stricted, getAllFiles);
router.route('/:id').get(stricted, getFile);
router.route('/download/:id').get(stricted, downloadFile);
router.route('/sendemail/:id').get(stricted, sendViaEmail);



module.exports = router;
