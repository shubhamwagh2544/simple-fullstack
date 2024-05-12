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

app.listen(3000, () => console.log('server started on port 3000'))