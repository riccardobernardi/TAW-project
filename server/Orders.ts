import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface order {
    waiter: string,
    table: string,
    start: string,
    end: number,
    command: string
}

var type = ["dish, beverage"]; 

var orderSchema = new mongoose.Schema( {
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: 
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required : true,
        enum: type,
    },
    ingredients:  {
        type: [mongoose.SchemaTypes.String],
        required: false 
    },
    required_time: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
})

export function getOrderSchema() { return orderSchema; }

// Mongoose Model
var orderModel;  // This is not exposed outside the model
export function getUserModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !orderModel ) {
        orderModel = mongoose.model('Table', getOrderSchema() )
    }
    return orderModel;
}