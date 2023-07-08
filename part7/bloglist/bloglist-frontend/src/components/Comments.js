import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";

import blogService from "../services/blogs";
import { useAutoDismissNotification } from "../contexts/NotificationContext";

const CreateComment = ({ blog }) => {
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const notify = useAutoDismissNotification();

  const createComment = (event) => {
    event.preventDefault();
    const content = event.target.comment.value;
    const id = blog.id;
    createCommentMutation.mutate({ id, content });
  };

  const createCommentMutation = useMutation(blogService.createComment, {
    onSuccess: (createdComment) => {
      console.log(createdComment.blog);
      const allBlogs = queryClient.getQueryData("blogs");
      const updatedBlogs = allBlogs.map((blog) =>
        blog.id === createdComment.blog
          ? { ...blog, comments: blog.comments.concat(createdComment) }
          : blog
      );
      queryClient.setQueryData("blogs", updatedBlogs);
      setComment("");
      notify("comment added", "success");
    },
    onError: () => {
      notify("error adding comment", "error");
    },
  });

  return (
    <div className="px-8 pb-8 pt-6">
      <h3 className="mb-4 text-lg font-semibold">Comments</h3>
      <div className="mb-4">
        <form onSubmit={createComment} className="flex">
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            className="focus:shadow-outline mr-2 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            add comment
          </button>
        </form>
      </div>
      <div>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id} className="mt-2 rounded bg-gray-100 px-3 py-2">
              {comment.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateComment;
