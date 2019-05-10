import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface User {
    username: string,
    password: string,
    role: string
}

var roles = ["waiter, cook, desk, bartender"];

var userSchema = new mongoose.Schema( {
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: roles
    },
    password:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },
    role: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
})

export function getUserSchema() { return userSchema; }

// Mongoose Model
var userModel;  // This is not exposed outside the model
export function getUserModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !userModel ) {
        userModel = mongoose.model('Table', getUserSchema() )
    }
    return userModel;
}