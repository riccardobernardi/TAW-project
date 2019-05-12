import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface Menu {
    name: string,
    type: string,
    price: number,
    ingredients: [string],
    required_time: number,
    description: string
}

var type = ["dish, beverage"]; 

var menuSchema = new mongoose.Schema( {
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: type
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required : true,
        enum: type,
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
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

export function getMenuSchema() { return menuSchema; }

// Mongoose Model
var menuModel;  // This is not exposed outside the model
export function getUserModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !menuModel ) {
        menuModel = mongoose.model('Menu', getMenuSchema() )
    }
    return menuModel;
}