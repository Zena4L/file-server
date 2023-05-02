const File = require('../models/fileModel');
const User = require('../models/userModel');
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

exports.getFile = catchAsync(async (req, res,next) => {
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

exports.login =(req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};
exports.getProfile = (req,res)=>{
  res.status(200).render('profile',{
    title:'Your Account',
  })
}

exports.updateUserData = catchAsync(async(req,res,next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user.id,{
    name: req.body.name,
    email: req.body.email,
  },{
    new: true,
    runValidators:true
  });
  res.status(200).render('profile',{
    title:'Your Account',
    user: updatedUser
  })
})
exports.fileUpload = (req,res)=>{
  res.status(200).render('fileUpload',{
    title:'Your Account',
  })
}