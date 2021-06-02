const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    address: String,
    wallet: Number,
    basket: {
        type: Array
    },
    totalPrice: Number
})

UserSchema.plugin(require("mongoose-autopopulate"))

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel