import mongoose from 'mongoose';
// Declare for using .env variables
import dotenv from 'dotenv';

dotenv.config();

function connectToDB() {
  const url = process.env.MONGODB_URL;

  mongoose.set('strictQuery', false);

  mongoose
    .connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
      console.log('Failed to connect to MongoDB:', error.message);
    });
}

export default connectToDB;
