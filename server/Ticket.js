"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.orderState = ["ordered", "preparation", "ready", "delivered"];
exports.ticketState = ["open", "closed"];
//controlla numero di cifre decimali
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
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
                username_executer: String,
                state: String,
                price: Number,
                added: [String],
                type_item: String,
                required_time: Number
            }],
        required: false
    },
    state: {
        type: mongoose.SchemaTypes.String,
        required: false,
        enum: exports.ticketState
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        required: false,
        validate: {
            validator: function (value) {
                return countDecimals(value) <= 2;
            },
            message: "Total must have a precision of maximum 2 digits."
        }
    },
    people_number: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) == 0;
            },
            message: "People number must be an integer."
        }
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
//# sourceMappingURL=Ticket.js.map