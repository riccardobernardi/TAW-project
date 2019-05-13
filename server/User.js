"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var crypto = require("crypto");
<<<<<<< HEAD
var roles = ["WAITER, COOK, DESK, BARTENDER"];
=======
var roles = ["WAITER", "COOK", "DESK", "BARTENDER"];
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
var userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
<<<<<<< HEAD
    /*mail: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },*/
    roles: {
        type: [mongoose.SchemaTypes.String],
        required: true
=======
    /*roles:  {
        type: [mongoose.SchemaTypes.String],
        required: true,
        enum: roles
    },*/
    role: {
        type: mongoose.SchemaTypes.String,
        required: true,
        "enum": roles
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 5ff4508ba0142111b514e5e9ac488600b5959cd7
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
