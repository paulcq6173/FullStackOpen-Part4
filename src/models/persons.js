import mongoose from "mongoose";

// Declare for using .env variables
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
  });

const phoneSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, require: true },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d{5,6}/.test(v) && v.length > 8;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    require: true,
  },
});

const Phone = mongoose.model("Phone", phoneSchema);

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default Phone;
