import { useState } from "react";

const Create = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    const result = await createBlog({ title, author, url });
    if (result) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <div>
        title{" "}
        <input
          id="titleInput"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author{" "}
        <input
          id="authorInput"
          type="text"
          value={author}
          name="title"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url{" "}
        <input
          id="urlInput"
          type="text"
          value={url}
          name="title"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="submitButton" type="submit">
        create
      </button>
    </form>
  );
};

export default Create;
