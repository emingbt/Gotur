const test = require("ava")
const request = require("supertest")
const app = require("../app")

test("Create a new product", async t => {
    const productToCreate = {
        name: "Tutku",
        price: 1.50,
        quantity: 24
    }

    const res = await request(app).post("/products/all").send(productToCreate)

    t.is(res.status, 200)

    t.is(res.body.name, productToCreate.name)
    t.is(res.body.price, productToCreate.price)
    t.is(res.body.quantity, productToCreate.quantity)
})

test("Fetch a product", async t => {
    const productToCreate = {
        name: "Halley",
        price: 1,
        quantity: 48
    }

    const productCreated = (await request(app).post("/products/all").send(productToCreate)).body

    const fetchRes = await request(app).get(`/products/${productCreated._id}`)
    t.is(fetchRes.status, 200)

    const fetchResJson = await request(app).get(`/products/${productCreated._id}/json`)
    t.is(fetchResJson.status, 200)

    const productFetched = fetchResJson.body
    t.deepEqual(productFetched, productCreated)
})

test("Delete a product", async t => {
    const productToCreate = {
        name: "Benimo",
        price: 1.50,
        quantity: 24
    }

    const productCreated = (await request(app).post("/products/all").send(productToCreate)).body

    const deleteRes = await request(app).delete(`/products/${productCreated._id}`)
    t.is(deleteRes.status, 200)
    t.is(deleteRes.ok, true)

    const fetch = await request(app).get(`/products/${productCreated._id}`)
    t.is(fetch.status, 404)
    const fetchJson = await request(app).get(`/products/${productCreated._id}/json`)
    t.is(fetchJson.status, 404)
})

test("Get list of products", async t => {
    const productToCreate = {
        name: "CocoStar",
        price: 1.50,
        quantity: 24
    }

    const productCreated = (await request(app).post("/products/all").send(productToCreate)).body

    const res = await request(app).get("/products/all")
    t.is(res.status, 200)

    const jsonRes = await request(app).get("/products/all/json")
    t.is(jsonRes.status, 200)

    t.true(Array.isArray(jsonRes.body), "Body should be an array")
    t.true(jsonRes.body.length > 0)
})

test("Update the product price", async t => {
    const productToCreate = {
        name: "Dido",
        price: 1.50,
        quantity: 24
    }
    const updatedPrice = 1.25

    const productCreated = (await request(app).post("/products/all").send(productToCreate)).body

    const editPriceRes = await request(app).post(`/products/${productCreated._id}/price/${updatedPrice}`)
    t.is(editPriceRes.status, 200)

    const productUpdated = editPriceRes.body

    t.is(productUpdated.price, updatedPrice)
})

test("Update the product quantity", async t => {
    const productToCreate = {
        name: "Albeni",
        price: 1.25,
        quantity: 120
    }
    const updatedQuantity = 1.25

    const productCreated = (await request(app).post("/products/all").send(productToCreate)).body

    const editQuantityRes = await request(app).post(`/products/${productCreated._id}/quantity/${updatedQuantity}`)
    t.is(editQuantityRes.status, 200)

    const productUpdated = editQuantityRes.body

    t.is(productUpdated.quantity, updatedQuantity)
})