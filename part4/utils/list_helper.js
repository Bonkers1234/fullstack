
const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (blog, check) => {
        if (blog.likes > check.likes) {
            return {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        } else if (blog.likes <= check.likes) {
            return {
                title: check.title,
                author: check.author,
                likes: check.likes
            }
        }
    }

    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    const sum = _.countBy(blogs, 'author')
    const result = _.maxBy(Object.entries(sum))

    return {
        author: result[0],
        blogs: result[1]
    }
}

const mostLikes = (blogs) => {
    const sum = blogs.reduce((list, entry) => {
        if (!list[entry.author]) {
            list[entry.author] = {
                author: entry.author,
                likes: entry.likes
            }
        } else {
            list[entry.author].likes += entry.likes
        }
        return list
    }, {})

    return _.maxBy(Object.values(sum), 'likes')
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}





