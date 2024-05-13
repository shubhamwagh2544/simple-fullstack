const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const app = express()

app.use(express.json())

//app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // pass control to next handlers
    next()
})

// health check endpoint
app.get('/health', (req, res) => {
    try {
        res.status(200).json({
            message: 'Health OK ✅'
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({
            message: 'error loading users'
        })
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(409).json({
                message: "invalid userId"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return res.status(404).json({
                message: 'User not Found'
            })
        }
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body
        const newUser = await prisma.user.create({
            data: {
                name,
                email
            }
        })
        return res.status(201).json(newUser)
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(409).json({
                message: "invalid userId"
            })
        }
        const { name } = req.body
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name
            }
        })
        return res.status(200).json(updatedUser)
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(409).json({
                message: "invalid userId"
            })
        }
        await prisma.user.delete({
            where: {
                id: userId
            }
        })
        return res.status(200).json({
            message: 'user deleted'
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

app.all("*", (req, res) => {
    res.status(200).json({
        message: 'this might not page you are looking for:'
    })
})

app.listen(3000, () => console.log('server started on port 3000'))