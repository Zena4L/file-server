const File = require('../models/fileModel');
const catchAsync = require('../utilis/catchAsync');

exports.getOveriew = catchAsync(async (req, res, next) => {
  //1. get All tour data from collection
  const files = await File.find();
  //2. build template
  //3. Render template
  res.status(200).render('overview', {
    title: 'All Files',
    files,
  });
});

exports.getFile = catchAsync(async (req, res) => {
  //1. get file data
  const file = await File.findOne({ slug: req.params.slug }).populate({
    path: 'uploadedBy',
    fields: 'role',
  });

  //2. build the template
  //3 render data from step 1
  res.status(200).render('file', {
    title: 'All Files',
    file,
  });
});
