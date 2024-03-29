const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const user = request.user;

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

  const user = request.user;

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
  ).populate("user", { name: 1 });

  response.status(200).json(updatedBlog).end();
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const { content } = request.body;

  if (!content) {
    return response.status(400).json({ error: "content missing" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog === null) {
    return response.status(400).json({ error: "blog not found" });
  }

  const comment = new Comment({
    content,
    blog: blog.id,
  });

  const savedComment = await comment.save();

  blog.comments = blog.comments.concat(savedComment.id);
  await blog.save();

  response.status(201).json(savedComment).end();
});

module.exports = blogsRouter;
