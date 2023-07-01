const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/user_helper");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const rootUser = helper.initialUsers[0];

  await api.post("/api/users").send(rootUser);
});

describe("user verification", () => {
  test("respond with status code 400 if username and password are not long enough", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ab",
      name: "ab",
      password: "123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
    expect(usersAtEnd).not.toContain(newUser.username);
    expect(response.body.error).toContain(
      "username and password must both be at least 3 characters long"
    );
  });

  test("respond with status code 400 if username is not unique", async () => {
    const usersAtStart = await helper.usersInDb();

    const duplicateUser = {
      username: "root",
      name: "l33t h4x0r",
      password: "another_super_secret",
    };

    const response2 = await api
      .post("/api/users")
      .send(duplicateUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
    expect(response2.body.error).toContain("username must be unique");
  });
});
