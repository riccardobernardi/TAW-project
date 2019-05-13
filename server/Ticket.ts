import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
//export interface order {
export interface Ticket extends mongoose.Document {
    _id: string,
    waiter: string,
    table: string,
    start: Date,
    end: Date,
    command: string,
    state: string,
    total: number
}

var type = ["dish, beverage"]; 

var ticketSchema = new mongoose.Schema( {
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
})

//export function getOrderSchema() { return orderSchema; }
export function getSchema() { return ticketSchema; }
// Mongoose Model
var ticketModel // This is not exposed outside the model

export function getModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !ticketModel ) {
        ticketModel = mongoose.model('Ticket', getSchema() )
    }
    return ticketModel;
}