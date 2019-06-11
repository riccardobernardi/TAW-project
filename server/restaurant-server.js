"use strict";
exports.__esModule = true;
var result = require('dotenv').config({ path: __dirname + '/.env' }); // The dotenv module will load a file named ".env"
var ObjectID = require('mongodb').ObjectID;
var http = require("http"); // HTTP module
/*import colors = require('colors');
colors.enabled = true;*/
var mongoose = require("mongoose");
var express = require("express");
var bodyparser = require("body-parser"); // body-parser middleware is used to parse the request body and
// directly provide a Javascript object if the "Content-type" is
// application/json
const passport = require("passport"); // authentication middleware for express
const passportHTTP = require("passport-http"); // implements Basic and Digest authentication for HTTP (used for /login endpoint)
const jsonwebtoken = require("jsonwebtoken"); // JWT generation
const jwt = require("express-jwt"); // JWT parsing middleware for express
const cors = require("cors"); // Enable CORS middleware
const table = require("./models/Table");
const user = require("./models/User");
const ticket = require("./models/Ticket");
const item = require("./models/Item");
const report = require("./models/Report");
const toInsert = require("./toinsert");
const mysocket_1 = require("./mysocket");
var app = express();
// We create the JWT authentication middleware
// provided by the express-jwt library.  
// 
// How it works (from the official documentation):
// If the token is valid, req.user will be set with the JSON object 
// decoded to be used by later middleware for authorization and access control.
//
var auth = jwt({ secret: process.env.JWT_SECRET });
//variabile per il socket
var socket;
//semaforo per tickets post
var ticket_post_occupied = false;
app.use(cors());
// Install the top-level middleware "bodyparser"
app.use(bodyparser.json());
// Add API routes to express application
//
app.get("/", function (req, res) {
    res.status(200).json({
        api_version: "0.1.0",
        endpoints: ["/login", "/users", "/tables", "/items", "/tickets", "/tickets/:id/orders", "/reports"]
    }); // json method sends a JSON response (setting the correct Content-Type) to the client
});
app.route("/users").get(auth, (req, res, next) => {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: false, errormessage: "Unauthorized: user is not a desk" });
    //creo filtro per la query
    var filter = {};
    if (req.query.role)
        filter.role = req.query.role;
    //query
    user.getModel().find(filter, "username role").then(function (userslist) {
        return res.status(200).json(userslist);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //controllo formato
    if (!req.body || !req.body.username || !req.body.password || !req.body.role || typeof (req.body.username) != 'string' || typeof (req.body.password) != 'string' || typeof (req.body.role) != 'string' || !user.roles.includes(req.body.role))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    //creo utente da inserire
    var u = user.newUser(req.body);
    u.setPassword(req.body.password);
    //query
    u.save().then(function (data) {
        socket.emitEvent("modified user");
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 409, error: true, errormessage: "User already exists" });
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});

