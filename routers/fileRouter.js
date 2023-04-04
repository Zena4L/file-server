const express = require('express');
const {
  upload,
  getAllFiles,
  getFile,
  downloadFile,
  sendViaEmail,
} = require('../controllers/fileController');
const { protected } = require('../controllers/authenController');

const router = express.Router();

// upload route is for admin only
router.route('/upload').post(protected, upload);

router.route('/').get(protected, getAllFiles);
router.route('/:id').get(protected, getFile);
router.route('/download/:id').get(protected, downloadFile);
router.route('/sendemail/:id').get(protected, sendViaEmail);

module.exports = router;
