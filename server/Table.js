System.register(['mongoose'], function(exports_1) {
    var mongoose;
    var tableSchema, tableModel;
    function getSchema() { return tableSchema; }
    exports_1("getSchema", getSchema);
    function getModel() {
        if (!tableModel) {
            tableModel = mongoose.model('Table', getSchema());
        }
        return tableModel;
    }
    exports_1("getModel", getModel);
    return {
        setters:[
            function (_mongoose) {
                mongoose = _mongoose;
            }],
        execute: function() {
            tableSchema = new mongoose.Schema({
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
                }
            });
            // Mongoose Model
             // This is not exposed outside the model
        }
    }
});
