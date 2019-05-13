System.register(['mongoose'], function(exports_1) {
    var mongoose;
    var type, menuSchema, menuModel;
    function getMenuSchema() { return menuSchema; }
    exports_1("getMenuSchema", getMenuSchema);
    function getUserModel() {
        if (!menuModel) {
            menuModel = mongoose.model('Menu', getMenuSchema());
        }
        return menuModel;
    }
    exports_1("getUserModel", getUserModel);
    return {
        setters:[
            function (_mongoose) {
                mongoose = _mongoose;
            }],
        execute: function() {
            type = ["dish, beverage"];
            menuSchema = new mongoose.Schema({
                name: {
                    type: mongoose.SchemaTypes.String,
                    required: true,
                    enum: type
                },
                type: {
                    type: mongoose.SchemaTypes.String,
                    required: true,
                    enum: type
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
            // Mongoose Model
             // This is not exposed outside the model
        }
    }
});
