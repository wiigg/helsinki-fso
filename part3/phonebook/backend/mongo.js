const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide password as an argument");
  process.exit(1);
}

const url = `mongodb+srv://da:${process.argv[2]}@phonebook.r4c0b7o.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log("person saved!");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
}
