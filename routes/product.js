const express = require('express')
const router = express.Router()
const chalk = require("chalk")

const ProductService = require("../services/product-service")

router.get("/all", async (req, res) => {
  const products = await ProductService.findAll()
  res.render("products", { products })
})

router.get('/all/json', async (req, res) => {
  const product = await ProductService.findAll()
  res.send(product)
})

router.get("/:id", async (req, res) => {
  const product = await ProductService.find(req.params.id)
  if (!product) res.status(404)
  res.render("product", {product})
})

router.get("/:id/json", async (req, res) => {
  const product = await ProductService.find(req.params.id)
  if (!product) res.status(404)
  res.send(product)
})

router.post("/all", async (req, res) => {
  const product = await ProductService.add(req.body)
  res.send(product)
  console.log(chalk.blue("New product ") + chalk.green("added (" + chalk.yellow(product.name) + ")"))
})

router.delete("/:id", async (req, res) => {
  const user = await ProductService.del(req.params.id)
  console.log("A product " + chalk.red("deleted"))
  res.send(user)
})

router.post("/:id/price/:newValue", async (req, res) => {
  const product = await ProductService.find(req.params.id)
  ProductService.editPrice(product, req.params.newValue)
  res.send(product)
})

router.post("/:id/quantity/:newValue", async (req, res) => {
  const product = await ProductService.find(req.params.id)
  ProductService.editQuantity(product, req.params.newValue)
  res.send(product)
})

module.exports = router