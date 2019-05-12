"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var tableSchema = new mongoose.Schema({
    numero: {
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
function getTableSchema() { return tableSchema; }
exports.getTableSchema = getTableSchema;
// Mongoose Model
var tableModel; // This is not exposed outside the model
function getTableModel() {
    if (!tableModel) {
        tableModel = mongoose.model('Table', getTableSchema());
    }
    return tableModel;
}
exports.getTableModel = getTableModel;
