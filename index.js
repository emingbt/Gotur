const chalk = require("chalk")
const app = require("./app")

app.listen(3000, () => {
    console.log(chalk.rgb(120,73,247)("Server") + chalk.rgb(255,228,48)(" listening"))
})