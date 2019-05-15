"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const crypto = require("crypto");
var roles = ["WAITER", "COOK", "DESK", "BARTENDER"];
var userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    /*roles:  {
        type: [mongoose.SchemaTypes.String],
        required: true,
        enum: roles
    },*/
    role: {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: roles
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
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'DESK' )
            return true;
    }
    return false;*/
    return this.role === 'DESK';
};
userSchema.methods.setDesk = function () {
    this.role = "DESK";
};
userSchema.methods.hasWaiterRole = function () {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'WAITER' )
            return true;
    }
    return false;*/
    return this.role === 'WAITER';
};
userSchema.methods.setWaiter = function () {
    this.role = "WAITER";
};
userSchema.methods.hasCookRole = function () {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'COOK' )
            return true;
    }
    return false;*/
    return this.role === 'COOK';
};
userSchema.methods.setCook = function () {
    this.role = "COOK";
};
userSchema.methods.hasBartenderRole = function () {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'BARTENDER' )
            return true;
    }
    return false;*/
    return this.role === 'BARTENDER';
};
userSchema.methods.setBartender = function () {
    this.role = "BARTENDER";
};
function getSchema() { return userSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var userModel; // This is not exposed outside the model
function getModel() {
    if (!userModel) {
        userModel = mongoose.model('User', getSchema());
    }
    return userModel;
}
exports.getModel = getModel;
function newUser(data) {
    var _usermodel = getModel();
    var user = new _usermodel(data);
    return user;
}
exports.newUser = newUser;
//# sourceMappingURL=User.js.map