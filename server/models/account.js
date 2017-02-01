var bcrypt = require("bcrypt-nodejs");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    city: { type: String }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  /* The book Id comes from Google API for books */
  myBooks: [ {
    bookId: { type: String },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean }
  }],
  reqBooks: [{
    bookId: { type: String },
    title: { type: String },
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean }
  }]
},
{
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
Account.pre('save', function(next) {  
  const user = this,
        SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
Account.methods.comparePassword = function(candidatePassword, cb) {  
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

module.exports = mongoose.model('Account', Account);