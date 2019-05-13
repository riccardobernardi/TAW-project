import mongoose = require('mongoose');
import crypto = require('crypto');

var roles = ["WAITER, COOK, DESK, BARTENDER"];

export interface User extends mongoose.Document {
    //readonly _id: mongoose.Schema.Types.ObjectId,
    username: string,
    //roles: string[],
    role: string,
    salt: string,
    digest: string,
    setPassword: (pwd:string)=>void,
    validatePassword: (pwd:string)=>boolean,
    hasDeskRole: () => boolean,
    setDesk: ()=>void,
    hasWaiterRole: ()=>boolean,
    setWaiter: () => void,
    hasCookRole: () => boolean,
    setCook: () => void,
    hasBartenderRole: () => boolean,
    setBartender: () => void,
}

var userSchema = new mongoose.Schema( {
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
    roles:  {
        type: mongoose.SchemaTypes.String,
        required: true,
        enum: roles
    },
    salt:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    },
    digest:  {
        type: mongoose.SchemaTypes.String,
        required: false 
    }
})

// Here we add some methods to the user Schema

userSchema.methods.setPassword = function( pwd:string ) {

    this.salt = crypto.randomBytes(16).toString('hex'); 

    var hmac = crypto.createHmac('sha512', this.salt );
    hmac.update( pwd );
    this.digest = hmac.digest('hex'); 
}

userSchema.methods.validatePassword = function( pwd:string ):boolean {

    var hmac = crypto.createHmac('sha512', this.salt );

    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
}

userSchema.methods.hasDeskRole = function(): boolean {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'DESK' )
            return true;
    }
    return false;*/
    return this.role === 'DESK';
}

userSchema.methods.setDesk = function() {
    this.role = "DESK";
}

userSchema.methods.hasWaiterRole = function(): boolean {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'WAITER' )
            return true;
    }
    return false;*/
    return this.role === 'WAITER';

}

userSchema.methods.setWaiter = function() {
    this.role = "WAITER";
}

userSchema.methods.hasCookRole = function(): boolean {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'COOK' )
            return true;
    }
    return false;*/
    return this.role === 'COOK';

}

userSchema.methods.setCook = function() {
    this.roles.push( "COOK" );
}

userSchema.methods.hasBartenderRole = function(): boolean {
    /*for( var roleidx in this.roles ) {
        if( this.roles[roleidx] === 'BARTENDER' )
            return true;
    }
    return false;*/
    return this.role === 'BARTENDER';

}

userSchema.methods.setBartender = function() {
    this.role = "BARTENDER";
}

export function getSchema() { return userSchema; }

// Mongoose Model
var userModel;  // This is not exposed outside the model
export function getModel() : mongoose.Model< User >  { // Return Model as singleton
    if( !userModel ) {
        userModel = mongoose.model('User', getSchema() )
    }
    return userModel;
}

export function newUser( data ): User {
    var _usermodel = getModel();
    var user = new _usermodel( data );

    return user;
}