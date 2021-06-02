const BaseService = require('./base-service')
const UserModel = require('../models/user')
const ProductService = require('./product-service')
const chalk = require("chalk")

class UserService extends BaseService {
    model = UserModel

    async addToBasket(user, product, quantity) {
        if (quantity > product.quantity) {
            console.log(`Sorry! There are just ${product.quantity} ${product.name}s we have.`)
            return
        }

        for (let i=0;i<quantity;i++) {
        await user.basket.push(product._id)
        }

        quantity = +quantity
        user.totalPrice += (product.price * quantity)
        
        await user.save()
        console.log("Added to the basket")
    }

    async removeFromBasket(user, product) {
        await user.basket.splice(user.basket.indexOf(product._id), 1)
        await user.save()
        console.log(product.name + " has removed from the basket.")
    }

    async pay(user) {
        if (user.totalPrice > user.wallet) {
            console.log(`${chalk.red("Sorry!")} There isn't enough money to pay in your wallet.`)
            return
        }
        else if (user.basket.length == 0) {
            console.log(`${chalk.red("Sorry!")} There isn't any product in the basket.`)
            return
        }

        for (let i=0;i<user.basket.length;i++) {
            const product = await ProductService.find(user.basket[i])
            await ProductService.editQuantity(product, product.quantity - 1)
        }

        user.wallet -= user.totalPrice
        user.basket = []
        user.totalPrice = 0
        await user.save()
        console.log(chalk.green("Paying completed"))
    }

    async addMoney(user, money) {
        user.wallet += +money
        await user.save()
        console.log("Money in your wallet is increased.")
    }
}

module.exports = new UserService()