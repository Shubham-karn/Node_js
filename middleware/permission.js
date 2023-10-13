exports.hasPermission = (userType, actionType, actionContent) => {
  if (!userType || !actionType) return false;
  if (userType === 'superadmin') return true;

  let userPermission = [''];

  if (userType === 'user') {
    return userPermission.includes(actionType);
  }

  if (userType === 'admin') {
    return adminPermission.includes(actionType);
  }

  return false;
};
