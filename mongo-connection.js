const chalk = require("chalk")
const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/götür', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(chalk.green('Connected'))
    })
    .catch(err => {
        console.log(err)
    })