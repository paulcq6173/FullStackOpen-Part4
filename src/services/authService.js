import User from '../models/userModel.js';

export const ValidLength = (username, password) => {
  // Allow (almost) any characters and at least 3 characters
  if (!/^.{3,}$/.test(username)) {
    return false;
  }
  if (!/^.{3,}$/.test(password)) {
    return false;
  }

  return true;
};

export const AlreadyExist = async (username) => {
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    return true;
  }

  return false;
};
