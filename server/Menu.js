"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var type = ["dish, beverage"];
<<<<<<< HEAD
=======
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
var menuSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
<<<<<<< HEAD
        "enum": type
=======
        unique: true
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true,
        "enum": type
    },
    price: {
        type: mongoose.SchemaTypes.Number,
<<<<<<< HEAD
        required: true
=======
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) <= 2;
            },
            message: "Price must have a precision of maximum 2 digits."
        }
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
    },
    ingredients: {
        type: [mongoose.SchemaTypes.String],
        required: false
    },
    required_time: {
        type: mongoose.SchemaTypes.Number,
<<<<<<< HEAD
        required: true
=======
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) == 0;
            },
            message: "Required time must be an integer number."
        }
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
});
<<<<<<< HEAD
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
=======
function getSchema() { return menuSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var menuModel; // This is not exposed outside the model
function getModel() {
    if (!menuModel) {
        menuModel = mongoose.model('Menu', getSchema());
    }
    return menuModel;
}
exports.getModel = getModel;
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
