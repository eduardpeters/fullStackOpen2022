const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog
        .findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author || 'Anonymous',
        url: body.url,
        likes: body.likes || 0,
        user: user.id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() !== user.id) {
        return response.status(401).json({ error: 'wrong user' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    user.blogs = user.blogs.filter(u => u !== request.params.id)
    await user.save()
    response.status(204).end()
})

module.exports = blogsRouter