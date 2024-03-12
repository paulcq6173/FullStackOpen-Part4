import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : bcrypt.compareSync(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 3600,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default loginRouter;
