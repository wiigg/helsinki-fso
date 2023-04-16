const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/blogs_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("Records deleted");

  await Blog.insertMany(helper.initialBlogs);
  console.log("Records initialised");
});

describe("blog verification", () => {
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
});

describe("blog addition", () => {
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
});

describe("blog deletion", () => {
  test("respond with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe("blog update", () => {
  test("respond with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      likes: 100,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    // get blog that has just been updated
    const updatedBlogFromDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );
    expect(updatedBlogFromDb.likes).toBe(100);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
