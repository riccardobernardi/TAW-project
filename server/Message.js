"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
function isMessage(arg) {
    return arg && arg.content && typeof (arg.content) == 'string' && arg.tags && Array.isArray(arg.tags) && arg.timestamp && arg.timestamp instanceof Date && arg.authormail && typeof (arg.authormail) == 'string';
}
exports.isMessage = isMessage;
// We use Mongoose to perform the ODM between our application and
// mongodb. To do that we need to create a Schema and an associated
// data model that will be mapped into a mongodb collection
//
// Type checking cannot be enforced at runtime so we must take care
// of correctly matching the Message interface with the messageSchema 
//
// Mongoose Schema
var messageSchema = new mongoose.Schema({
    tags: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    content: {
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
});
function getSchema() { return messageSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var messageModel; // This is not exposed outside the model
function getModel() {
    if (!messageModel) {
        messageModel = mongoose.model('Message', getSchema());
    }
    return messageModel;
}
exports.getModel = getModel;
//# sourceMappingURL=Message.js.map