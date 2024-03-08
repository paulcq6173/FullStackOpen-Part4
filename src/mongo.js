import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

mongoose.set("strictQuery", false);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

if (!(newName || newNumber)) {
  Phone.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((e) => {
      console.log(`${e.name} ${e.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const phone = new Phone({
    name: newName,
    number: newNumber,
  });

  phone.save().then((result) => {
    console.log(`Added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
}
