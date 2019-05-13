System.register(['mongoose'], function(exports_1) {
    var mongoose;
    var type, orderSchema, orderModel;
    function getOrderSchema() { return orderSchema; }
    exports_1("getOrderSchema", getOrderSchema);
    function getUserModel() {
        if (!orderModel) {
            orderModel = mongoose.model('Order', getOrderSchema());
        }
        return orderModel;
    }
    exports_1("getUserModel", getUserModel);
    return {
        setters:[
            function (_mongoose) {
                mongoose = _mongoose;
            }],
        execute: function() {
            type = ["dish, beverage"];
            orderSchema = new mongoose.Schema({
                waiter: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true
                },
                table: {
                    type: mongoose.SchemaTypes.Number,
                    required: true
                },
                start: {
                    type: mongoose.SchemaTypes.Date,
                    required: true
                },
                end: {
                    type: mongoose.SchemaTypes.Date,
                    required: true
                },
                command: {
                    type: [{
                            id_command: String,
                            id_menu: String,
                            id_waiter: String,
                            state: String,
                            price: Number,
                            added: [String]
                        }],
                    required: true
                },
                state: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true
                },
                total: {
                    type: mongoose.SchemaTypes.Number,
                    required: true
                }
            });
            // Mongoose Model
             // This is not exposed outside the model
        }
    }
});
