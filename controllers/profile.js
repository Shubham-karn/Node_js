const User = require('../models/user');
const { hasPermission } = require('../middleware/permission');
const Message = require('../config/message');

//get user detail
const getUserDetail = async (requestUser, currentUser, cb) => {
  if (!requestUser.id) return cb('User ID is required.', null);

  let user = {};
  try {
    user = await User.findOne({ id: requestUser.id });
    if (!user) return cb('User doesnot exist', null);

    let userData = {
      _id: user._id,
      id: user.id,
      name: user.name,
      type: user.type,
      field: user.field,
    };

    if (currentUser.id === user.id) {
      userData.email = user.email;
      userData.phone = user.phone;
      userData.paymentPicture = user.paymentPicture;
    }

    return cb(null, userData);
  } catch (err) {
    return cb(err.message, null);
  }
};

exports.getUserProfile = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send(Message('Not logged in.'));

  getUserDetail(req.user, req.user, (err, currentUser) => {
    if (err) return res.send(Message(err));
    return res.send(Message('', true, currentUser));
  });
};

//edit existing user
exports.editProfile = async (req, res) => {
  const { id: userId } = req.body;
  const body = req.body;
  if (!userId) return res.status(401).send('Invalid request');

  if (userId != req.user.id)
    return res.status(401).send(Message('Invalid request.'));

  try {
    let currentUser = await User.findOne({ id: userId });
    if (!currentUser) return res.status(401).send(Message('No such user.'));

    (currentUser.name = body.name),
      (currentUser.phone = body.phone),
      (currentUser.type = currentUser.type),
      (currentUser.field = body.field ? body.field : null),
      await currentUser.save();
    return res.send(Message('User edited successfully.', true));
  } catch (err) {
    return res.send(Message(err.message));
  }
};

exports.getUserProfileWithId = async (req, res) => {
  const user = await getUserDetail(req.params, req.user);
  if (!user) return res.status(401).send(Message('Not logged in.'));

  getUserDetail(req.user, req.user).then((err, currentUser) => {
    if (err) return res.send(Message(err));
    return res.send(Message('', true, currentUser));
  });
};

//add field problem for the user
exports.addField = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send(Message('Not logged in.'));

  const newField = req.body.field;

  if (!newField) return res.send(Message('Send a valid field.'));

  try {
    let currentUser = await User.findOne({ id: user.id });
    if (!currentUser) return res.status(401).send(Message('No such user.'));
    currentUser.field = [...currentUser.field, newField];
    await currentUser.save();
    return res.send(Message('User edited successfully.', true));
  } catch (err) {
    return res.send(Message(err.message));
  }
};
