const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');
const Campground = require('./campground');
const passportLocalMongoose = require('passport-local-mongoose');
const Review = require('./review');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: { type: Boolean, default: false }
});

UserSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    const campgrounds = await Campground.find({ author: user._id });

    for (let camp of campgrounds) {
      for (let img of camp.images) {
        if (img.filename) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
    }
    await Campground.deleteMany({ author: user._id });
    await Review.deleteMany({ author: user._id });
  }

  next();
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);