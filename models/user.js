const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 10;

//user schema
const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      default: 'user',
    },
    thumbnail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  }
);

//pre save hook
UserSchema.pre('save', async function (next, doc) {
  if (this.googleId) return next();

  if (!this.isModified('password')) return next();
  //if password is changed or user is new, encrypt the password
  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    return next(err);
  }

  if (!this.isNew) return next();

  //generate unique username from given id
  //replace special characters with "-"
  let id = `${this.id}`.replace(/[^a-zA-Z0-9]/g, '');

  //append random integer of 3 digits until unique username is found
  while (true) {
    const duplicateUser = await User.findOne({ id: id });
    if (!duplicateUser) break;
    id = `${id}${Math.floor(Math.random() * 1000)}`;
  }

  this.id = id;
  return next();
});

UserSchema.methods.validatePassword = async (password, hash, callback) => {
  //hash the given password with saved hash and verify user login
  bcrypt.compare(password, hash, async (err, result) => {
    if (err) callback(err);
    callback(null, result);
  });
};

const User = mongoose.model('User', UserSchema);

User.createIndexes();

module.exports = User;
