import mongoose = require('mongoose');

//Interface of reports
export interface Report extends mongoose.Document {
    date: Date,
    total: number,
    total_orders: {dish: number, beverage: number},
    //le chiavi di total_order sono le stringe contenute in item.type, ricordarsi di usare quelle
    total_customers: number,
    average_stay: number; //minuti
}


export function isReport(arg: any): arg is Report {
    return (/*arg._id &&*/ arg.date && arg.total && arg.total_orders && arg.total_customers && arg.average_stay != null && arg.average_stay != undefined && arg.date.toString() != 'Invalid Date' && typeof(arg.total) == 'number' && typeof(arg.total_orders.dish) == 'number' && typeof(arg.total_orders.beverage) == 'number' && typeof(arg.total_customers) == 'number' && typeof(arg.average_stay) == 'number');
 };

var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

var reportSchema = new mongoose.Schema( {
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        unique: true
    },
    total: {
        type: mongoose.SchemaTypes.Number,
        validate: {
            validator: function(value){
                return countDecimals(value) <= 2;
            },
            message: "Price must have a precision of maximum 2 digits."
        }
    },
    total_orders: {
        type: {dish: mongoose.SchemaTypes.Number, beverage: mongoose.SchemaTypes.Number},
        required: true,
    },
    total_customers:  {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    average_stay: {
        type: mongoose.SchemaTypes.Number,
        required: true
    }
})

export function getSchema() { return reportSchema; }

// Mongoose Model
var reportModel;  // This is not exposed outside the model
export function getModel() : mongoose.Model< mongoose.Document > { // Return Model as singleton
    if( !reportModel ) {
        reportModel = mongoose.model('Report', getSchema() )
    }
    return reportModel;
}