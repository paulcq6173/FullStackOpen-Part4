import { hash } from 'bcrypt';
import { Router } from 'express';
import User from '../models/userModel.js';
import { AlreadyExist, ValidLength } from '../services/authService.js';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  // Avoid app crashed with no response status code returned
  if (!ValidLength(username, password)) {
    return response.status(400).json({
      error: 'username and password must be contain at least 3 characters.',
    });
  }

  const isDuplicated = await AlreadyExist(username);
  if (isDuplicated) {
    return response.status(400).json({
      error: 'expected `username` to be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

userRouter.get('/', async (request, response) => {
  // populate - Replaces users.blogs ids with doc content of ids,
  // and choose what content will be display.
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
    id: 1,
  });

  response.json(users);
});

export default userRouter;
