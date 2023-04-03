const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  return blogs.reduce((favourite, blog) => {
    if (favourite.likes < blog.likes) {
      return blog;
    }
    return favourite;
  }, blogs[0] || {});
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, "author");
  const maxAuthor = _.maxBy(Object.keys(authors), (author) => authors[author]);
  return {
    author: maxAuthor,
    blogs: authors[maxAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
