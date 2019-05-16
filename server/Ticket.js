"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
exports.orderState = ["ordered", "preparation", "ready", "delivered"];
exports.ticketState = ["open", "closed"];
var type = ["dish, beverage"];
var ticketSchema = new mongoose.Schema({
    waiter: {
        type: mongoose.SchemaTypes.String,
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
        required: false
    },
    orders: {
        type: [{
                id_order: String,
                name_item: String,
                username_waiter: String,
                state: String,
                price: Number,
                added: [String]
            }],
        required: true
    },
    state: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
});
//export function getOrderSchema() { return orderSchema; }
function getSchema() { return ticketSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var ticketModel; // This is not exposed outside the model
function getModel() {
    if (!ticketModel) {
        ticketModel = mongoose.model('Ticket', getSchema());
    }
    return ticketModel;
}
exports.getModel = getModel;
