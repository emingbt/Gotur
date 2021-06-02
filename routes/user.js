const express = require('express')
const router = express.Router()
const chalk = require("chalk")

const UserService = require('../services/user-service')
const ProductService = require("../services/product-service")

router.get("/all", async (req, res) => {
  const users = await UserService.findAll()
  res.render('users', { users })
})

router.get('/all/json', async (req, res) => {
  const user = await UserService.findAll()
  res.send(user)
})

router.get("/:id", async (req, res) => {
  const user = await UserService.find(req.params.id)
  if (!user) res.status(404)
  res.render("user", { user })
})

router.get("/:id/json", async (req, res) => {
  const user = await UserService.find(req.params.id)
  if (!user) res.status(404)
  res.send(user)
})

router.post("/all", async (req, res) => {
  const user = await UserService.add(req.body)
  res.send(user)
  console.log(chalk.blue("New user ") + chalk.green("added (" + chalk.yellow(user.name) + ")"))
})

router.delete("/:id", async (req, res) => {
  const user = await UserService.del(req.params.id)
  console.log("A user " + chalk.red("deleted"))
  res.send(user)
})

router.post("/:userId/:productId/:quantity", async (req, res) => {
  const user = await UserService.find(req.params.userId)
  const product = await ProductService.find(req.params.productId)
  await UserService.addToBasket(user, product, req.params.quantity)

  res.send(user)
})

router.get("/:id/basket", async (req,res) => {
  const user = await UserService.find(req.params.id)
  res.render("basket", { user })
})

router.post("/:id/basket", async (req, res) => {
  const user = await UserService.find(req.params.id)
  await UserService.pay(user)
  res.send(user)
})

router.delete("/:id/basket/:productId", async(req, res) => {
  const user = await UserService.find(req.params.id)
  const product = await ProductService.find(req.params.productId)
  await UserService.removeFromBasket(user, product)-
  res.send(user)
})

// ortaya /wallet koyunca çalışmıyor, peki neden?
router.post("/:id/:money", async(req, res) => {
  const user = await UserService.find(req.params.id)
  await UserService.addMoney(user, req.params.money)
  res.send(user)
})

router.post("/:id/favorite/:product", async (req, res) => {
  console.log("test1")
  const user = await UserService.find(req.params.id)
  await UserService.addToFavorites(user, req.params.product)
  res.send(user)
})

module.exports = router