
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

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

describe('testing TokenAuthentication block', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    describe('checking proper post creation', () => {
        test('blog entry is successfully added', async () => {
            const token = await helper.createUserToken(api)
    
            const newBlog = {
                title: "The great journey",
                author: "Wilhelm",
                url: "https://somewherefaraway.com",
                likes: 15
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
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
            const token = await helper.createUserToken(api)

            const newBlog = {
                title: "The not so great journey",
                author: "Bismark",
                url: "https://pagenotfound.com"
            }
        
            const response = await api
                            .post('/api/blogs')
                            .set('Authorization', `Bearer ${token}`)
                            .send(newBlog)
                            .expect(201)
        
            expect(response.body.likes).toBe(0)
        })
    })


    test('400 if no url or title', async () => {
        const token = await helper.createUserToken(api)
    
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
            .set('Authorization', `Bearer ${token}`)
            .send(noTitleBlog)
            .expect(400)
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(noUrlBlog)
            .expect(400)
    })

    test('401 if no authentication token', async () => {
        const newBlog = {
            title: "Johnny Bravo strikes back!",
            author: "John",
            url: "https://top10cartoons.com",
            likes: 15
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })


    test('deleting specific blog post returns 204', async () => {
        const token = await helper.createUserToken(api)

        const newBlog = {
            title: "Johnny Bravo strikes back!",
            author: "John",
            url: "https://top10cartoons.com",
            likes: 15
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = await Blog.findById(result.body.id)
        console.log('BLOG TO DELETE', blogToDelete)

        await api
            .delete(`/api/blogs/${blogToDelete._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
            blogsAtStart.length - 1
        )
    
        const contents = blogsAtEnd.map(blog => blog.id)
    
        expect(contents).not.toContain(blogToDelete._id.toString())
    })


    test('proper update of a blog entry', async () => {
        const token = await helper.createUserToken(api)

        const blogsAtStart = await helper.blogsInDb()
        
        let blogToUpdate = blogsAtStart[0]
        blogToUpdate.likes += 1
    
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(blogToUpdate)
            .expect(200)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})

