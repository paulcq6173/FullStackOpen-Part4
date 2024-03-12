import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import User from '../models/userModel.js';

const tokenExtractor = (request, response, next) => {
  let token = null;
  // Get token string from authorization header
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  }
  request.token = token;
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'jwt must be provided' });
  }
  // Decode process
  // request.token - get token from tokenExtractor
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id || !decodedToken) {
    return response.status(401).json({ error: 'Invalid token.' });
  }
  const reqUser = await User.findById(decodedToken.id);
  request.user = reqUser;

  next();
};

morgan.token('body', (req) => {
  const arr = Object.values(req.body);
  if (arr.length > 0) {
    return JSON.stringify(req.body);
  }
});

const requestLogger = (request, response, next) => {
  morgan(':method :url :status :response-time ms - :res[content-length] :body');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case 'CastError':
      // MongoDB get invalid id
      return response.status(400).send({ error: 'malformatted id' });
    case 'ValidationError':
      // MongoDB Validation error: The Data doesn't match the SchemaOptions
      return response.status(400).json({ error: error.message });
    case 'MongoServerError':
      if (error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({
          error: 'expected `username` to be unique',
        });
      }
      break;
    case 'JsonWebTokenError':
      return response.status(400).json({
        error: 'token missing or invalid',
      });
    case 'TokenExpiredError':
      return response.status(401).json({
        error: 'token expired',
      });
  }

  next(error);
};

export {
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
};
