
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('400 for users that are', () => {
    test('with password not given', async () => {
        const userNoPass = {
            username: "Mickel",
            name: "Mike"
        }

        const result = await api
            .post('/api/users')
            .send(userNoPass)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is too short!')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('with password too short', async () => {
        const userShort = {
            username: "Mickel",
            name: "Mike",
            password: "se"
        }

        const result = await api
            .post('/api/users')
            .send(userShort)
            .expect(400)

        expect(result.body.error).toContain('password is too short!')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)

    })

    test('with username not given', async () => {
        const userNoUser = {
            name: "Mike",
            password: "secret_password"
        }

        const result = await api
            .post('/api/users')
            .send(userNoUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('with username too short', async () => {
        const userShort = {
            username: "Mi",
            name: "Mike",
            password: "secret_password"
        }

        const result = await api
            .post('/api/users')
            .send(userShort)
            .expect(400)

        expect(result.body.error).toContain('is shorter than the minimum allowed length')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('using taken username', async () => {
        const usersAtStart = await helper.usersInDb()
        const userTaken = helper.initialUsers[0]

        const result = await api
            .post('/api/users')
            .send(userTaken)
            .expect(400)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})










