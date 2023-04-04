const File = require('../models/fileModel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');

// Upload a new file and only admin can perform thos

exports.upload = catchAsync(async (req, res, next) => {
  const newFile = await File.create({
    title: req.body.title,
    description: req.body.description,
    fileType: req.body.fileType,
    fileUrl: req.body.path,
    uploadedBy: req.user.id,
  });
  res.status(200).json({
    status: 'sucess',
    message: 'file succesfully uploaded',
    data: {
      file: newFile,
    },
  });
});

exports.getAllFiles = catchAsync(async (req, res, next) => {
  const files = await File.find();
  res.status(200).json({
    status: 'ok',
    length: files.length,
    data: {
      file: files,
    },
  });
});

exports.getFile = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  res.status(200).json({
    status: 'ok',
    data: [file],
  });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  file.downloadCount += 1;
  await file.save();
  res.status(200).download(file.fileUrl);
});

exports.sendViaEmail = catchAsync(async (req, res, next) => {
  const file = await File.findOne({ _id: req.params.id });
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  // TODO: Implement email sending functionality
  // Update the file's email count
  file.emailCount += 1;
  await file.save();
});

