require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const  errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

//logger come befor every things 
app.use(logger)

app.use(cors(corsOptions))

// app able to receive and read json file
app.use(express.json())

// for cookie parsing
app.use(cookieParser())


// middleware that tells where to grab static file and route
app.use('/', express.static(path.join(__dirname, 'public'))) 

app.use('/', require('./routes/root'))
app.use('/personnel', require('./routes/personnelRoutes'))
app.use('/user', require('./routes/usersRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

 app.use(errorHandler)

 mongoose.connection.once('open', () => {
    console.log('connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
 })

 mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
 })
