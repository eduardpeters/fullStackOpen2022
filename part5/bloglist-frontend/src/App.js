import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)
    const blogFormRef = useRef()
    /*
        useEffect( async () => {
            const blogs = await blogService.getAll()
            setBlogs(blogs)
        }, [])
    */
    useEffect(() => {
        const getBlogs = async () => {
            const initialBlogs = await blogService.getAll()
            setBlogs(initialBlogs)
        }
        getBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const notify = (message, type='info') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    const postLogin = async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            window.localStorage.setItem(
                'loggedBlogListUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            notify(`${user.username} logged in`)
        } catch (exception) {
            notify('wrong username or password', 'alert')
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogListUser')
        notify(`${user.username} logging out`)
        setUser(null)
    }

    const addBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()

        const addedBlog = await blogService.create(blogObject)

        setBlogs(blogs.concat(addedBlog))

        notify(`New blog: ${addedBlog.title} by ${addedBlog.author} added`)
    }

    const updateBlog = async (blogObject) => {
        const updatedBlog = await blogService.update(blogObject)

        setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))

        notify(`Liked blog ${updatedBlog.title} by ${updatedBlog.author}`)
    }

    const removeBlog = async (blogToRemove) => {
        await blogService.remove(blogToRemove.id)

        setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))

        notify(`Blog: ${blogToRemove.title} by ${blogToRemove.author} removed`)
    }

    if (user === null) {
        return (
            <div>
                <h1>Welcome to blogList!</h1>
                <Notification notification={notification} />
                <h2>log in to application</h2>
                <LoginForm postLogin={postLogin} />
            </div>
        )
    }

    return (
        <div>
            <h1>blogList</h1>
            <Notification notification={notification} />
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <h2>create new blog</h2>
                <BlogForm addBlog={addBlog} />
            </Togglable>
            <h2>posted blogs</h2>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        updateBlog={updateBlog}
                        username={user.username}
                        removeBlog={removeBlog}
                    />
                )}
        </div>
    )
}

export default App