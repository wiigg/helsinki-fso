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
    <form onSubmit={handleCreate} className="mx-auto w-11/12">
      <div className="mb-3">
        <label
          htmlFor="titleInput"
          className="mb-2 block text-base font-bold text-gray-700"
        >
          Title
        </label>
        <input
          id="titleInput"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="authorInput"
          className="mb-2 block text-base font-bold text-gray-700"
        >
          Author
        </label>
        <input
          id="authorInput"
          type="text"
          value={author}
          name="title"
          onChange={({ target }) => setAuthor(target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="urlInput"
          className="mb-2 block text-base font-bold text-gray-700"
        >
          URL
        </label>
        <input
          id="urlInput"
          type="text"
          value={url}
          name="title"
          onChange={({ target }) => setUrl(target.value)}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        />
      </div>
      <div className="flex justify-between">
        <button
          id="submitButton"
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          create
        </button>
      </div>
    </form>
  );
};

export default Create;
