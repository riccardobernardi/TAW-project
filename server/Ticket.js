"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var type = ["dish, beverage"];
var ticketSchema = new mongoose.Schema({
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
        required: false
    },
    orders: {
        type: [{
                id_command: String,
                id_menu: String,
                id_waiter: String,
                state: String,
                price: Number,
                added: [String],
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