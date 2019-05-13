"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
<<<<<<< HEAD
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
=======
//CODICE DOPPIO, VEDERE SE SI PUO' CENTRALIZZARE, c'è anche in menu.ts
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
var tableSchema = new mongoose.Schema({
    number: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true
    },
    max_people: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) == 0;
            },
            message: "Max people must be an integer number."
        }
    },
    state: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        "enum": ["free", "occupied"]
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
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
