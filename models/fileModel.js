const mongoose = require('mongoose');
const slugify = require('slugify');

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['PDF', 'IMAGE', 'AUDIO', 'VIDEO'],
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'file requires a fileUrl'],
    },
    downloads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Download',
      },
    ],
    downloadCount: {
      type: Number,
      default: 0,
    },
    emailCount: {
      type: Number,
      default: 0,
    },
    emails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Email',
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: String,
  },
  { timestamps: true }
);

fileSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});
fileSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const File = mongoose.model('File', fileSchema);
module.exports = File;
