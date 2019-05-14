"use strict";
exports.__esModule = true;
var result = require('dotenv').config({ path: __dirname + '/.env' }); // The dotenv module will load a file named ".env"
var http = require("http"); // HTTP module
/*import colors = require('colors');
colors.enabled = true;*/
var mongoose = require("mongoose");
var express = require("express");
var bodyparser = require("body-parser"); // body-parser middleware is used to parse the request body and
// directly provide a Javascript object if the "Content-type" is
// application/json
var passport = require("passport"); // authentication middleware for express
var passportHTTP = require("passport-http"); // implements Basic and Digest authentication for HTTP (used for /login endpoint)
var jsonwebtoken = require("jsonwebtoken"); // JWT generation
var jwt = require("express-jwt"); // JWT parsing middleware for express
var cors = require("cors"); // Enable CORS middleware
var table = require("./Table");
var user = require("./User");
var item = require("./Item");
var ios = undefined;
var app = express();
// We create the JWT authentication middleware
// provided by the express-jwt library.  
// 
// How it works (from the official documentation):
// If the token is valid, req.user will be set with the JSON object 
// decoded to be used by later middleware for authorization and access control.
//
var auth = jwt({ secret: process.env.JWT_SECRET });
app.use(cors());
// Install the top-level middleware "bodyparser"
app.use(bodyparser.json());
// Add API routes to express application
//
app.get("/", function (req, res) {
    res.status(200).json({
        api_version: "0.1.0",
        endpoints: ["/login", "/users", "/tables", "/item", "/orders", "/orders/:id/command", "/report"]
    }); // json method sends a JSON response (setting the correct Content-Type) to the client
});
app.route("/users").get(auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    //aggiungere filtri skip e limit come nell'esempio per supportare la paginazione?
    var filter = {};
    if (req.query.role)
        filter = { role: req.query.role };
    user.getModel().find(filter, "username roles").then(function (userslist) {
        return res.status(200).json(userslist);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    var u = user.newUser(req.body);
    if (!req.body.password) {
        return next({ statusCode: 404, error: true, errormessage: "Password field missing" });
    }
    u.setPassword(req.body.password);
    u.save().then(function (data) {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "User already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg });
    });
});
//cambiare username con id restituito da mongo e maagari aggiungere filtri su username in get users?
app["delete"]("/users/:username", auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    user.getModel().deleteOne({ username: req.params.username }).then(function () {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/tables").get(auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    table.getModel().find({}, { number: 1, max_people: 1, _id: 0 }).then(function (tableslist) {
        return res.status(200).json(tableslist);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    var Table = table.getModel();
    (new Table(req.body)).save().then(function (data) {
        return res.status(200).json({
            number: data.number,
            max_people: data.number
        });
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
});
;
app.get("/tables/:number", auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    table.getModel().find({ number: req.params.number }, { number: 1, max_people: 1 }).then(function (table) {
        return res.status(200).json(table);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/items").get(auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    var filter = {};
    if (req.query.type)
        filter = { type: req.query.type };
    item.getModel().find(filter).then(function (itemslist) {
        return res.status(200).json(itemslist);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    var i = new (item.getModel())(req.body);
    if (!item.isItem(i)) {
        return next({ statusCode: 404, error: true, errormessage: "Wrong format" });
    }
    i.save().then(function (data) {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "Item already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg });
    });
});
app.route("/items/:id").get(auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    item.getModel().findById(req.params.id).then(function (item) {
        return res.status(200).json(item);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
}).put(auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    var i = new (item.getModel())(req.body);
    if (!item.isItem(i)) {
        return next({ statusCode: 404, error: true, errormessage: "Wrong format" });
    }
    item.getModel().findById(req.params.id).then(function (item) {
        return item.set(i);
    }).then(function (item) {
        return res.status(200).json(item);
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
})["delete"](auth, function (req, res, next) {
    if (!user.newUser(req.user).hasDeskRole()) {
        return next({ statusCode: 404, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    item.getModel().findOneAndDelete(req.params.username).then(function () {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
});
app.get('/renew', auth, function (req, res, next) {
    var tokendata = req.user;
    delete tokendata.iat;
    delete tokendata.exp;
    console.log("Renewing token for user " + JSON.stringify(tokendata));
    var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '30s' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
// Configure HTTP basic authentication strategy 
// trough passport middleware.
// NOTE: Always use HTTPS with Basic Authentication
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
    //console.log("SONO QUI");
    // Delegate function we provide to passport middleware
    // to verify user credentials 
    console.log("New login attempt from " /*.green*/ + username);
    user.getModel().findOne({ username: username }, function (err, user) {
        if (err) {
            return done({ statusCode: 500, error: true, errormessage: err });
        }
        if (!user) {
            return done({ statusCode: 500, error: true, errormessage: "Invalid user" });
        }
        if (user.validatePassword(password)) {
            return done(null, user);
        }
        return done({ statusCode: 500, error: true, errormessage: "Invalid password" });
    });
}));
// Login endpoint uses passport middleware to check
// user credentials before generating a new JWT
app.get("/login", passport.authenticate('basic', { session: false }), function (req, res, next) {
    //console.log("SONO QUIIII");
    // If we reach this point, the user is successfully authenticated and
    // has been injected into req.user
    // We now generate a JWT with the useful user data
    // and return it as response
    var tokendata = {
        username: req.user.username,
        role: req.user.role
    };
    console.log("Login granted. Generating token");
    var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Note: You can manually check the JWT content at https://jwt.io
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
// Add error handling middleware
app.use(function (err, req, res, next) {
    //console.log("SONO QUI");
    console.log("Request error: " /*.red*/ + JSON.stringify(err));
    res.status(err.statusCode || 500).json(err);
});
app.use(function (req, res, next) {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
mongoose.connect('mongodb://localhost:27017/restaurant').then(function onconnected() {
    console.log("Connected to MongoDB");
    user.getModel().deleteMany({}).then(function (data) {
        console.log("Database users pulito: " + data);
    })["catch"](function (err) {
        console.log("Errore nella pulizia del dataset utenti: " + err);
    });
    var u = user.newUser({
        username: "admin"
    });
    u.setDesk();
    u.setPassword("admin");
    u.save().then(function () {
        console.log("Admin user created");
        user.getModel().count({}).then(function (count) {
            console.log(count);
            if (count != 0) {
                console.log("Adding some test data into the database");
                var user1 = user.newUser({
                    username: "waiter1"
                });
                user1.setWaiter();
                user1.setPassword("waiter1");
                var pr1 = user1.save();
                var user2 = user.newUser({
                    username: "cook1"
                });
                user2.setCook();
                user2.setPassword("cook1");
                var pr2 = user2.save();
                var user3 = user.newUser({
                    username: "bartender1"
                });
                user3.setBartender();
                user3.setPassword("bartender1");
                var pr3 = user3.save();
                Promise.all([pr1, pr2, pr3])
                    .then(function () {
                    console.log("Users saved");
                })["catch"](function (reason) {
                    console.log("Unable to save: " + reason);
                });
            }
        });
    })["catch"](function (err) {
        console.log("Unable to create desk user: " + err);
    });
    table.getModel().deleteMany({}).then(function (data) {
        console.log("Database tables pulito: " + data);
    })["catch"](function (err) {
        console.log("Errore nella pulizia del dataset tables: " + err);
    });
    var tableModel = table.getModel();
    var t1 = (new tableModel({ number: 1, max_people: 4 })).save();
    var t2 = (new tableModel({ number: 2, max_people: 4 })).save();
    var t3 = (new tableModel({ number: 3, max_people: 6 })).save();
    Promise.all([t1, t2, t3]).then(function () {
        console.log("Table saved");
    })["catch"](function (reason) {
        console.log("Unable to save tables: " + reason);
    });
    // To start a standard HTTP server we directly invoke the "listen"
    // method of express application
    var server = http.createServer(app);
    /*ios = io(server);
    ios.on('connection', function (client) {
       console.log("Socket.io client connected".green);
    });*/
    server.listen(8080, function () { return console.log("HTTP Server started on port 8080"); });
    // To start an HTTPS server we create an https.Server instance 
    // passing the express application middleware. Then, we start listening
    // on port 8443
    //
    /*
    https.createServer({
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(8443);
    */
}, function onrejected() {
    console.log("Unable to connect to MongoDB");
    process.exit(-2);
});
/*app.route("/messages").get( auth, (req,res,next) => {

var filter = {};
if( req.query.tags ) {
filter = { tags: {$all: req.query.tags } };
}
console.log("Using filter: " + JSON.stringify(filter) );
console.log(" Using query: " + JSON.stringify(req.query) );

req.query.skip = parseInt( req.query.skip || "0" ) || 0;
req.query.limit = parseInt( req.query.limit || "20" ) || 20;

message.getModel().find( filter ).sort({timestamp:-1}).skip( req.query.skip ).limit( req.query.limit ).then( (documents) => {
return res.status(200).json( documents );
}).catch( (reason) => {
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
})

}).post( auth, (req,res,next) => {

console.log("Received: " + JSON.stringify(req.body) );

var recvmessage = req.body;
recvmessage.timestamp = new Date();
recvmessage.authormail = req.user.mail;

if( message.isMessage( recvmessage ) ) {

message.getModel().create( recvmessage ).then( ( data ) => {
// Notify all socket.io clients
ios.emit('broadcast', data );

return res.status(200).json({ error: false, errormessage: "", id: data._id });
}).catch((reason) => {
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
} )

} else {
return next({ statusCode:404, error: true, errormessage: "Data is not a valid Message" });
}

});

app.delete( '/messages/:id', auth, (req,res,next) => {

// Check moderator role
if( !user.newUser(req.user).hasModeratorRole() ) {
return next({ statusCode:404, error: true, errormessage: "Unauthorized: user is not a moderator"} );
}

// req.params.id contains the :id URL component

message.getModel().deleteOne( {_id: req.params.id } ).then( ()=> {
return res.status(200).json( {error:false, errormessage:""} );
}).catch( (reason)=> {
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
})

});


app.get('/users', auth, (req,res,next) => {

user.getModel().find( {}, {digest:0, salt:0} ).then( (users) => {
return res.status(200).json( users );
}).catch( (reason) => {
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
})

});

app.post('/users', (req,res,next) => {

var u = user.newUser( req.body );
if( !req.body.password ) {
return next({ statusCode:404, error: true, errormessage: "Password field missing"} );
}
u.setPassword( req.body.password );

u.save().then( (data) => {
return res.status(200).json({ error: false, errormessage: "", id: data._id });
}).catch( (reason) => {
if( reason.code === 11000 )
return next({statusCode:404, error:true, errormessage: "User already exists"} );
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason.errmsg });
})

});

app.get('/users/:mail', auth, (req,res,next) => {

// req.params.mail contains the :mail URL component
user.getModel().findOne( {mail: req.params.mail }, {digest: 0, salt:0 }).then( (user)=> {
return res.status(200).json( user );
}).catch( (reason) => {
return next({ statusCode:404, error: true, errormessage: "DB error: "+reason });
})

});

app.get('/renew', auth, (req,res,next) => {
var tokendata = req.user;
delete tokendata.iat;
delete tokendata.exp;
console.log("Renewing token for user " + JSON.stringify( tokendata ));
var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );
return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});



// Configure HTTP basic authentication strategy
// trough passport middleware.
// NOTE: Always use HTTPS with Basic Authentication

passport.use( new passportHTTP.BasicStrategy(
function(username, password, done) {

// Delegate function we provide to passport middleware
// to verify user credentials

console.log("New login attempt from ".green + username );
user.getModel().findOne( {mail: username} , (err, user)=>{
if( err ) {
return done({statusCode: 500, error: true, errormessage:err});
}
if( !user ) {
return done({statusCode: 500, error: true, errormessage:"Invalid user"});
}
if( user.validatePassword( password ) ) {
return done(null, user);
}
return done({statusCode: 500, error: true, errormessage:"Invalid password"});
})
}
));


// Login endpoint uses passport middleware to check
// user credentials before generating a new JWT
app.get("/login", passport.authenticate('basic', { session: false }), (req,res,next) => {

// If we reach this point, the user is successfully authenticated and
// has been injected into req.user

// We now generate a JWT with the useful user data
// and return it as response

var tokendata = {
username: req.user.username,
roles: req.user.roles,
mail: req.user.mail,
id: req.user.id
};

console.log("Login granted. Generating token" );
var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );

// Note: You can manually check the JWT content at https://jwt.io

return res.status(200).json({ error: false, errormessage: "", token: token_signed });

});



// Add error handling middleware
app.use( function(err,req,res,next) {

console.log("Request error: ".red + JSON.stringify(err) );
res.status( err.statusCode || 500 ).json( err );

});


// The very last middleware will report an error 404
// (will be eventually reached if no error occurred and if
//  the requested endpoint is not matched by any route)
//
app.use( (req,res,next) => {
res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
})



// Connect to mongodb and launch the HTTP server trough Express
//
mongoose.connect( 'mongodb://localhost:27017/postmessages' ).then(
function onconnected() {

console.log("Connected to MongoDB");

var u = user.newUser( {
username: "admin",
mail: "admin@postmessages.it"
} );
u.setAdmin();
u.setModerator();
u.setPassword("admin");
u.save().then( ()=> {
console.log("Admin user created");

message.getModel().count({}).then(
( count ) => {
if( count == 0 ) {
console.log("Adding some test data into the database");
var m1 = message
.getModel()
.create({
tags: ["Tag1", "Tag2", "Tag3"],
content: "Post 1",
timestamp: new Date(),
authormail: u.mail
});
var m2 = message
.getModel()
.create({
tags: ["Tag1", "Tag5"],
content: "Post 2",
timestamp: new Date(),
authormail: u.mail
});
var m3 = message
.getModel()
.create({
tags: ["Tag6", "Tag10"],
content: "Post 3",
timestamp: new Date(),
authormail: u.mail
});

Promise.all([m1, m2, m3])
.then(function() {
console.log("Messages saved");
})
.catch(function(reason) {
console.log("Unable to save: " + reason);
});

}
})
}).catch( (err)=> {
console.log("Unable to create admin user: " + err );
});


// To start a standard HTTP server we directly invoke the "listen"
// method of express application
let server = http.createServer(app);
ios = io(server);
ios.on('connection', function(client) {
console.log( "Socket.io client connected".green );
});
server.listen( 8080, () => console.log("HTTP Server started on port 8080") );

// To start an HTTPS server we create an https.Server instance
// passing the express application middleware. Then, we start listening
// on port 8443
//
/*
https.createServer({
key: fs.readFileSync('keys/key.pem'),
cert: fs.readFileSync('keys/cert.pem')
}, app).listen(8443);
*/
/*},
function onrejected() {
console.log("Unable to connect to MongoDB");
process.exit(-2);
}
)*/
