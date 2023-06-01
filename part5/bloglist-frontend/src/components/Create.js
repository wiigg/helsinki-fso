const Create = ({
  handleCreate,
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
}) => (
  <form onSubmit={handleCreate}>
    <div>
      title{" "}
      <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      author{" "}
      <input
        type="text"
        value={author}
        name="title"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      url{" "}
      <input
        type="text"
        value={url}
        name="title"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>
);

export default Create;
