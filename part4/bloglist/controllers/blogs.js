const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (title === undefined || url === undefined) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    response.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;
  const blog = await Blog.findById(blogId);

  if (blog === null) {
    return response.status(400).json({ error: "blog not found" });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    response.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({ error: "unauthorized user" });
  }

  await Blog.findByIdAndRemove(blogId);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes,
    },
    { new: true }
  );
  response.status(204).json(updatedBlog);
});

module.exports = blogsRouter;
