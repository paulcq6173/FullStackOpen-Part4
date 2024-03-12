import cors from 'cors';
import express from 'express';
import blogRouter from './controllers/blogRoute.js';
import loginRouter from './controllers/loginRoute.js';
import userRouter from './controllers/userRoute.js';
import connectToDB from './mongo.js';
import {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
} from './utils/middleware.js';

// Connect to Database
connectToDB();

const app = express();

// Middleware order
app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

// Handler of requests with unknown endpoint
app.use(unknownEndpoint);

// Last middleware. All routes must be registered before this.
app.use(errorHandler);

export default app;
