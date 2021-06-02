const test = require("ava")
const request = require("supertest")
const app = require("../app")

test("App js", async t => {
    const res = await request(app).get("/")
    t.is(res.status, 200)
})

test("Create a new user", async t => {
    const userToCreate = {
        name: "Emin",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }

    const res = await request(app).post("/users/all").send(userToCreate)

    t.is(res.status, 200)

    t.is(res.body.name, userToCreate.name)
    t.is(res.body.age, userToCreate.age)
    t.is(res.body.wallet, userToCreate.wallet)
})

test("Fetch a user", async t => {
    const userToCreate = {
        name: "Emin",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body

    const fetchRes = await request(app).get(`/users/${userCreated._id}`)
    t.is(fetchRes.status, 200)

    const fetchResJson = await request(app).get(`/users/${userCreated._id}/json`)
    t.is(fetchResJson.status, 200)

    const userFetched = fetchResJson.body
    t.deepEqual(userFetched, userCreated)
})

test("Delete a user", async t => {
    const userToCreate = {
        name: "Emin",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body

    const deleteRes = await request(app).delete(`/users/${userCreated._id}`)
    t.is(deleteRes.status, 200)
    t.is(deleteRes.ok, true)

    const fetch = await request(app).get(`/users/${userCreated._id}`)
    t.is(fetch.status, 404)

    const fetchJson = await request(app).get(`/users/${userCreated._id}/json`)
    t.is(fetchJson.status, 404)
})

test("Get list of users", async t => {
    const userToCreate = {
        name: "Emin",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body

    const res = await request(app).get("/users/all")
    t.is(res.status, 200)

    const jsonRes = await request(app).get("/users/all/json")
    t.is(jsonRes.status, 200)

    t.true(Array.isArray(jsonRes.body), "Body should be an array")
    t.true(jsonRes.body.length > 0)
})

test("User can add a product to the basket", async t => {
    const userToCreate = {
        name: "Aslı",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const productToCreate = {
        name: "Biskrem",
        price: 1.50,
        quantity: 60
    }
    const quantity = 1

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body
    const productCreated = (await  request(app).post("/products/all").send(productToCreate)).body

    const addToBasketRes = await request(app).post(`/users/${userCreated._id}/add/${productCreated._id}/${quantity}`)
    t.is(addToBasketRes.status, 200)

    const userBasket = addToBasketRes.body
    t.is(userBasket.basket[0], productCreated._id)
    t.notDeepEqual(userBasket, userCreated)

    const userBasketRes = await request(app).get(`/users/${userCreated._id}/basket`)
    t.is(userBasketRes.status, 200)
})

test("User can remove a product from the basket", async t => {
    const userToCreate = {
        name: "Aslı",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const productToCreate = {
        name: "Biskrem",
        price: 1.50,
        quantity: 60
    }
    const quantity = 1

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body
    const productCreated = (await  request(app).post("/products/all").send(productToCreate)).body

    const addToBasketRes = await request(app).post(`/users/${userCreated._id}/add/${productCreated._id}/${quantity}`)

    const userBasket = addToBasketRes.body

    const removeFromBasketRes = await request(app).delete(`/users/${userBasket._id}/basket/${productCreated._id}`)
    t.is(removeFromBasketRes.status, 200)

    const userEmpty = removeFromBasketRes.body

    t.deepEqual(userEmpty.basket, [])
})

test("User can pay for products in the basket", async t => {
    const userToCreate = {
        name: "Deniz",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const productToCreate = {
        name: "Biskrem",
        price: 1.50,
        quantity: 60
    }
    const quantity = 1

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body
    const productCreated = (await  request(app).post("/products/all").send(productToCreate)).body

    const addToBasketRes = await request(app).post(`/users/${userCreated._id}/add/${productCreated._id}/${quantity}`)

    let userBasket = addToBasketRes.body

    const payTheBasket = await request(app).post(`/users/${userBasket._id}/basket`)
    t.is(payTheBasket.status, 200)

    const userPayed = payTheBasket.body

    t.deepEqual(userPayed.basket, [])
    t.is(userPayed.totalPrice, 0)
    t.is(userPayed.wallet, userCreated.wallet - productCreated.price)

})

test("User can add money to the wallet", async t => {
    const userToCreate = {
        name: "Cemil",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const moneyToAdd = 20

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body

    const addMoneyRes = await request(app).post(`/users/${userCreated._id}/${moneyToAdd}`)
    t.is(addMoneyRes.status, 200)

    const userAltered = addMoneyRes.body
    t.is(userAltered.wallet, userCreated.wallet + moneyToAdd)
    t.notDeepEqual(userAltered, userCreated)
})

test("User can't add product to basket if quantity isn't enough" , async t => {
    const userToCreate = {
        name: "Cemil",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const productToCreate = {
        name: "Biskrem",
        price: 1.50,
        quantity: 60
    }
    const quantity = 61

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body
    const productCreated = (await  request(app).post("/products/all").send(productToCreate)).body

    const addToBasketRes = await request(app).post(`/users/${userCreated._id}/add/${productCreated._id}/${quantity}`)
    t.is(addToBasketRes.status, 200)

    const userAltered = addToBasketRes.body

    t.deepEqual(userAltered.basket, [])
    t.is()
})

test("User can't pay the basket if there isn't enough money", async t => {
    const userToCreate = {
        name: "Deniz",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }
    const productToCreate = {
        name: "Biskrem",
        price: 1.50,
        quantity: 60
    }
    const quantity = 40

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body
    const productCreated = (await  request(app).post("/products/all").send(productToCreate)).body

    const addToBasketRes = await request(app).post(`/users/${userCreated._id}/add/${productCreated._id}/${quantity}`)

    let userBasket = addToBasketRes.body

    const payTheBasket = await request(app).post(`/users/${userBasket._id}/basket`)
    t.is(payTheBasket.status, 200)

    const userPayed = payTheBasket.body
    t.is(userPayed.totalPrice, userBasket.totalPrice)
    t.deepEqual(userPayed.basket, userBasket.basket)
})

test("User can't pay if there isn't any product in th basket", async (t) => {
    const userToCreate = {
        name: "Arif",
        age: 20,
        wallet: 50,
        basket: [],
        totalPrice: 0
    }

    const userCreated = (await request(app).post("/users/all").send(userToCreate)).body

    const payTheBasketRes = await request(app).post(`/users/${userCreated._id}/basket`)
    t.is(payTheBasketRes.status, 200)
    t.is(payTheBasketRes.body.wallet, userCreated.wallet)
})