
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
    })
    //check if this code change breaks 'part5' front end app, it probably does
    if(!request.user) {
      return response.status(401).json({ error: 'operation not permitted'})
    }
  
    blog.user = request.user._id

    let savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    savedBlog = await Blog.findById(savedBlog._id).populate('user')
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    // if (blog.user.toString() === request.user._id.toString()) {
    //     await Blog.findByIdAndRemove(request.params.id)

    //     request.user.blogs = request.user.blogs.filter(item => item.toString() !== blog._id.toString())
    //     await request.user.save()
    //     response.status(204).end()
    // } else {
    //     return response.status(400).json({ error: 'unauthorized request' })
    // }

    const user = request.user

    if(!user || blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'operation not permitted' })
    }

    user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())

    await user.save()
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    let updatedBlog = 
      await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
    )

    updatedBlog = await Blog.findById(updatedBlog._id).populate('user')
    response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const comment = request.body.comment
    const blog = await Blog.findById(request.params.id)

    const updatedBlog = 
      await Blog.findByIdAndUpdate(
        request.params.id,
        { 
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes,
          user: blog.user,
          comments: [...blog.comments, comment]
        },
        { new: true, runValidators: true, context: 'query' }
      )
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter











