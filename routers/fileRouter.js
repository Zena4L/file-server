const express = require('express');
const {
  uploadFile,
  getAllFiles,
  getFile,
  downloadFile,
  sendViaEmail,
  deleteFile,
  fileUpload,
} = require('../controllers/fileController');
const { stricted,restrictTo,isLoggedIn } = require('../controllers/authenController');


const router = express.Router();

// upload route is for admin only
router.route('/upload').post(stricted,restrictTo('admin'),fileUpload,uploadFile);

router.route('/').get(stricted, getAllFiles);
router.route('/:id').get(stricted, getFile);
router.route('/:id').delete(stricted, deleteFile);
router.route('/download/:id').get(stricted, downloadFile);
router.route('/sendemail/:id').get(stricted, sendViaEmail);

module.exports = router;
