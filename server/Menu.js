"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var type = ["dish, beverage"];
var menuSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        "enum": type
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true,
        "enum": type
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    ingredients: {
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
});
function getMenuSchema() { return menuSchema; }
exports.getMenuSchema = getMenuSchema;
// Mongoose Model
var menuModel; // This is not exposed outside the model
function getUserModel() {
    if (!menuModel) {
        menuModel = mongoose.model('Menu', getMenuSchema());
    }
    return menuModel;
}
exports.getUserModel = getUserModel;
