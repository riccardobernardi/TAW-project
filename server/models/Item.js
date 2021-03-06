"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
/*ARGID non c'è tra i campi nella post!*/
function isItem(arg) {
    return (arg._id && arg.name && arg.type && arg.price && arg.required_time && typeof (arg.name) == 'string' && exports.type.includes(arg.type) && !isNaN(parseInt(arg.price)) && (!arg.description || typeof (arg.description) == 'string') && !isNaN(parseInt(arg.required_time)));
}
exports.isItem = isItem;
;
exports.type = ["dish", "beverage"];
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
var itemSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: exports.type,
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) <= 2;
            },
            message: "Price must have a precision of maximum 2 digits."
        }
    },
    ingredients: {
        type: [mongoose.SchemaTypes.String],
        required: false
    },
    required_time: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) == 0;
            },
            message: "Required time must be an integer number."
        }
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
});
function getSchema() { return itemSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var itemModel; // This is not exposed outside the model
function getModel() {
    if (!itemModel) {
        itemModel = mongoose.model('Item', getSchema());
    }
    return itemModel;
}
exports.getModel = getModel;
//# sourceMappingURL=Item.js.map