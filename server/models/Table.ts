import mongoose = require('mongoose');

//Interface of table, we don't know how use it at the moment
export interface Table extends mongoose.Document {
    number: number,
    max_people: number,
    state: string,
    associated_ticket: string
}

//CODICE DOPPIO, VEDERE SE SI PUO' CENTRALIZZARE, c'è anche in menu.ts
var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

export var states: Array<String> = ["free", "taken"];

var tableSchema = new mongoose.Schema( {
    number: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true

    },
    max_people:  {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function(value){
                return countDecimals(value) == 0;
            },
            message: "Max people must be an integer number."
        }
    },
    state: {
        type: mongoose.SchemaTypes.String,
        required : true,
        enum: states
    },
    associated_ticket: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    }
})

export function getSchema() { return tableSchema; }

// Mongoose Model
var tableModel;  // This is not exposed outside the model
export function getModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !tableModel ) {
        tableModel = mongoose.model('Table', getSchema() )
    }
    return tableModel;
}