"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
function isReport(arg) {
    return ( /*arg._id &&*/arg.date && arg.total && arg.total_orders && arg.total_customers && arg.average_stay != null && arg.average_stay != undefined && arg.date.toString() != 'Invalid Date' && typeof (arg.total) == 'number' && typeof (arg.total_orders.dish) == 'number' && typeof (arg.total_orders.beverage) == 'number' && typeof (arg.total_customers) == 'number' && typeof (arg.average_stay) == 'number');
}
exports.isReport = isReport;
;
var countDecimals = function (value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};
var reportSchema = new mongoose.Schema({
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        unique: true
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        validate: {
            validator: function (value) {
                return countDecimals(value) <= 2;
            },
            message: "Price must have a precision of maximum 2 digits."
        }
    },
    total_orders: {
        type: { dish: mongoose.SchemaTypes.Number, beverage: mongoose.SchemaTypes.Number },
        required: true
    },
    total_customers: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    average_stay: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
});
function getSchema() { return reportSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var reportModel; // This is not exposed outside the model
function getModel() {
    if (!reportModel) {
        reportModel = mongoose.model('Report', getSchema());
    }
    return reportModel;
}
exports.getModel = getModel;
