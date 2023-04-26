
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        if (error.message = 'jwt must be provided') {
            return response.status(401).json({ error: error.message })
        }
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

const getTokenFrom = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token =  null
    }

    next()
}

const userExtractor = async (request, response, next) => {
    if (request.method !== "GET") {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(400).json({ error: 'token invalid' })
        }

        request.user = await User.findById(decodedToken.id)
    }

    next()
}

module.exports = {
    errorHandler,
    getTokenFrom,
    userExtractor
}





