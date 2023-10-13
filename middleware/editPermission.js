exports.editPermission = (user_id, action) => {
  if (!user_id || !action) return false;

  let userPermission = ['editor', 'viewer', 'creator'];
};
