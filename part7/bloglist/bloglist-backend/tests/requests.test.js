const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const blogHelper = require("../utils/blog_helper.js");
const userHelper = require("../utils/user_helper.js");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const userLogin = async (username) => {
  const rootUser = userHelper.initialUsers.find(
    (user) => user.username === username
  );

  const response = await api
    .post("/api/login")
    .send({ username: rootUser.username, password: rootUser.password })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  return response.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  console.log("All users and blogs deleted");

  const rootUser = userHelper.initialUsers[0];
  await api.post("/api/users").send(rootUser);
  console.log("Root user initialised");

  const user = await User.findOne({ username: "root" });
  const userId = user._id;

  const blogObjects = blogHelper.initialBlogs.map((blog) => {
    blog.user = userId;
    return new Blog(blog);
  });
  await Blog.insertMany(blogObjects);
  console.log("Blogs initialised");
});

describe("blog verification", () => {
  test("there are two blogs", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(blogHelper.initialBlogs.length);
  });

  test("identifier property is named id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });
});

describe("blog addition", () => {
  test("add a new blog", async () => {
    const token = await userLogin("root");

    const newBlog = {
      title: "New blog",
      author: "New author",
      url: "https://newblog.com/",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const contents = response.body.map((blog) => blog.title);
    expect(response.body).toHaveLength(blogHelper.initialBlogs.length + 1);
    expect(contents).toContain("New blog");
  });

  test("if likes property is missing, default to 0", async () => {
    const token = await userLogin("root");

    const newBlog = {
      title: "New blog",
      author: "New author",
      url: "https://newblog.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
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
    const token = await userLogin("root");

    const newBlog = {
      author: "New author",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test("if token is missing, respond with 401 Unauthorized", async () => {
    const newBlog = {
      title: "New blog",
      author: "New author",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("blog deletion", () => {
  test("respond with status code 204 if id is valid", async () => {
    const token = await userLogin("root");

    const blogsAtStart = await blogHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await blogHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogHelper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe("blog update", () => {
  test("respond with status code 204 if id is valid", async () => {
    const token = await userLogin("root");

    const blogsAtStart = await blogHelper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      likes: 100,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .expect(204);

    const blogsAtEnd = await blogHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogHelper.initialBlogs.length);

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
