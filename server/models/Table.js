"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
//CODICE DOPPIO, VEDERE SE SI PUO' CENTRALIZZARE, c'è anche in menu.ts
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
exports.states = ["free", "taken"];
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
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: exports.states
    },
    associated_ticket: {
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
//# sourceMappingURL=Table.js.map