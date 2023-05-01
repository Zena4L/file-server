const File = require('../models/fileModel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError')

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
  if (!file) {
    return next(new AppError('There is no file with that name', 404));
  }

  if (res.locals.user) { // check if user is logged in
    res.status(200).render('file', {
      title: `${file.name} - File server`,
      file,
    });
  } else {
    return res.redirect('/login'); // if not logged in, redirect to login page
  }
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});
exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('signup');
});
// exports.fileDownload = catchAsync(async(req,res)=>{

// })
