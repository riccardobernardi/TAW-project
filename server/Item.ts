import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface Item extends mongoose.Document {
    name: string,
    type: string,
    price: number,
    ingredients: [string],
    required_time: number,
    description: string
}

var type = ["dish, beverage"]; 

var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

var itemSchema = new mongoose.Schema( {
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required : true,
        enum: type,
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function(value){
                return countDecimals(value) <= 2;
            },
            message: "Price must have a precision of maximum 2 digits."
        }
    },
    ingredients:  {
        type: [mongoose.SchemaTypes.String],
        required: false 
    },
    required_time: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function(value){
                return countDecimals(value) == 0;
            },
            message: "Required time must be an integer number."
        }
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
})

export function getSchema() { return itemSchema; }

// Mongoose Model
var itemModel;  // This is not exposed outside the model
export function getModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !itemModel ) {
        itemModel = mongoose.model('Item', getSchema() )
    }
    return itemModel;
}