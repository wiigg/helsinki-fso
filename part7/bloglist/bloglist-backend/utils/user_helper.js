const User = require("../models/user");

const initialUsers = [
  {
    username: "root",
    name: "Superuser",
    password: "password",
  },
  {
    username: "user",
    name: "Normal User",
    password: "password",
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  usersInDb,
  initialUsers,
};
