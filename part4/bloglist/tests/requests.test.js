const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("All records deleted");

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  console.log("Records initialised");
});

test("there are two blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("identifier property is named id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("add a new blog", async () => {
  const newBlog = {
    title: "New blog",
    author: "New author",
    url: "https://newblog.com/",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const contents = response.body.map((blog) => blog.title);
  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain("New blog");
});

test("if likes property is missing, default to 0", async () => {
  const newBlog = {
    title: "New blog",
    author: "New author",
    url: "https://newblog.com/",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  // check every blog post has a likes field
  response.body.forEach((blog) => {
    expect(blog.likes).toBeDefined();
  });
});

test("if title and url properties are missing, respond with 400 Bad Request", async () => {
  const newBlog = {
    author: "New author",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
