import { useState } from 'react'

const Create = ({ createBlog, showBanner }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    const result = await createBlog({ title, author, url })
    if (result) {
      setTitle('')
      setAuthor('')
      setUrl('')

      showBanner('green', `${title} by ${author} added!`)
    } else {
      showBanner('red', 'could not add blog')
    }
  }

  return (
    <form onSubmit={handleCreate}>
      <div>
        title{' '}
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author{' '}
        <input
          type="text"
          value={author}
          name="title"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url{' '}
        <input
          type="text"
          value={url}
          name="title"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default Create
