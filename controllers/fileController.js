// const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const File = require('../models/fileModel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');
const Email = require('../utilis/sendMail');

// Upload a new file and only admin can perform thos
const multerStorage = multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,'public/data');
  },
  filename:(req,file,cb)=>{
    //file-id-timestamp.ext
    const ext = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const multerFilter = (req,file,cb)=>{
  const filetypes = /pdf|jpeg|jpg|png|mp3|mp4|wav|avi|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   // Check MIME type
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('File not supported',400),false);
  }
}

const fileUpload = multer({
  dest: 'public/data',
});

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.fileUpload = upload.array('originalname',10);

exports.uploadFile = catchAsync(async (req, res, next) => {
  const newFile = await File.create({
    title: req.body.title,
    description: req.body.description,
    fileType: req.body.fileType,
    fileUrl: req.files[0].filename,
    file: req.files[0].originalname,
    uploadedBy: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'file succesfully uploaded',
    data: {
      // file: newFile,
    },
  });
});

exports.getAllFiles = catchAsync(async (req, res, next) => {

  //1 filtering
  const queryObj = {...req.query};
  const excludedFields = ['page','sort','limit','fields'];

  excludedFields.forEach(el=> delete queryObj[el]);

  let query= File.find(queryObj);

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if(req.query.page){
    const numFiles = await File.countDocuments();
    if(skip >= numFiles) return next(new AppError('This page does not exists',404));
  }

  const files = await query;

  res.status(200).json({
    status: 'ok',
    length: files.length,
    data: {
      file: files,
    },
  });
});

exports.getFile = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).populate('uploadedBy');
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  res.status(200).json({
    status: 'ok',
    data: [file],
  });
});
exports.deleteFile = catchAsync(async (req, res, next) => {
  const file = await File.findByIdAndDelete(req.params.id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  res.status(200).json({
    status: 'ok',
    data: null,
  });
});


exports.downloadFile = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  file.downloadCount += 1;
  await file.save();

  const filePath = path.join(__dirname, '..', 'public', 'data', file.fileUrl);
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName);
  res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}${extension}`);
  res.status(200).download(filePath, fileName);
});




// exports.sendViaEmail = catchAsync(async (req, res, next) => {
//   const file = await File.findOne({ _id: req.params.id });
//   if (!file) {
//     return next(new AppError('File not found', 404));
//   }

//   // const message = 'Please see the attached file';
//   // await sendMail({
//   //   email: req.user.email,
//   //   subject: 'File attachment',
//   //   message,
//   //   attachments: [
//   //     {
//   //       filename: file.title,
//   //       path: file.fileUrl,
//   //     },
//   //   ],
//   // });
  

//   // Update the file's email count
//   file.emailCount += 1;
//   await file.save();

//   res.status(200).json({
//     status: 'success',
//     message: 'Email sent successfully',
//     data: {
//       file: file,
//     },
//   });
// });
exports.sendViaEmail = catchAsync(async (req, res, next) => {
  const file = await File.findOne({ _id: req.params.id });
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  console.log(file);
  // Send the email with the attachment
  const url = `${req.protocol}://${req.get('host')}/`;
  const filePath = path.join(__dirname, '..', 'public', 'data', file.fileUrl);
  const email = new Email(req.user, url);
  const attachments = [
    {
      filename: file.title,
      path: filePath,
    },
  ];
  await email.send('emailDownload', 'Download attached', attachments);
  // Update the file's email count
  file.emailCount += 1;
  await file.save();

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully',
    data: {
      file: file,
    },
  });
});
