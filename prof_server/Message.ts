
import mongoose = require('mongoose');


// A message has some text content, a list of tags and a timestamp
//
export interface Message {
    tags: string[],
    content: string,
    timestamp: Date,
    authormail: string
}

// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
export function isMessage(arg: any): arg is Message {
    return arg && arg.content && typeof(arg.content) == 'string' && arg.tags && Array.isArray(arg.tags) && arg.timestamp && arg.timestamp instanceof Date && arg.authormail && typeof(arg.authormail) == 'string' ;
}


// We use Mongoose to perform the ODM between our application and
// mongodb. To do that we need to create a Schema and an associated
// data model that will be mapped into a mongodb collection
//
// Type checking cannot be enforced at runtime so we must take care
// of correctly matching the Message interface with the messageSchema 
//
// Mongoose Schema
var messageSchema = new mongoose.Schema( {
    tags: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    content:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },
    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    authormail: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
})
export function getSchema() { return messageSchema; }

// Mongoose Model
var messageModel;  // This is not exposed outside the model
export function getModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !messageModel ) {
        messageModel = mongoose.model('Message', getSchema() )
    }
    return messageModel;
}