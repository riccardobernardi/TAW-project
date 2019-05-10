import mongoose = require('mongoose');

 
//Interface of table, we don't know how use it at the moment
export interface Table {
    numero: number,
    max_people: number,
    state: string
}

var tableSchema = new mongoose.Schema( {
    numero: {
        type: mongoose.SchemaTypes.Number,
        required: true,

    },
    max_people:  {
        type: mongoose.SchemaTypes.Number,
        required: true 
    },
    state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    }
})

export function getTableSchema() { return tableSchema; }

// Mongoose Model
var tableModel;  // This is not exposed outside the model
export function getTableModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !tableModel ) {
        tableModel = mongoose.model('Table', getTableSchema() )
    }
    return tableModel;
}