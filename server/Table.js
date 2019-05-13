"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var tableSchema = new mongoose.Schema({
    number: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    max_people: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    }
});
function getSchema() { return tableSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var tableModel; // This is not exposed outside the model
function getModel() {
    if (!tableModel) {
        tableModel = mongoose.model('Table', getSchema());
    }
    return tableModel;
}
exports.getModel = getModel;
