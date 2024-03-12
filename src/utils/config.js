import dotenv from 'dotenv';

dotenv.config(); // Declare for using .env variables

const PORT = process.env.PORT;
const url = process.env.MONGODB_URL;
const config = {
  PORT,
  url,
};

export default config;
