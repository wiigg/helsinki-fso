import { useMutation } from "react-query";
import { useState } from "react";

import blogService from "../services/blogs";
import { useAutoDismissNotification } from "../contexts/NotificationContext";

const CreateComment = ({ blog }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(blog.comments);

  const notify = useAutoDismissNotification();

  const createComment = (event) => {
    event.preventDefault();
    const content = event.target.comment.value;
    const id = blog.id;
    createCommentMutation.mutate({ id, content });
  };

  const createCommentMutation = useMutation(blogService.createComment, {
    onSuccess: (createdComment) => {
      setComments((oldComments) => oldComments.concat(createdComment));
      setComment("");
      notify("comment added", "green");
    },
    onError: () => {
      notify("error adding comment", "red");
    },
  });

  return (
    <div>
      <h3>comments</h3>
      <div>
        <form onSubmit={createComment}>
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">add comment</button>
        </form>
      </div>
      <div>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateComment;
