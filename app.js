const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const userRouter = require('./routes/user')
const productRouter = require('./routes/product')

require('./mongo-connection')

const app = express()
app.use(cors())

app.set('view engine', 'pug')
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/products', productRouter)

app.get('/', (req, res) => {
  res.render('index')
})

module.exports = app