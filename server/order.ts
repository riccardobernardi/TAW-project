import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface order {
    waiter: string,
    table: string,
    start: Date,
    end: Date,
    command: string,
    state: string,
    total: number
}

var type = ["dish, beverage"]; 

var orderSchema = new mongoose.Schema( {
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

export function getOrderSchema() { return orderSchema; }

// Mongoose Model
var orderModel;  // This is not exposed outside the model
export function getUserModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !orderModel ) {
        orderModel = mongoose.model('Order', getOrderSchema() )
    }
    return orderModel;
}