app.route("/users/:username")["delete"](auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    if (req.params.username === "admin") {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: cannot delete a desk" });
    }
    //query al DB
    user.getModel().deleteOne({ username: req.params.username }).then(function () {
        socket.emitEvent("modified user");
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).put(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    //controllo formato
    if (!req.body || !req.body.username || !req.body.password || !req.body.role || typeof (req.body.password) != 'string' || typeof (req.body.username) != 'string' || typeof (req.body.role) != 'string' || !user.roles.includes(req.body.role))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    user.getModel().findOne({ username: req.params.username }).then((data) => {
        data.username = req.body.username;
        data.setPassword(req.body.password);
        if (req.body.role == user.roles[0])
            data.setWaiter();
        else if (req.body.role == user.roles[1])
            data.setCook();
        else if (req.body.role == user.roles[2])
            data.setDesk();
        else if (req.body.role == user.roles[3])
            data.setBartender();
        return data.save();
    }).then((data) => {
        return res.status(200).json({
            username: data.username,
            role: data.role
        });
    }, (reason) => {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/tables").get(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //query al DB
    table.getModel().find({}, { number: 1, max_people: 1, _id: 0, state: 1, associated_ticket: 1 }).then(function (tableslist) {
        return res.status(200).json(tableslist);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //controllo formato
    var toInsert = {};
    toInsert.number = req.body.number;
    toInsert.max_people = req.body.max_people;
    if (!toInsert.number || typeof (toInsert.number) != "number" || !toInsert.max_people || typeof (toInsert.max_people) != "number") {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    //tavolo libero di default
    toInsert.state = table.states[0];
    //creo tavolo da aggiungere
    var Table = table.getModel();
    //query al DB
    (new Table(toInsert)).save().then(function (data) {
        //notifico sul socket
        socket.emitEvent("modified table");
        return res.status(200).json({
            number: data.number,
            max_people: data.max_people,
            state: data.state,
            associated_ticket: data.associated_ticket
        });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 409, error: true, errormessage: "Table number already taken" });
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
;
app.route("/tables/:number").get(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //query al DB
    table.getModel().find({ number: req.params.number }, { number: 1, max_people: 1, state: 1, associated_ticket: 1 }).then(function (table) {
        return res.status(200).json(table);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).patch(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //controllo formato
    if (!req.body || (req.body.max_people && isNaN(parseInt(req.body.max_people))) || (req.body.state && typeof (req.body.state) != 'string'))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    table.getModel().findOne({ number: req.params.number }).then((data) => {
        //creo oggetto per aggiornare il documento
        var update = {};
        if (req.body.max_people)
            update.max_people = req.body.max_people;
        if (req.body.associated_ticket)
            update.associated_ticket = req.body.associated_ticket;
        if (req.body.state)
            update.state = req.body.state;
        if (update.state == table.states[0]) {
            //controllo che non ci sia un associated_ticket quando si cerca di liberare un tavolo
            update.associated_ticket = null;
            data.update(update).then(function () {
                //notifico sul socket
                socket.emitEvent("modified table");
                return res.status(200).json({
                    number: data.number,
                    max_people: data.number,
                    state: data.state,
                    associated_ticket: data.associated_ticket
                });
            });
        }
        else if (update.state == table.states[1]) {
            //controllo che sia definito il ticket da associare per occupare il tavolo
            if (!update.associated_ticket)
                return next({ statusCode: 401, error: true, errormessage: "Wrong format, associated_ticket required" });
            //controllo che il tavolo sia libero
            if (data.state == table.states[1])
                return next({ statusCode: 409, error: true, errormessage: "Conflict, table already taken" });
            //modifico tavolo
            data.update(update).then(function () {
                //notifico sul socket
                socket.emitEvent("modified table");
                return res.status(200).json({
                    number: data.number,
                    max_people: data.max_people,
                    state: data.state,
                    associated_ticket: data.associated_ticket
                });
            });
        }
        else if (!update.state) {
            if (update.associated_ticket) {
                return next({ statusCode: 401, error: true, errormessage: "Wrong format, state required" });
            }
            //modifico tavolo
            data.update(update).then(function () {
                //notifico sul socket
                socket.emitEvent("modified table");
                return res.status(200).json({
                    number: data.number,
                    max_people: data.max_people,
                    state: data.state,
                    associated_ticket: data.associated_ticket
                });
            });
        }
        else {
            return next({ statusCode: 401, error: true, errormessage: "Wrong format" });
        }
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
})["delete"](auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //query al DB
    table.getModel().findOneAndDelete({ number: req.params.number }).then(function () {
        //notifico sul socket
        socket.emitEvent("modified table");
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/items").get(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //creo filtro per la query al DB
    var filter = {};
    if (req.query.type)
        filter.type = req.query.type;
    //query al DB
    item.getModel().find(filter, "name type price required_time ingredients").then(function (itemslist) {
        return res.status(200).json(itemslist);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //creo item da inserire
    var i = new (item.getModel())(req.body);
    //controllo formato
    if (!item.isItem(i))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    //inserisco
    i.save().then(function (data) {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 409, error: true, errormessage: "Item already exists" });
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/items/:id").get(auth, (req, res, next) => {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    item.getModel().findById(req.params.id).then(function (item) {
        return res.status(200).json(item);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).put(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //creo item che sostituirà quello già presente
    var i = new (item.getModel())(req.body);
    //controllo validità dell'item creato (formato campi inseriti)
    if (!item.isItem(i))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    item.getModel().findById(req.params.id).then(function (item) {
        return item.set(i).save();
    }).then(function (item) {
        return res.status(200).json(item);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
})["delete"](auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    item.getModel().findOneAndDelete({ _id: req.params.id }).then(function () {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/tickets").get(auth, (req, res, next) => {
    //creo il filtro
    var filter = {};
    if (req.query.state)
        filter.state = req.query.state;
    if (req.query.waiter)
        filter.waiter = req.query.waiter;
    if (req.query.table)
        filter.table = req.query.table;
    //controllo formato della query sullo stato degli ordini
    if (req.query.orders && !ticket.orderState.filter(function (val) { return val === req.query.orders; }))
        return next({ statusCode: 400, error: true, errormessage: "The state of orders accepted are ordered, preparation, ready, delivered and all" });
    //trovo i tickets
    ticket.getModel().find(filter).then(function (ticketslist) {
        //se specificato, filtro gli ordini utilizzando il loro stato
        if (req.query.orders && (req.query.orders != ticket.orderState[4])) {
            var orders = [];
            ticketslist.forEach(function (ticket) {
                var ticket_orders = ticket.orders.filter((function (order) { return order.state == req.query.orders; }));
                if (ticket_orders.length != 0) {
                    orders.push({
                        ticket_id: ticket.id,
                        orders: ticket_orders
                    });
                }
            });
            ticketslist = orders;
        }
        //filtro per la data (solo la data, non l'ora)
        if (req.query.start) {
            var dateFilter = new Date(req.query.start);
            ticketslist = ticketslist.filter((t) => {
                t.start = new Date(t.start);
                return t.start.getFullYear() == dateFilter.getFullYear() && t.start.getMonth() == dateFilter.getMonth() && t.start.getDate() == dateFilter.getDate();
            });
        }
        return res.status(200).json(ticketslist);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    var startdate = new Date(req.body.start);
    //controllo formato
    if (!req.body || !req.body.waiter || !req.body.table || !req.body.start || typeof (req.body.waiter) != 'string' || typeof (req.body.table) != 'number' || startdate.toString() == 'Invalid Date') {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    //controllo semaforo
    if (ticket_post_occupied)
        return next({ statusCode: 429, error: true, errormessage: "Server is executing another /tickets POST" });
    //occupo semaforo
    ticket_post_occupied = true;
    //creo ticket da inserire
    var newer = {};
    newer.waiter = req.body.waiter;
    newer.table = req.body.table;
    newer.start = startdate.toString();
    newer.people_number = req.body.people_number;
    newer.state = ticket.ticketState[0];
    ticket.getModel().findOne({ table: newer.table, state: ticket.ticketState[0] }).then((data) => {
        if (!data) {
            //libero semaforo
            ticket_post_occupied = false;
            return table.getModel().findOne({ number: newer.table });
        }
        else
            return next({ statusCode: 409, error: true, errormessage: "Ticket for this table already is open" });
    }).then(function (data) {
        if (!data) {
            //libero semaforo
            ticket_post_occupied = false;
            return next({ statusCode: 409, error: true, errormessage: "Table associated doesn't exist." });
        }
        //controllo numero posti del tavolo
        if (newer.people_number > data.max_people) {
            //libero semaforo
            ticket_post_occupied = false;
            return next({ statusCode: 409, error: true, errormessage: "Table associated hasn't enought seats" });
        }
        //controllo che il tavolo sia libero
        if (data.state == table.states[1]) {
            //libero semaforo
            ticket_post_occupied = false;
            return next({ statusCode: 409, error: true, errormessage: "Table is already taken" });
        }
        var t = new (ticket.getModel())(newer);
        return t.save();
    }, function () {
        //libero semaforo
        ticket_post_occupied = false;
        return next({ statusCode: 409, error: true, errormessage: "Table associated doesn't exist" });
    }).then(function (data) {
        //libero semaforo
        ticket_post_occupied = false;
        return res.status(200).json({ error: false, errormessage: "", _id: data._id });
    })["catch"](function (reason) {
        //libero semaforo
        ticket_post_occupied = false;
        if (reason.code === 11000)
            return next({ statusCode: 409, error: true, errormessage: "Ticket already exists" });
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route('/tickets/:id').get(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //trovo e restituisco il ticket richiesto
    ticket.getModel().findById(req.params.id).then(function (data) {
        return res.status(200).json(data);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).patch(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    var enddate = new Date(req.body.end);
    //controllo formato
    if (!req.body || (req.body.end && enddate.toString() == 'Invalid Date') || (req.body.state && typeof (req.body.state) != 'string') || (req.body.total != null && req.body.total != undefined && typeof (req.body.total) != 'number')) {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    //creo oggeto utilizzato per modificare i campi del documento
    var update = {};
    if (req.body.end)
        update.end = req.body.end;
    if (req.body.state)
        update.state = req.body.state;
    if (req.body.total != null && req.body.total != undefined)
        update.total = req.body.total;
    ticket.getModel().findOneAndUpdate({ _id: req.params.id }, { $set: update }).then((data) => {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route('/tickets/:id/orders').get(auth, function (req, res, next) {
    //trovo e restituisco gli ordini del ticket richiesto
    ticket.getModel().findById(req.params.id).then(function (data) {
        return res.status(200).json(data.orders);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazioni
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole() && !sender.hasWaiterRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //controllo formato richiesta
    if (!req.body || !req.body.name_item || !req.body.price || !req.body.required_time || /*req.body.added ||*/ typeof (req.body.name_item) != 'string' || typeof (req.body.price) != 'number' || typeof (req.body.required_time) != 'number' /*|| Array.isArray(req.body.added)*/) {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    //creo order da inserire
    var newer = {};
    newer.id_order = new ObjectID();
    newer.name_item = req.body.name_item;
    newer.price = req.body.price;
    newer.added = req.body.added;
    newer.state = ticket.orderState[0];
    newer.type_item = req.body.type_item;
    newer.required_time = req.body.required_time;
    //inserisco order nel DB
    ticket.getModel().update({ _id: req.params.id }, { $push: { orders: newer } }).then(function () {
        //controllo il tipo di order inserito e mando un evento sulla stanza relativa
        item.getModel().findOne({ name: newer.name_item }).then((i) => {
            if (i.type == item.type[0]) {
                socket.emitEvent("ordered dish");
            }
            else if (i.type == item.type[1]) {
                socket.emitEvent("ordered drink");
            }
            return res.status(200).json({ error: false, errormessage: "" });
        })["catch"](function (err) {
            return res.status(500).json({ error: true, errormessage: "DB error: " + err });
        });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route('/tickets/:idTicket/orders/:idOrder').patch(auth, function (req, res, next) {
    var sender = user.newUser(req.user);
    var order_type;
    //controllo formato richiesta
    if (!req.body || (req.body.state && typeof (req.body.state) != 'string')) {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    //trovo il ticket usando l'id specificato nella richiesta
    ticket.getModel().findById(req.params.idTicket).then(function (data) {
        //trovo l'order (interno al ticket) usando l'id specificato nella richiesta
        var toChange = data.orders.filter(function (ord) { return ord.id == req.params.idOrder; });
        if (toChange.length < 1) {
            return next({ statusCode: 404, error: true, errormessage: "Order id not found" });
        }
        //controllo che la modifica dello stato sia coerente (es: non può passare da ordinato a consegnato senza passare per gli stati intermedi)
        var nextStateIndex = ticket.orderState.findIndex(function (st) { return st == req.body.state; });
        if ((toChange[0].state != ticket.orderState[nextStateIndex - 1] &&
            !(toChange[0].state == ticket.orderState[0] && req.body.state == ticket.orderState[2] && toChange[0].type_item == item.type[1])) ||
            (toChange[0].type_item == item.type[1] && req.body.state == ticket.orderState[1])) {
            return next({ statusCode: 409, error: true, errormessage: "Conflict, orderd state change not coherent with the regular state changes flow" });
        }
        toChange[0].state = req.body.state;
        //controllo per assegnare l'executer
        if (req.body.username_executer && ((nextStateIndex == 1 && sender.hasCookRole()) || (nextStateIndex == 2 && sender.hasBartenderRole())))
            toChange[0].username_executer = req.body.username_executer;
        else if (req.body.username_executer)
            return next({ statusCode: 400, error: true, errormessage: "Username_executer not required" });
        order_type = toChange[0].type_item;
        return data.save();
    }).then((data) => {
        if (req.body.state == ticket.orderState[1]) {
            socket.emitEvent("dish in preparation");
        }
        if (req.body.state == ticket.orderState[2]) {
            var order = data.orders.filter(function (order) { return order.id == req.params.idOrder; })[0];
            if (order.type_item == item.type[0]) {
                socket.emitEvent("ready item - cooks");
            }
            else {
                socket.emitEvent("ready item - bartenders");
            }
            //controllo che tutti gli ordini dello stesso tipo e dello stesso ticket siano pronti
            var ordersList = [];
            ordersList = data.orders.filter((order) => {
                return (order.state != ticket.orderState[2] && order.type_item == order_type && order.state != ticket.orderState[3]);
            });
            if (req.body.state == ticket.orderState[2] && ordersList.length == 0) {
                socket.emitEvent("ready item - waiters");
            }
        }
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
})["delete"](auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasWaiterRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a waiter" });
    }
    //trovo il ticket usando l'id specificato nella richiesta
    ticket.getModel().findById(req.params.idTicket).then(function (data) {
        //trovo l'order (interno al ticket) usando l'id specificato nella richiesta
        var indexToDel = -1;
        for (var i in data.orders) {
            if (data.orders[i].id == req.params.idOrder)
                indexToDel = parseInt(i);
        }
        if (indexToDel < 0) {
            return next({ statusCode: 404, error: true, errormessage: "Order id not found" });
        }
        data.orders.splice(indexToDel, 1);
        return data.save();
    }).then(function () {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/reports").get(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: false, errormessage: "Unauthorized: user is not a desk" });
    //creo filtro per la query
    var filter = {};
    if (req.query.start || req.query.end) {
        filter.date = {};
        if (req.query.start) {
            filter.date["$gte"] = new Date(req.query.start);
            filter.date["$gte"].setHours(0, 0, 0, 0);
        }
        if (req.query.end) {
            filter.date["$lte"] = new Date(req.query.end);
            filter.date["$lte"].setHours(0, 0, 0, 0);
            filter.date["$lte"].setDate(filter.date["$lte"].getDate() + 1);
            //ALTRIMENTI NON FUNZIA
        }
    }
    //query
    report.getModel().find(filter).then(function (reportslist) {
        return res.status(200).json(reportslist);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).post(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    //creo report da inserire
    var r = new (report.getModel())(req.body);
    //controllo formato
    if (!report.isReport(r))
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    r.date.setHours(0, 0, 0, 0); //in order to reset hour, minutes and seconds for searches
    //inserisco
    r.save().then(function (data) {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    })["catch"](function (reason) {
        if (reason.code === 11000)
            return next({ statusCode: 409, error: true, errormessage: "Report already exists" });
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.route("/reports/:id").get(auth, function (req, res, next) {
    //autenticazione
    var sender = user.newUser(req.user);
    if (!sender.hasDeskRole())
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter" });
    //trovo e restituisco il ticket richiesto
    report.getModel().findById(req.params.id).then(function (data) {
        return res.status(200).json(data);
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
})["delete"](auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    report.getModel().findOneAndDelete({ _id: req.params.id }).then(function () {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
}).patch(auth, function (req, res, next) {
    //autenticazione
    if (!user.newUser(req.user).hasDeskRole()) {
        return next({ statusCode: 401, error: true, errormessage: "Unauthorized: user is not a desk" });
    }
    //controllo formato
    if (!req.body || (req.body.data && req.body.data.toString() == 'Invalid Date') || (req.body.total && typeof (req.body.total) != 'number') || (req.body.total_orders && (typeof (req.body.total_orders[item.type[0]]) != 'number' || typeof (req.body.total_orders[item.type[1]]) != 'number')) || (req.body.total_customers && typeof (req.body.total_customers) != 'number') || (req.body.average_stay && typeof (req.body.average_stay) != 'number') || ((req.body.users_reports) && report.isUsersReports(req.body.users_reports))) {
        return next({ statusCode: 400, error: true, errormessage: "Wrong format" });
    }
    var update = {};
    if (req.body.date)
        update.date = new Date(req.body.end);
    if (req.body.total)
        update.total = req.body.total;
    if (req.body.total_orders)
        update.total_orders = req.body.total_orders;
    if (req.body.total_customers)
        update.total_customers = req.body.total_customers;
    if (req.body.average_stay)
        update.average_stay = req.body.average_stay;
    if (req.body.users_reports)
        update.users_reports = req.body.users_reports;
    report.getModel().findOneAndUpdate({ _id: req.params.id }, { $set: update }).then(function (data) {
        return res.status(200).json({ error: false, errormessage: "" });
    })["catch"](function (reason) {
        return next({ statusCode: 500, error: true, errormessage: "DB error: " + reason });
    });
});
app.get('/renew', auth, function (req, res, next) {
    var tokendata = req.user;
    delete tokendata.iat;
    delete tokendata.exp;
    //nuovo token
    console.log("Renewing token for user " + JSON.stringify(tokendata));
    var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '4h' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
// Configure HTTP basic authentication strategy 
// trough passport middleware.
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
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
    //genero il token
    var tokendata = {
        username: req.user.username,
        role: req.user.role
    };
    console.log("Login granted. Generating token");
    var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '4h' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
// Add error handling middleware
app.use(function (err, req, res, next) {
    //console.log("SONO QUI");
    console.log("Request error: " /*.red*/ + JSON.stringify(err));
    res.status(err.statusCode || err.status || 500).json(err);
});
app.use(function (req, res, next) {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
mongoose.connect('mongodb+srv://lollocazzaro:prova@cluster0-9fnor.mongodb.net/restaurant-server?retryWrites=true&w=majority').then(function onconnected() {
    console.log("Connected to MongoDB");
    //inizializzazione DB
    user.getModel().deleteMany({}).then(function (data) {
        console.log("Database users pulito: " + data);
        var u = user.newUser({
            username: "admin"
        });
        u.setDesk();
        u.setPassword("admin");
        return u.save();
    }).then(function () {
        console.log("Admin user created");
        return user.getModel().count({});
    }).then((count) => {
        if (count != 0) {
            console.log("Adding some test data into the database");
            var usersToSave = [];
            toInsert.usersToInsert.forEach(function (userti) {
                var userti1 = user.newUser({
                    username: userti.username
                });
                switch (userti.role) {
                    case "waiter":
                        userti1.setWaiter();
                        break;
                    case "bartender":
                        userti1.setBartender();
                        break;
                    case "cook":
                        userti1.setCook();
                        break;
                }
                userti1.setPassword(userti.password);
                usersToSave.push(userti1.save());
            });
            Promise.all(usersToSave)
                .then(function () {
                console.log("Users saved");
            })["catch"](function (reason) {
                console.log("Unable to save: " + reason);
            });
        }
    })["catch"](function (err) {
        console.log("Errore " + err);
    });
    //inserisco tutti i tavoli
    var tableToSave = [];
    table.getModel().deleteMany({}).then(function (data) {
        console.log("Database tables pulito: " + data);
        var tableModel = table.getModel();
        for (var i in toInsert.tablesToInsert) {
            tableToSave.push((new tableModel(toInsert.tablesToInsert[i])).save());
        }
        Promise.all(tableToSave).then(function () {
            console.log("table saved");
        })["catch"](function (reason) {
            console.log("Unable to save table: " + reason);
        });
    });
    //inserisco tutti gli item
    var itemToSave = [];
    item.getModel().deleteMany({}).then(function (data) {
        var itemModel = item.getModel();
        for (var i in toInsert.itemsToInsert) {
            itemToSave.push((new itemModel(toInsert.itemsToInsert[i])).save());
        }
        Promise.all(itemToSave).then(function () {
            console.log("Items saved");
        })["catch"](function (reason) {
            console.log("Unable to save items: " + reason);
        });
    });
    ticket.getModel().deleteMany({}).then(function (data) {
        var ticketModel = ticket.getModel();
        var ticketToSave = [];
        toInsert.ticketToInsert.forEach(function (ticket) {
            ticketToSave.push(new ticketModel(ticket).save());
        });
        ticketToSave.forEach(function (promise) {
            promise.then(function (ticket) {
                return table.getModel().findOneAndUpdate({ number: ticket.table }, { $set: { state: table.states[1], associated_ticket: ticket._id } });
            }, function (err) {
                console.log(err + "in saving tables!");
            }).then()["catch"](function (err) { return console.log("Error in update table: " + err); });
        });
    });
    report.getModel().deleteMany({}).then(function () {
        var reportModel = report.getModel();
        var reportToSave = [];
        toInsert.reportToInsert.forEach(function (report) {
            reportToSave.push((new reportModel(report)).save());
        });
        Promise.all(reportToSave).then()["catch"](function (err) { return console.log("Save of report not completed: " + err); });
    });
    var server = http.createServer(app);
    socket = new mysocket_1.MySocket(server);
    // server.listen( 8080, () => console.log("HTTP Server started on port 8080") );
    server.listen(process.env.PORT || 8080, () => console.log("HTTP Server started on port " + process.env.PORT || 8080));
}, function onrejected() {
    console.log("Unable to connect to MongoDB");
    process.exit(-2);
});
