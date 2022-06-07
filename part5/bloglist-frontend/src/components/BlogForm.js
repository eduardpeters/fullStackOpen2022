import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const createBlog = (event) => {
        event.preventDefault()
        // number of likes will default to 0 in backend logic
        addBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setNewUrl(event.target.value)
    }

    return (
        <form onSubmit={createBlog}>
            <label>title:</label>
            <input 
            value={newTitle}
            onChange={handleTitleChange}
            />
            <br></br>
            <label>author:</label>
            <input 
            value={newAuthor}
            onChange={handleAuthorChange}
            />
            <br></br>
            <label>url:</label>
            <input 
            value={newUrl}
            onChange={handleUrlChange}
            />
            <br></br>
            <button type='submit'>create</button>
        </form>
    )
}

export default BlogForm