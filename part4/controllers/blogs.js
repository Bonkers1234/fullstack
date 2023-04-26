
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user._id
    })
  
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === request.user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)

        request.user.blogs = request.user.blogs.filter(item => item.toString() !== blog._id.toString())
        await request.user.save()
        response.status(204).end()
    } else {
        return response.status(400).json({ error: 'unauthorized request' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    const updatedBlog = 
      await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
})

module.exports = blogsRouter











