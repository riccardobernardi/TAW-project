"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var type = ["dish, beverage"];
var orderSchema = new mongoose.Schema({
    waiter: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    table: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    start: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    end: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    command: {
        type: [{
                id_command: String,
                id_menu: String,
                id_waiter: String,
                state: String,
                price: Number,
                added: [String]
            }],
        required: true
    },
    state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
});
function getOrderSchema() { return orderSchema; }
exports.getOrderSchema = getOrderSchema;
// Mongoose Model
var orderModel; // This is not exposed outside the model
function getUserModel() {
    if (!orderModel) {
        orderModel = mongoose.model('Order', getOrderSchema());
    }
    return orderModel;
}
exports.getUserModel = getUserModel;
