
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blog posts return with id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('blog entry is successfully added', async () => {
    const newBlog = {
        title: "The great journey",
        author: "Wilhelm",
        url: "https://somewherefaraway.com",
        likes: 15
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain(
        "The great journey"
    )
})

test('post without likes property defaults to 0', async () => {
    const newBlog = {
        title: "The not so great journey",
        author: "Bismark",
        url: "https://pagenotfound.com"
    }

    const response = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .expect(201)

    expect(response.body.likes).toBe(0)
})

test('400 if no url or title', async () => {
    const noTitleBlog = {
        author: "Ziegfried",
        url: "https://ziggy.com",
        likes: 20
    }

    const noUrlBlog = {
        title: "Best title ever",
        author: "Maveric",
        likes: 19
    }

    await api
        .post('/api/blogs')
        .send(noTitleBlog)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(noUrlBlog)
        .expect(400)
})

test('deleting specific blog post returns 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
    )

    const contents = blogsAtEnd.map(blog => blog.id)

    expect(contents).not.toContain(blogToDelete.id)
})

test('proper update of a blog entry', async () => {
    const blogsAtStart = await helper.blogsInDb()
    
    let blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes += 1

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
})

afterAll(async () => {
    await mongoose.connection.close()
})

