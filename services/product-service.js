const BaseService = require("./base-service")
const ProductModel = require('../models/products')
const chalk = require('chalk')

class ProductService extends BaseService{
    model = ProductModel

    async editPrice(product, newValue) {
        console.log("Product price has changed from " + chalk.red(product.price) + " to " + chalk.green(newValue))
        product.price = newValue
        await product.save()
    }

    async editQuantity(product, newValue) {
        console.log("Product quantity has changed from " + chalk.red(product.quantity) + " to " + chalk.green(newValue))
        product.quantity = newValue
        await product.save()
    }
}

module.exports = new ProductService()