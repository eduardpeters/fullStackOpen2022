const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('there are six notes', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('notes have the id parameter', async () => {
    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'It is time for something new',
        author: 'El Novato',
        url: 'http://www.notavalidurl.html',
        likes: 7,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
        'It is time for something new'
    )
})

test('a blog without likes defaults to 0 likes when added', async () => {
    const newBlog = {
        title: 'It is time for something new',
        author: 'El Novato',
        url: 'http://www.notavalidurl.html',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes[likes.length - 1]).toBe(0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'El Novato',
        url: 'http://www.notavalidurl.html',
    }

    await api
        .post('/api/blogs')
        .responseType(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'It is time for something new',
        author: 'El Novato',
    }

    await api
        .post('/api/blogs')
        .responseType(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without Author becomes Anonymous', async () => {
    const newBlog = {
        title: 'I\'m not sharing my name online',
        url: 'http://www.notavalidurl.html',
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(b => b.author)
    expect(authors).toContain(
        'Anonymous'
    )
})

afterAll(() => {
    mongoose.connection.close()
})