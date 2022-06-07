import { useState } from 'react'

const Blog = ({ blog, updateBlog, username, removeBlog }) => {
    const [showDetails, setShowDetails] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const showWhenDetails = { display: showDetails ? '' : 'none' }

    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    const updateLikes = (event) => {
        event.preventDefault()

        updateBlog({
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
            user: blog.user.id,
        })
    }

    const handleRemove = (event) => {
        event.preventDefault()

        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            removeBlog(blog)
        }
    }

    return (
        <div style={blogStyle}>
            <div>
                {`${blog.title} ${blog.author} `}
                <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
            </div>
            <div style={showWhenDetails}>
                {blog.url}
                <br></br>
                {`likes ${blog.likes} `}
                <button onClick={updateLikes}>like</button>
                <br></br>
                {blog.user.name}
                <br></br>
                {blog.user.username === username ? <button onClick={handleRemove}>remove</button> : ''}
            </div>
        </div>
    )
}

export default Blog