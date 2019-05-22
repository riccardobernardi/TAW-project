const result = require('dotenv').config({path: __dirname + '/.env'})     // The dotenv module will load a file named ".env"
var ObjectID = require('mongodb').ObjectID;
import fs = require('fs');
import http = require('http');                // HTTP module
import https = require('https');              // HTTPS module
/*import colors = require('colors');
colors.enabled = true;*/
import mongoose = require('mongoose');
import express = require('express');
import bodyparser = require('body-parser');     // body-parser middleware is used to parse the request body and
                                                // directly provide a Javascript object if the "Content-type" is
                                                // application/json
import passport = require('passport');           // authentication middleware for express
import passportHTTP = require('passport-http');  // implements Basic and Digest authentication for HTTP (used for /login endpoint)
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
import jwt = require('express-jwt');            // JWT parsing middleware for express
import cors = require('cors');                  // Enable CORS middleware
import io = require('socket.io');               // Socket.io websocket library
import * as table from './Table';
import * as user from './User';
import * as ticket from './Ticket';
import * as item from './Item';
import { verify } from 'crypto';


var rooms = ["waiters", "cookers", "desks", "bartenders"];

var ios = undefined;

var app = express();

// We create the JWT authentication middleware
// provided by the express-jwt library.  
// 
// How it works (from the official documentation):
// If the token is valid, req.user will be set with the JSON object 
// decoded to be used by later middleware for authorization and access control.
//
var auth = jwt( {secret: process.env.JWT_SECRET} );

var ios = undefined;

function emitEvent(eventType, data){
   socketEvents[eventType].destRooms.forEach(r => {
      ios.emit(eventType, data).on(r);
   });
};

var socketEvents = {
   "modified table": {
      destRooms: [rooms[0], rooms[2]],
      //senderRole: user.roles[0]
   },
   
   "ordered dish": {
      destRooms: [rooms[1]],
      //senderRole: user.roles[0]
   },
   "ordered drink":{
      destRooms: [rooms[3]],
      //senderRole: user.roles[0]
   },
   "dish in preparation": {
      destRooms: [rooms[1]],
      //senderRole: user.roles[1]
   },
   "ready item": {
      destRooms: [rooms[0]],
      //senderRole: user.roles[1]
   }
};



app.use( cors() );

// Install the top-level middleware "bodyparser"
app.use( bodyparser.json() );

