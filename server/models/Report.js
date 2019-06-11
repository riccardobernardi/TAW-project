"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var user = require("./User");
function isWaiterReport(arg) {
    return (arg.username && arg.costumers_served && arg.orders_served && typeof (arg.username) == "string" && typeof (arg.costumers_served) == "number" && typeof (arg.orders_served) == "number");
}
exports.isWaiterReport = isWaiterReport;
;
function isCookerBartenderReport(arg) {
    return (arg.username && arg.items_served && typeof (arg.username) == "string" && typeof (arg.items_served) == "number");
}
exports.isCookerBartenderReport = isCookerBartenderReport;
;
function isUsersReports(arg) {
    var user_report = true;
    if (arg.users_reports[user.roles[0]]) {
        arg.users_reports[user.roles[0]].array.forEach(function (element) {
            user_report = user_report && isWaiterReport(element);
        });
    }
    if (arg.users_reports[user.roles[1]]) {
        arg.users_reports[user.roles[1]].array.forEach(function (element) {
            user_report = user_report && isCookerBartenderReport(element);
        });
    }
    if (arg.users_reports[user.roles[3]]) {
        arg.users_reports[user.roles[3]].array.forEach(function (element) {
            user_report = user_report && isCookerBartenderReport(element);
        });
    }
    return user_report;
}
exports.isUsersReports = isUsersReports;
function isReport(arg) {
    //controllo campi tranne users_reports
    var no_user_report = ( /*arg._id &&*/arg.date && arg.total && arg.total_orders && arg.total_customers && arg.average_stay != null && arg.average_stay != undefined && arg.date.toString() != 'Invalid Date' && typeof (arg.total) == 'number' && typeof (arg.total_orders.dish) == 'number' && typeof (arg.total_orders.beverage) == 'number' && typeof (arg.total_customers) == 'number' && typeof (arg.average_stay) == 'number');
    return no_user_report && (!arg.user_report || isUsersReports(arg.user_report));
}
exports.isReport = isReport;
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
        },
        required: true
    },
    total_orders: {
        type: { dish: mongoose.SchemaTypes.Number, beverage: mongoose.SchemaTypes.Number },
        required: true,
        validate: {
            validator: function (value) {
                var ret = true;
                if (value.dish)
                    ret = (countDecimals(value.dish) == 0);
                if (value.beverage)
                    ret = ret && (countDecimals(value.beverage) == 0);
                return ret;
            },
            message: "Total orders must be an integer number."
        }
    },
    total_customers: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        validate: {
            validator: function (value) {
                return countDecimals(value) == 0;
            },
            message: "Total customers must be an integer number."
        }
    },
    average_stay: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    users_reports: {
        type: {},
        required: false
    }
    /*il formato di users_reports è il seguente:
    {
        user.roles[0]: [UsersReports],
        user.roles[1]: [UsersReports],
        user.roles[2]: [UsersReports],
        user.roles[3]: [UsersReports],
    }
    non tutti i ruoli sono richiesti.
    */
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
