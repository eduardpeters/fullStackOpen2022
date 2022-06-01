const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

let token = null

beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 },
    )
})

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('testing the fetching of blogs', () => {
    test('there are six notes', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs have the id parameter', async () => {
        const blogsAtStart = await helper.blogsInDb()
        expect(blogsAtStart[0].id).toBeDefined()
    })
})

describe('viewing a specific blog', () => {
    test('suceeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})

describe('addition of new blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'It is time for something new',
            author: 'El Novato',
            url: 'http://www.notavalidurl.html',
            likes: 7,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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

    test('adding a blog is unauthorized without token', async () => {
        const newBlog = {
            title: 'It is time for something new',
            author: 'El Novato',
            url: 'http://www.notavalidurl.html',
            likes: 7,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog without likes defaults to 0 likes when added', async () => {
        const newBlog = {
            title: 'It is time for something new',
            author: 'El Novato',
            url: 'http://www.notavalidurl.html',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
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
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
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
            .set('Authorization', `bearer ${token}`)
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
})

describe('updating likes on a blog', () => {
    test('suceeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 10,
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(helper.initialBlogs[0].likes + 10)
    })
})

describe('deletion of a blog', () => {
    beforeEach(async () => {
        const newBlog = {
            title: 'It is time for something new',
            author: 'El Novato',
            url: 'http://www.notavalidurl.html',
            likes: 7,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
    })

    test('suceeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('adding a blog is unauthorized without token', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'bearer ')
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})