import mongoose from 'mongoose';
// Declare for using .env variables
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();

function connectToDB() {
  const url =
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URL
      : process.env.MONGODB_URL;

  mongoose.set('strictQuery', false);

  logger.info('connect to', url);

  mongoose
    .connect(url)
    .then(() => logger.info('MongoDB connected'))
    .catch((error) => {
      logger.error('Failed to connect to MongoDB:', error.message);
    });
}

export default connectToDB;