// Add API routes to express application
//
app.get("/", (req,res) => {

res.status(200).json( { 
   api_version: "0.1.0", 
   endpoints: [ "/login", "/users", "/tables", "/items", "/tickets", "/tickets/:id/command", "/reports" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
});

/*
- per l'approccio che utilizziamo, websocket del server invia solo (alle chiamate alle API) e websocket del client ascolta gli eventi e poi reinterroga il server (quindi non serve l'autenticazione, perchè se non è autenticato non può interrogare l'api)

- endpoint /tickets?filter=orders per inviare gli ordini relativi ai tickets (magari con un ulteriore parametro filterOrders)
*/

//TODO controlli sui tutti i campi d'ingresso(es query)

/*app.route("mock").get((req,res,next) => {
   console.log("trigger");
   ios.emit("paydesks");
})*/

app.route("/users").get(auth, (req,res,next) => {
   console.log(JSON.stringify(req.headers));
   console.log(typeof(req.body.date));
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   //aggiungere filtri skip e limit come nell'esempio per supportare la paginazione?
   var filter: any = {}
   if(req.query.role)
      filter.role = req.query.role;

   user.getModel().find(filter, "username role").then( (userslist) => {
      return res.status(200).json( userslist ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   })
}).post(auth, (req, res, next) => {

   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   var u = user.newUser( req.body );

   //TODO controlli isUser
   if( !req.body.password ) {
   return next({ statusCode:400, error: true, errormessage: "Password field missing"} );
   }
   u.setPassword( req.body.password );

   u.save().then( (data) => {
      return res.status(200).json({ error: false, errormessage: "", id: data._id });
   }).catch( (reason) => {
   if( reason.code === 11000 )
      return next({statusCode:409, error:true, errormessage: "User already exists"} );
   return next({ statusCode:500, error: true, errormessage: "DB error: "+reason.errmsg });
   })
});

//cambiare username con id restituito da mongo e maagari aggiungere filtri su username in get users?
app.route("/users/:username").delete(auth, (req, res, next) => {
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   user.getModel().deleteOne( {username: req.params.username } ).then( ()=> {
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });
}).put(auth, (req, res, next) => {
   if(!user.newUser(req.user).hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   }

   var u = user.newUser( req.body );
   
   //TODO controlli isUser
   
   //errore strano con findOneAndReplace, poi vedere, altrimenti tenere findOneAndUpdate
   //occhio al setting dei campi, si può fare diversamente?
   user.getModel().findOneAndUpdate({username: req.params.username}, {$set : {username : req.body.username, password:req.body.password, role: req.body.role}}).then( (data : user.User)=> {
      return res.status(200).json( data );
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });

});

app.route("/tables").get(auth, (req, res, next) => {

   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );


   ios.emit("paydesks");
   table.getModel().find({}, {number:1, max_people:1, _id: 0}).then( (tableslist) => {
      return res.status(200).json( tableslist ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   });
}).post(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   var Table = table.getModel();
   (new Table(req.body)).save().then( (data : table.Table) => {
      return res.status(200).json( {
         number: data.number,
         max_people: data.number
      }); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});;

app.route("/tables/:number").get(auth, (req, res, next) => {

   var sender = user.newUser(req.user);
   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   table.getModel().find({number: req.params.number}, {number: 1, max_people: 1}).then( (table) => {
      return res.status(200).json( table ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   });
}).patch(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );
   }

   /*if ( !req.body || (req.body.number && typeof(req.body.number) != 'number') || (req.body.max_people && typeof(req.body.max_people) != 'number') || (req.body.state && typeof(req.body.state) != 'string')){
      return next({ statusCode:404, error: true, errormessage: "Wrong format"} );
   }*/

   if ( !req.body ||(req.body.max_people && isNaN(parseInt(req.body.max_people))) || (req.body.state && typeof(req.body.state) != 'string')){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   var update: any = {};

   if (req.body.max_people){
      update.max_people = req.body.max_people;
   }

   if (req.body.state){
      update.state = req.body.state;
   }

   //perchè la patch con findOneAndUpdate ritora sempre un valore vecchio?
   table.getModel().findOneAndUpdate( {number: req.params.number}, { $set: update}, ).then( (data : table.Table) => {
      
      emitEvent("modified table", req.params.number)

      return res.status(200).json( {
         number: data.number,
         max_people: data.number,
         state: data.state
      });

      ios.emit("waiters");

      

   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });

});

app.route("/items").get(auth, (req,res,next) => {
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   var filter: any = {}
   if(req.query.type)
      filter.type = req.query.type;

   item.getModel().find(filter, "name type price required_time ingredients").then( (itemslist) => {
      return res.status(200).json( itemslist ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   })
}).post(auth, (req, res, next) => {
   
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   
   var i = new (item.getModel()) (req.body);
   
   console.log(i)
   if (!item.isItem(i)){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }
      
   i.save().then( (data) => {
      return res.status(200).json({ error: false, errormessage: "", id: data._id });
   }).catch( (reason) => {
   if( reason.code === 11000 )
      return next({statusCode:409, error:true, errormessage: "Item already exists"} );
   return next({ statusCode:500, error: true, errormessage: "DB error: "+reason.errmsg });
   })
   
});

/*DECIDERE SE UTILIZZARE ALTRI CAMPI o SEMPRE ID*/
app.route("/items/:id").get(auth, (req,res,next) => {
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

  
   item.getModel().findById(req.params.id).then( (item) => {
      return res.status(200).json( item ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   })
}).put(auth, (req, res, next) => {
   
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   
   
   var i = new (item.getModel()) (req.body);
   
   if (!item.isItem(i)){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   item.getModel().findById(req.params.id).then( (item) => {
      return item.set(i).save();
   }).then((item) => {
      return res.status(200).json( item );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   })
}).delete(auth, (req, res, next) => {
   
   if(!user.newUser(req.user).hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   }
   
   item.getModel().findOneAndDelete({_id:req.params.id}).then( ()=> {
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   })
});

var queryOrderStates;
(queryOrderStates = Array.from(ticket.orderState)).push("all");

app.route("/tickets").get(auth, (req, res, next) => {

   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   console.log("entro nella ticket api----");
   var sender = user.newUser(req.user);
   /*if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:404, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );*/

   var filter: any = {}
   if(req.query.start)
      filter.start = req.query.start;

   if(req.query.state){
      filter.state = req.query.state;
   }
   if(req.query.waiter){
      filter.waiter = req.query.waiter;
   }     
   
   if(req.query.table){
      filter.table = req.query.table;
   }

   console.log(filter);

   if(req.query.orders && !queryOrderStates.filter((val) => val === req.query.orders))
      return next({ statusCode:400, error: true, errormessage: "The state of orders accepted are ordered, preparation, ready, delivered and all"})

   ticket.getModel().find(filter).then( (ticketslist : ticket.Ticket[]) => {
      if(req.query.orders && (req.query.orders != queryOrderStates[4])){
         var orders = []
         ticketslist.forEach((ticket : ticket.Ticket) => {
            var ticket_orders = ticket.orders.filter((order => order.state == req.query.orders));
            if(ticket_orders.length != 0) {
               orders.push({
                  ticket_id: ticket.id,
                  orders: ticket_orders
               });
            }
         });
         console.log("vado in if" + orders);
         return res.status(200).json(orders);
      } else {
         console.log("vado in else" + ticketslist);
         return res.status(200).json( ticketslist );
      }
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
   
}).post(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );
   }

   var startdate: Date = new Date(req.body.start);
   console.log(req.body) ;
   console.log(startdate.toString());
   console.log(typeof(req.body.table));

   if (!req.body || !req.body.waiter || !req.body.table || !req.body.start || typeof(req.body.waiter) != 'string' || typeof(req.body.table) != 'number' || startdate.toString() == 'Invalid Date' ){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   var newer: any = {};
   newer.waiter = req.body.waiter;
   newer.table = req.body.table;
   newer.start = startdate.toString();

   var t = new (ticket.getModel()) (newer);
   console.log(t);
   
   t.save().then( (data) => {
      return res.status(200).json({ error: false, errormessage: "", _id: data._id });
   }).catch( (reason) => {
   if( reason.code === 11000 )
      return next({statusCode:409, error:true, errormessage: "Ticket already exists"} );
   return next({ statusCode:500, error: true, errormessage: "DB error: "+reason.errmsg });
   })
});

app.route('/tickets/:id').get(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   

   ticket.getModel().findById(req.params.id).then( (data) => {
      return res.status(200).json( data ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   });
}).patch(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   
   if(!sender.hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );
   }

   var enddate: Date = new Date(req.body.end); 
   console.log(enddate);

   if ( !req.body || (req.body.end && enddate.toString() == 'Invalid Date') || (req.body.state && typeof(req.body.state) != 'string')){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   var update: any = {};
   
   if (req.body.end){
      update.end = req.body.end;
   }

   if (req.body.state){
      update.state = req.body.state;
   }

   ticket.getModel().findOneAndUpdate( {_id: req.params.id}, { $set: update}, ).then( (data : ticket.Ticket) => {
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});

app.route('/tickets/:id/orders').get(auth, (req, res, next) => {
   ticket.getModel().findById(req.params.id).then( (data : ticket.Ticket) => {
      return res.status(200).json( data.orders ); 
   }).catch( (reason) => {
      return next({ statusCode:404, error: true, errormessage: "DB error: "+ reason });
   });
}).post(auth, (req, res, next) => {
   var sender = user.newUser(req.user);
   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   console.log(req.body);

   if (!req.body || !req.body.name_item || req.body.name_item || !req.body.price || /*req.body.added ||*/ typeof(req.body.name_item) != 'string' || typeof(req.body.price) != 'number' || typeof(req.body.name_item) != 'string'/*|| Array.isArray(req.body.added)*/){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   var newer: any = {};
   newer.id_order = new ObjectID();
   newer.name_item = req.body.name_item;
   newer.price = req.body.price;
   newer.added = req.body.added;
   newer.waiter = req.body.username_waiter;
   newer.state = ticket.orderState[0];
   newer.state = ticket.orderState[0];
   
   ticket.getModel().update( { _id: req.params.id}, { $push: { orders: newer } }).then( () => {
      item.getModel().findOne({ name: newer.name_item}).then( (i: item.Item) => {
         //console.log("AAAAAAA:\n" + i + "\n");
         if (i.type == item.type[0]){
            //console.log("DISH")
            emitEvent("ordered dish", req.params.id);
         } else if (i.type == item.type[1]){
            //console.log("DRINK");
            emitEvent("ordered drink", req.params.id);
         }
         return res.status(200).json( {error:false, errormessage:""} );
      }).catch((err) => {
         return res.status(404).json( {error:true, errormessage:err} );
      });
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});

app.route('/tickets/:idTicket/orders/:idOrder').patch( auth, (req,res,next) => {
   
   //controllo formato richiesta
   if ( !req.body || (req.body.state && typeof(req.body.state) != 'string')){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   //trovo il ticket usando l'id specificato nella richiesta
   ticket.getModel().findById( req.params.idTicket).then( (data : ticket.Ticket) => {
      if (!data){
         return next({ statusCode:404, error: true, errormessage: "Ticket id not found" });
      }
      //trovo l'order (interno al ticket) usando l'id specificato nella richiesta
      var toChange: Array<ticket.Order> = data.orders.filter(function(ord){return ord.id == req.params.idOrder});

      if (toChange.length < 1){
         return next({ statusCode:404, error: true, errormessage: "Order id not found" });
      }

      toChange[0].state = req.body.state;
      data.save();
      
      if (req.body.state == ticket.orderState[2]){
         emitEvent("ready item", req.params.idTicket);
      }
      else if(req.body.state == ticket.orderState[1]){
         emitEvent("dish in preparation", req.params.idTicket);
      }

      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});


app.get('/renew', auth, (req,res,next) => {
   var tokendata = req.user;
   delete tokendata.iat;
   delete tokendata.exp;
   //nuovo token
   console.log("Renewing token for user " + JSON.stringify( tokendata ));
   var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );
   
   return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});

// Configure HTTP basic authentication strategy 
// trough passport middleware.

passport.use( new passportHTTP.BasicStrategy(
   function(username, password, done) {
      // Delegate function we provide to passport middleware
      // to verify user credentials 

      console.log("New login attempt from "/*.green*/ + username );
      user.getModel().findOne( {username: username} , (err, user)=>{
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

   //genero il token
   var tokendata = {
      username: req.user.username,
      role: req.user.role,
   };
   console.log("Login granted. Generating token" );
   var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' } );

   return res.status(200).json({ error: false, errormessage: "", token: token_signed });

});

 // Add error handling middleware
app.use( function(err,req,res,next) {
   //console.log("SONO QUI");
   console.log("Request error: "/*.red*/ + JSON.stringify(err) );
   res.status( err.statusCode || 500 ).json( err );
 
});

app.use((req, res, next) => {
   res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});

mongoose.connect('mongodb://localhost:27017/restaurant').then(function onconnected() {
   console.log("Connected to MongoDB");
   //inizializzazione DB
   user.getModel().deleteMany({}).then(data => {
      console.log("Database users pulito: " + data);
      var u = user.newUser({
         username: "admin",
      });
      u.setDesk();
      u.setPassword("admin");
      return u.save();
   }).then(() => {
      console.log("Admin user created");
      return user.getModel().count({});
   }).then((count) => {
      console.log(count);
      if (count != 0) {
         console.log("Adding some test data into the database");
         var user1 = user.newUser({
            username: "waiter1"
         })
         user1.setWaiter();
         user1.setPassword("waiter1");
         var pr1 = user1.save();
         
         var user2 = user.newUser({
            username: "cook1"
         })
         user2.setCook();
         user2.setPassword("cook1");
         var pr2 = user2.save();

         var user3 = user.newUser({
            username: "bartender1"
         })
         user3.setBartender();
         user3.setPassword("bartender1");
         var pr3 = user3.save();

         var user4 = user.newUser({
            username: "waiter2"
         })
         user4.setWaiter();
         user4.setPassword("waiter2");
         var pr4 = user4.save();

         Promise.all([pr1, pr2, pr3, pr4])
            .then(function () {
            console.log("Users saved");
         })
            .catch(function (reason) {
            console.log("Unable to save: " + reason);
         });
      }
   }).catch(err => {
      console.log("Errore " + err);
   });

   table.getModel().deleteMany({}).then(data => {
      console.log("Database tables pulito: " + data);

      var tableModel = table.getModel();
      var t1 = (new tableModel({number : 1, max_people: 4})).save();
      var t2 = (new tableModel({number : 2, max_people: 4})).save();
      var t3 = (new tableModel({number : 3, max_people: 6})).save();
      Promise.all([t1, t2, t3]).then(function () {
         console.log("Table saved");
      }).catch(function (reason) {
         console.log("Unable to save tables: " + reason);
      });
   }).catch(err => {
      console.log("Errore nella pulizia del dataset tables: " + err);
   });
   

   item.getModel().deleteMany({}).then(data => {
      console.log("Dataset items pulito: " + data);
      
      var itemModel = item.getModel();
      var i1 = (new itemModel({
         name: "Spaghetti al pomodoro.",
         type: item.type[0],
         price: 5,
         ingredients: ["spaghetti", "sugo di pomodoro"],
         required_time: 12,
         description: "Semplici spaghetti al pomodoro che Cecchini non può però mangiare a pranzo, perchè porta sempre il riso per cani."
      })).save();

      var i2 = (new itemModel({
         name: "Spaghetti al ragu",
         type: item.type[0],
         price: 6,
         ingredients: ["spaghetti", "sugo di pomodoro", "carne macinata"],
         required_time: 12,
         description: "Semplici spaghetti al ragù."
      })).save();

      var i3 = (new itemModel({
         name: "Bistecca alla griglia",
         type: item.type[0],
         price: 8,
         ingredients: ["bistecca"],
         required_time: 10, 
         description: "Forse è una bistecca?"
      })).save();

      var i4 = (new itemModel({
         name: "Coca cola",
         type: item.type[1],
         price: 2.5,
         ingredients: ["coca cola"],
         required_time: 1, 
         description: "Coca cola alla spina da 333ml"
      })).save();

      var i5 = (new itemModel({
         name: "Chinotto",
         type: item.type[1],
         price: 2,
         ingredients: ["coca cola"],
         required_time: 1, 
         description: "Chinotto in lattina da 333ml"
      })).save();

      Promise.all([i1, i2, i3, i4, i5]).then(function () {
         console.log("Items saved");
      }).catch(function (reason) {
         console.log("Unable to save items: " + reason);
      });
   });


   ticket.getModel().deleteMany({}).then(data => {
      var ticketModel = ticket.getModel();

      var ti1 = new ticketModel({
         waiter: "waiter1",
         table: 1,
         start: new Date("05/05/2019, 11:49:36 AM"),
         orders: [{
            //id_order: new ObjectID(),
            name_item: "Bistecca alla griglia",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 9
         }],
         state: ticket.ticketState[0],
         total: 0
      }).save();

      var ti2 = new ticketModel({
         waiter: "waiter2",
         table: 2,
         start: new Date("05/05/2019, 08:49:36 PM"),
         orders: [{
            //id_order: new ObjectID(),
            name_item: "Spaghetti al pomodoro",
            username_waiter: "waiter2",
            state: ticket.orderState[0],
            price: 6,
            added: ["Mozzarella"]
         }, {
            //id_order: new ObjectID(),
            name_item: "Bistecca alla griglia",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 9
         }],
         state: ticket.ticketState[0],
         total: 0
      }).save();

      //fine inizializzazione DB
      Promise.all([ti1, ti2]).then(function () {
         console.log("Tickets saved");
      }).catch(function (reason) {
         console.log("Unable to save tickets: " + reason);
      });
   });

   let server = http.createServer(app);
   ios = io(server);
   ios.on('connection', function(client) {
      console.log( "Socket.io client connected");      
   });
   server.listen( 8080, () => console.log("HTTP Server started on port 8080") );

}, function onrejected() {
    console.log("Unable to connect to MongoDB");
    process.exit(-2);
});
