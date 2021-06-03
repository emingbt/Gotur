const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const userRouter = require('./routes/user')
const productRouter = require('./routes/product')

require('./mongo-connection')

const app = express()
app.use(cors())
//another test
app.set('view engine', 'pug')
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/products', productRouter)
//test?
app.get('/', (req, res) => {
  res.render('index')
})
//test, test, test....
module.exports = app