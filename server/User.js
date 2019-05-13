System.register(['mongoose', 'crypto'], function(exports_1) {
    var mongoose, crypto;
    var roles, userSchema, userModel;
    function getSchema() { return userSchema; }
    exports_1("getSchema", getSchema);
    function getModel() {
        if (!userModel) {
            userModel = mongoose.model('User', getSchema());
        }
        return userModel;
    }
    exports_1("getModel", getModel);
    function newUser(data) {
        var _usermodel = getModel();
        var user = new _usermodel(data);
        return user;
    }
    exports_1("newUser", newUser);
    return {
        setters:[
            function (_mongoose) {
                mongoose = _mongoose;
            },
            function (_crypto) {
                crypto = _crypto;
            }],
        execute: function() {
            roles = ["WAITER, COOK, DESK, BARTENDER"];
            userSchema = new mongoose.Schema({
                username: {
                    type: mongoose.SchemaTypes.String,
                    required: true,
                    unique: true
                },
                /*mail: {
                    type: mongoose.SchemaTypes.String,
                    required: true,
                    unique: true
                },*/
                roles: {
                    type: [mongoose.SchemaTypes.String],
                    required: true
                },
                salt: {
                    type: mongoose.SchemaTypes.String,
                    required: false
                },
                digest: {
                    type: mongoose.SchemaTypes.String,
                    required: false
                }
            });
            // Here we add some methods to the user Schema
            userSchema.methods.setPassword = function (pwd) {
                this.salt = crypto.randomBytes(16).toString('hex');
                var hmac = crypto.createHmac('sha512', this.salt);
                hmac.update(pwd);
                this.digest = hmac.digest('hex');
            };
            userSchema.methods.validatePassword = function (pwd) {
                var hmac = crypto.createHmac('sha512', this.salt);
                hmac.update(pwd);
                var digest = hmac.digest('hex');
                return (this.digest === digest);
            };
            userSchema.methods.hasDeskRole = function () {
                for (var roleidx in this.roles) {
                    if (this.roles[roleidx] === 'DESK')
                        return true;
                }
                return false;
            };
            userSchema.methods.setDesk = function () {
                this.roles.push("DESK");
            };
            userSchema.methods.hasWaiterRole = function () {
                for (var roleidx in this.roles) {
                    if (this.roles[roleidx] === 'WAITER')
                        return true;
                }
                return false;
            };
            userSchema.methods.setWaiter = function () {
                this.roles.push("WAITER");
            };
            userSchema.methods.hasCookRole = function () {
                for (var roleidx in this.roles) {
                    if (this.roles[roleidx] === 'COOK')
                        return true;
                }
                return false;
            };
            userSchema.methods.setCook = function () {
                this.roles.push("COOK");
            };
            userSchema.methods.hasBartenderRole = function () {
                for (var roleidx in this.roles) {
                    if (this.roles[roleidx] === 'BARTENDER')
                        return true;
                }
                return false;
            };
            userSchema.methods.setBartender = function () {
                this.roles.push("BARTENDER");
            };
            // Mongoose Model
             // This is not exposed outside the model
        }
    }
});
