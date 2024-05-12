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

app.get('/user/:id', async (req, res) => {
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

app.listen(3000, () => console.log('server started on port 3000'))