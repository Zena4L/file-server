const mongoose = require('mongoose');
const slugify = require('slugify');

const fileSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: [true, 'file requires a fileUrl'],
    },
    title: {
      type: String,
      required: [true, 'file requires a title'],
    },
    description: {
      type: String,
      required: [true, 'file requires a description'],
    },
    fileType: {
      type: String,
      required: [true, 'file requires a category'],
      enum: ['PDF', 'IMAGE', 'AUDIO', 'VIDEO'],
    },
    // image: {
    //   type: String,
    //   required: [true, 'A file must have a image'],
    // },
    emailCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A file must have an uploader'],
    },
    slug: String,
  },
  { timestamps: true }
);

fileSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});
fileSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'uploadedBy',
    select: '-passwordChangeAt',
  });
  next();
});
fileSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const File = mongoose.model('File', fileSchema);
module.exports = File;
