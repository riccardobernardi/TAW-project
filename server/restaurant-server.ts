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
import * as table from './Table';
import * as user from './User';
import * as ticket from './Ticket';
import * as item from './Item';
import * as report from './Report';
import {MySocket} from './mysocket';
var app = express();

// We create the JWT authentication middleware
// provided by the express-jwt library.  
// 
// How it works (from the official documentation):
// If the token is valid, req.user will be set with the JSON object 
// decoded to be used by later middleware for authorization and access control.
//



var auth = jwt( {secret: process.env.JWT_SECRET} );


//variabile per il socket
var socket: MySocket;

//semaforo per tickets post
var ticket_post_occupied = false;

app.use( cors() );

// Install the top-level middleware "bodyparser"
app.use( bodyparser.json() );

// Add API routes to express application
//
app.get("/", (req,res) => {

res.status(200).json( { 
   api_version: "0.1.0", 
   endpoints: [ "/login", "/users", "/tables", "/items", "/tickets", "/tickets/:id/orders", "/reports" ] } ); // json method sends a JSON response (setting the correct Content-Type) to the client
});


/* da togliere
- per l'approccio che utilizziamo, websocket del server invia solo (alle chiamate alle API) e websocket del client ascolta gli eventi e poi reinterroga il server (quindi non serve l'autenticazione, perchè se non è autenticato non può interrogare l'api)
- endpoint /tickets?filter=orders per inviare gli ordini relativi ai tickets (magari con un ulteriore parametro filterOrders)
*/


/*app.route("mock").get((req,res,next) => {
   console.log("trigger");
   ios.emit("paydesks");
})*/

//da togliere

/*app.route("/mock").get( (req,res,next) => {
   ios.emit("cooks");

   return res.status(200).json( "bella vecchio" );
}); 
*/
app.route("/users").get(auth, (req,res,next) => {
   //da togliere
   console.log(JSON.stringify(req.headers));
   console.log(typeof(req.body.date));
   
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: false, errormessage: "Unauthorized: user is not a desk"} );
   
   //creo filtro per la query
   var filter: any = {};
   if(req.query.role)
      filter.role = req.query.role;

   //query
   user.getModel().find(filter, "username role").then( (userslist) => {
      return res.status(200).json( userslist ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   })
}).post(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   
   //controllo formato
   if ( !req.body || !req.body.username || !req.body.password || !req.body.role || typeof(req.body.username) != 'string' || typeof(req.body.password) != 'string' || typeof(req.body.role) != 'string' || !user.roles.includes(req.body.role) )
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );

   //creo utente da inserire
   var u = user.newUser( req.body );
   u.setPassword( req.body.password );

   //query
   u.save().then( (data) => {
      socket.emitEvent("modified user");
      return res.status(200).json({ error: false, errormessage: "", id: data._id });
   }).catch( (reason) => {
   if( reason.code === 11000 )
      return next({statusCode:409, error:true, errormessage: "User already exists"} );
   return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   })
});



//cambiare username con id restituito da mongo e maagari aggiungere filtri su username in get users?
app.route("/users/:username").delete(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );

   //query al DB
   user.getModel().deleteOne( {username: req.params.username } ).then( ()=> {
      socket.emitEvent("modified user");      
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });
}).put(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   }
   //console.log(user.roles.includes("desk"))
   console.log(req.body);
   //controllo formato
   if ( !req.body || !req.body.password || !req.body.role || typeof(req.body.password) != 'string' || typeof(req.body.role) != 'string' || !user.roles.includes(req.body.role) )
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );

   console.log(req.body);
   //creo utente da inserire
   var newer = {};
   newer["username"] = req.params.username;
   //newer.password = req.body.password;
   newer["role"] = req.body.role;
   var u = user.newUser( newer );
   u.setPassword(req.body.password);

   console.log(newer);
   //query dal DB
   //errore strano con findOneAndReplace, poi vedere, altrimenti tenere findOneAndUpdate
   //occhio al setting dei campi, si può fare diversamente?
   user.getModel().findOneAndUpdate({username: req.params.username}, u).then( (data : user.User)=> {
      socket.emitEvent("modified user");
      return res.status(200).json( {
         username: data.username,
         role: data.role
      });
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });

});

app.route("/tables").get(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );


   //query al DB
   table.getModel().find({}, {number:1, max_people:1, _id: 0, state:1, associated_ticket: 1}).then( (tableslist) => {
      return res.status(200).json( tableslist ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
}).post(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );

   //controllo formato
   var toInsert: any = {};
   toInsert.number = req.body.number;
   toInsert.max_people = req.body.max_people;
   
   if (!toInsert.number || typeof(toInsert.number) != "number" || !toInsert.max_people || typeof(toInsert.max_people) != "number" ){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   

   //tavolo libero di default
   toInsert.state = table.states[0];
   //creo tavolo da aggiungere
   var Table = table.getModel();
   
   //query al DB
   (new Table(toInsert)).save().then( (data : table.Table) => {
      //notifico sul socket
      socket.emitEvent("modified table");
      return res.status(200).json( {
         number: data.number,
         max_people: data.max_people,
         state: data.state,
         associated_ticket: data.associated_ticket
      }); 
   }).catch( (reason) => {
      if( reason.code === 11000 )
         return next({statusCode:409, error:true, errormessage: "Table number already taken"} );
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
      
   });
});;

app.route("/tables/:number").get(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   //query al DB
   table.getModel().find({number: req.params.number}, {number: 1, max_people: 1, state: 1, associated_ticket: 1}).then( (table) => {
      return res.status(200).json( table ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
}).patch(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   //controllo formato
   if ( !req.body ||(req.body.max_people && isNaN(parseInt(req.body.max_people))) || (req.body.state && typeof(req.body.state) != 'string'))
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
      console.log("Dentro tables API");
      console.log(req.body);
   
   table.getModel().findOne({number: req.params.number}).then((data: table.Table) => {
      //creo oggetto per aggiornare il documento
      var update: any = {};
      if (req.body.max_people)
         update.max_people = req.body.max_people;
      if (req.body.associated_ticket)
         update.associated_ticket = req.body.associated_ticket;
      if (req.body.state)
         update.state = req.body.state;
      
      if (update.state == table.states[0]){
         //controllo che non ci sia un associated_ticket quando si cerca di liberare un tavolo
         /* if (update.associated_ticket)
            return next({ statusCode:401, error: true, errormessage: "Wrong format, associated_ticket not required" });
         */
         update.associated_ticket = null;
         data.update(update).then(() => {
            //notifico sul socket
            socket.emitEvent("modified table");
            return res.status(200).json( {
               number: data.number,
               max_people: data.number,
               state: data.state,
               associated_ticket: data.associated_ticket
            });
         });
         
      } else if (update.state == table.states[1]){
         //controllo che sia definito il ticket da associare per occupare il tavolo
         if (!update.associated_ticket)
            return next({ statusCode:401, error: true, errormessage: "Wrong format, associated_ticket required" });
         //controllo che il tavolo sia libero
         if (data.state == table.states[1])
            return next({ statusCode:409, error: true, errormessage: "Conflict, table already taken" });
         //modifico tavolo
         data.update(update).then(() => {
            //notifico sul socket
            socket.emitEvent("modified table");
            return res.status(200).json( {
               number: data.number,
               max_people: data.max_people,
               state: data.state,
               associated_ticket: data.associated_ticket
            });
         });

      } else if(!update.state){
         if (update.associated_ticket){
            return next({ statusCode:401, error: true, errormessage: "Wrong format, state required" });
         }

         //modifico tavolo
         data.update(update).then(() => {
            //notifico sul socket
            socket.emitEvent("modified table");
            return res.status(200).json( {
               number: data.number,
               max_people: data.max_people,
               state: data.state,
               associated_ticket: data.associated_ticket
            });
         });

      }
      else{
         return next({ statusCode:401, error: true, errormessage: "Wrong format" });
      }
   }).catch((reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
}).delete(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);   
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );

   //query al DB
   table.getModel().findOneAndDelete({number: req.params.number}).then( () => {
      //notifico sul socket
      socket.emitEvent("modified table");
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});

app.route("/items").get(auth, (req,res,next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );
   
   //creo filtro per la query al DB
   var filter: any = {}
   if(req.query.type)
      filter.type = req.query.type;

   //query al DB
   item.getModel().find(filter, "name type price required_time ingredients").then( (itemslist) => {
      return res.status(200).json( itemslist ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   })
}).post(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   
   //creo item da inserire
   var i = new (item.getModel()) (req.body);
   
   //da togliere
   console.log(i)

   //controllo formato
   if (!item.isItem(i))
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   
   //inserisco
   i.save().then( (data) => {
      return res.status(200).json({ error: false, errormessage: "", id: data._id });
   }).catch( (reason) => {
   if( reason.code === 11000 )
      return next({statusCode:409, error:true, errormessage: "Item already exists"} );
   return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   })
   
});

/*DECIDERE SE UTILIZZARE ALTRI CAMPI o SEMPRE ID*/
app.route("/items/:id").get(auth, (req,res,next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );


   item.getModel().findById(req.params.id).then( (item) => {
      return res.status(200).json( item ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   })
}).put(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   
   //creo item che sostituirà quello già presente
   var i = new (item.getModel()) (req.body);
   //controllo validità dell'item creato (formato campi inseriti)
   if (!item.isItem(i))
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );


   item.getModel().findById(req.params.id).then( (item) => {
      return item.set(i).save();
   }).then((item) => {
      return res.status(200).json( item );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   })
}).delete(auth, (req, res, next) => {
   //autenticazione
   if(!user.newUser(req.user).hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   }
   
   item.getModel().findOneAndDelete({_id:req.params.id}).then( ()=> {
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason)=> {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   })
});


app.route("/tickets").get(auth, (req, res, next) => {
   
   //da togliere
   console.log("entro nella ticket api----");
   
   //creo il filtro
   var filter: any = {}
   if(req.query.state)
      filter.state = req.query.state;
   if(req.query.waiter)
      filter.waiter = req.query.waiter;
   if(req.query.table)
      filter.table = req.query.table;

   console.log(filter);

   //TODO migliorare il controllo del formato


   //controllo formato della query sullo stato degli ordini
   if(req.query.orders && !ticket.orderState.filter((val) => val === req.query.orders))
      return next({ statusCode:400, error: true, errormessage: "The state of orders accepted are ordered, preparation, ready, delivered and all"})

   //ioss.emit("cooks");
   //ioss.emit("waiters");
   //ioss.emit("paydesks");

   console.log("GET tickets: " + req.params);

   //trovo i tickets
   ticket.getModel().find(filter).then( (ticketslist : ticket.Ticket[]) => {
      //se specificato, filtro gli ordini utilizzando il loro stato
      if(req.query.orders && (req.query.orders != ticket.orderState[4])){
         var orders = [];
         ticketslist.forEach((ticket : ticket.Ticket) => {
            var ticket_orders = ticket.orders.filter((order => order.state == req.query.orders));
            if(ticket_orders.length != 0) {
               orders.push({
                  ticket_id: ticket.id,
                  orders: ticket_orders
               });
            }
         });
         ticketslist = orders;
      }

      //filtro per la data (solo la data, non l'ora)
      if(req.query.start){
         var dateFilter = new Date(req.query.start);
         console.log(dateFilter);
         console.log(ticketslist);
         ticketslist = ticketslist.filter((t: ticket.Ticket) => { 
            t.start = new Date(t.start);
            console.log(t.start.getFullYear(), dateFilter.getFullYear(), t.start.getMonth(), dateFilter.getMonth(), t.start.getDate(), dateFilter.getDate());
            return t.start.getFullYear() == dateFilter.getFullYear() && t.start.getMonth() == dateFilter.getMonth() && t.start.getDate() == dateFilter.getDate(); 
         });
      }
      console.log(ticketslist);
      return res.status(200).json( ticketslist );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });   
}).post(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   var startdate: Date = new Date(req.body.start);
   
   //da togliere
   //console.log(req.body) ;
   //console.log(startdate.toString());
   //console.log(typeof(req.body.table));
   

   //controllo formato
   if (!req.body || !req.body.waiter || !req.body.table || !req.body.start || typeof(req.body.waiter) != 'string' || typeof(req.body.table) != 'number' || startdate.toString() == 'Invalid Date' ){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   //controllo semaforo
   if (ticket_post_occupied)
      return next({statusCode:429, error:true, errormessage: "Server is executing another /tickets POST"} );
   //occupo semaforo
   ticket_post_occupied = true;
   

   //creo ticket da inserire
   var newer: any = {};
   newer.waiter = req.body.waiter;
   newer.table = req.body.table;
   newer.start = startdate.toString();
   newer.people_number = req.body.people_number;
   newer.state = ticket.ticketState[0];

   ticket.getModel().findOne({table: newer.table, state: ticket.ticketState[0]}).then((data) => {
      console.log("AAAAAAAAAAA" + data);
      if(!data) {
         //libero semaforo
         ticket_post_occupied = false;
         return table.getModel().findOne({number: newer.table})
      } else return next({statusCode:409, error:true, errormessage: "Ticket for this table already is open"} );
   }).then((data: table.Table) => {

      if(!data){
         //libero semaforo
         ticket_post_occupied = false;
         return next({statusCode:409, error:true, errormessage: "Table associated doesn't exist."} );
      }
         //controllo numero posti del tavolo
      if (newer.people_number > data.max_people){
         //libero semaforo
         ticket_post_occupied = false;
         return next({statusCode:409, error:true, errormessage: "Table associated hasn't enought seats"} );
      }
         //controllo che il tavolo sia libero
      if (data.state == table.states[1]){
         //libero semaforo
         ticket_post_occupied = false;
         return next({statusCode:409, error:true, errormessage: "Table is already taken"} );
      }
      console.log({table: newer.table, state: ticket.ticketState[0]});
      
      var t = new (ticket.getModel()) (newer);

      //da togliere
      console.log(t);

      return t.save();
   }, () => {
      //libero semaforo
      ticket_post_occupied = false;
      return next({statusCode:409, error:true, errormessage: "Table associated doesn't exist"} );
   }).then( (data) => {
      //libero semaforo
      ticket_post_occupied = false;
      return res.status(200).json({ error: false, errormessage: "", _id: data._id });
   }).catch((reason) => {
      //libero semaforo
      ticket_post_occupied = false;
      if( reason.code === 11000 )
         return next({statusCode:409, error:true, errormessage: "Ticket already exists"} );
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });
   
});

app.route('/tickets/:id').get(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   
   //trovo e restituisco il ticket richiesto
   ticket.getModel().findById(req.params.id).then( (data) => {
      return res.status(200).json( data ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
}).patch(auth, (req, res, next) => {
   //autenticazione
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
   }

   var enddate: Date = new Date(req.body.end); 
   //console.log(enddate);

   //controllo formato
   if ( !req.body || (req.body.end && enddate.toString() == 'Invalid Date') || (req.body.state && typeof(req.body.state) != 'string') || (req.body.total != null && req.body.total != undefined && typeof(req.body.total) != 'number')){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }
   //console.log("Patch per ticket/id: " + req.body.total);
   //creo oggeto utilizzato per modificare i campi del documento
   var update: any = {};
   if (req.body.end)
      update.end = req.body.end;
   if (req.body.state)
      update.state = req.body.state;
   if(req.body.total != null && req.body.total != undefined)
      update.total = req.body.total;

   console.log(req.params.id);
   console.log(update);
   ticket.getModel().findOneAndUpdate( {_id: req.params.id}, { $set: update}, ).then( (data : ticket.Ticket) => {
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});

app.route('/tickets/:id/orders').get(auth, (req, res, next) => {
   //trovo e restituisco gli ordini del ticket richiesto
   ticket.getModel().findById(req.params.id).then( (data : ticket.Ticket) => {
      return res.status(200).json( data.orders ); 
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
}).post(auth, (req, res, next) => {
   //autenticazioni
   var sender = user.newUser(req.user);
   if(!sender.hasDeskRole() && !sender.hasWaiterRole())
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );

   console.log(req.body);

   //controllo formato richiesta
   if (!req.body || !req.body.name_item  || !req.body.price || !req.body.required_time || /*req.body.added ||*/ typeof(req.body.name_item) != 'string' || typeof(req.body.price) != 'number' || typeof(req.body.required_time) != 'number'/*|| Array.isArray(req.body.added)*/){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   //creo order da inserire
   var newer: any = {};
   newer.id_order = new ObjectID();
   newer.name_item = req.body.name_item;
   newer.price = req.body.price;
   newer.added = req.body.added;
   newer.state = ticket.orderState[0];
   newer.type_item = req.body.type_item;
   newer.required_time = req.body.required_time;
   
   //inserisco order nel DB
   ticket.getModel().update( { _id: req.params.id}, { $push: { orders: newer } }).then( () => {
      //controllo il tipo di order inserito e mando un evento sulla stanza relativa
      item.getModel().findOne({ name: newer.name_item}).then( (i: item.Item) => {
         //console.log("AAAAAAA:\n" + i + "\n");
         if (i.type == item.type[0]){
            console.log("DISH")
            socket.emitEvent("ordered dish");
         } else if (i.type == item.type[1]){
            console.log("DRINK");
            socket.emitEvent("ordered drink");
         }
         return res.status(200).json( {error:false, errormessage:""} );
      }).catch((err) => {
         return res.status(500).json( {error:true, errormessage:"DB error: "+ err} );
      });
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
   });
});

app.route('/tickets/:idTicket/orders/:idOrder').patch( auth, (req,res,next) => {
   var sender = user.newUser(req.user);

   var order_type;

   //controllo formato richiesta
   if ( !req.body || (req.body.state && typeof(req.body.state) != 'string')){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

   //trovo il ticket usando l'id specificato nella richiesta
   ticket.getModel().findById( req.params.idTicket).then( (data : ticket.Ticket) => {
      
      //trovo l'order (interno al ticket) usando l'id specificato nella richiesta
      var toChange: Array<ticket.Order> = data.orders.filter(function(ord){return ord.id == req.params.idOrder});

      if (toChange.length < 1){
         return next({ statusCode:404, error: true, errormessage: "Order id not found" });
      }

      //controllo che la modifica dello stato sia coerente (es: non può passare da ordinato a consegnato senza passare per gli stati intermedi)
      let nextStateIndex = ticket.orderState.findIndex((st) =>{return st == req.body.state} );
      if ( (toChange[0].state != ticket.orderState[nextStateIndex-1] && 
         !(toChange[0].state == ticket.orderState[0] && req.body.state == ticket.orderState[2] && toChange[0].type_item == item.type[1])) ||
         ( toChange[0].type_item == item.type[1] && req.body.state == ticket.orderState[1]) ){
         return next({ statusCode:409, error: true, errormessage: "Conflict, orderd state change not coherent with the regular state changes flow" });
      }

      toChange[0].state = req.body.state;

      //controllo per assegnare l'executer
      if(req.body.username_executer && ( (nextStateIndex == 1 && sender.hasCookRole()) || (nextStateIndex == 2 && sender.hasBartenderRole()) ) )
         toChange[0].username_executer = req.body.username_executer;
      else if (req.body.username_executer)
         return next({ statusCode:400, error: true, errormessage: "Username_executer not required"} );
      
      order_type = toChange[0].type_item;
      console.log("BBBB: " + req.body);
      console.log("AAAA: " + toChange[0]);
      return data.save();
      
   }).then((data) => {
      //console.log(req.body.state);
      //console.log(ticket.orderState[1]);
      //console.log(data);

      if(req.body.state == ticket.orderState[1]) {
         //console.log(item.type[0]);
         //var order = data.orders.filter((order) => order.id == req.params.idOrder)[0]
         //if(order.type_item == item.type[0]) {
            socket.emitEvent("dish in preparation");
         console.log("emit dish in prepare");
         //} else {
         //   emitEvent("beverage in preparation", req.params.idTicket);
         //   console.log("emit beverage in prepare");
         //}
      }
      if(req.body.state == ticket.orderState[2]) {
         var order = data.orders.filter((order) => order.id == req.params.idOrder)[0];
         if(order.type_item == item.type[0]) {
            console.log("Emetto piatto pronto per cuochi");
            socket.emitEvent("ready item - cooks");
         } else {
            console.log("Emetto piatto pronto per cuochi");
            socket.emitEvent("ready item - bartenders");
         }
         //controllo che tutti gli ordini dello stesso tipo e dello stesso ticket siano pronti
         var ordersList: Array<ticket.Order[]> = [];
         ordersList = data.orders.filter((order: ticket.Order) => {
            console.log(order);
            return (order.state != ticket.orderState[2] && order.type_item ==  order_type && order.state != ticket.orderState[3]);
         });

         if (req.body.state == ticket.orderState[2] && ordersList.length == 0) 
            console.log("Sto per emettere l'evento 'piatti pronti!'");

         if (req.body.state == ticket.orderState[2] && ordersList.length == 0){
            socket.emitEvent("ready item - waiters");
         }
      }
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch( (reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });
}).delete(auth, (req,res,next) => {
   //autenticazione
   if(!user.newUser(req.user).hasWaiterRole()){
      return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a waiter"} );
   }
   
   //trovo il ticket usando l'id specificato nella richiesta
   ticket.getModel().findById( req.params.idTicket).then( (data : ticket.Ticket) => {
      
      //trovo l'order (interno al ticket) usando l'id specificato nella richiesta
      
      
      var indexToDel: number = -1;
      for (let i in data.orders){
         if (data.orders[i].id == req.params.idOrder)
            indexToDel = parseInt(i);
      }

      if (indexToDel < 0){
         return next({ statusCode:404, error: true, errormessage: "Order id not found" });
      }

      data.orders.splice(indexToDel,1);
      return data.save();

   }).then(()=>{
      return res.status(200).json( {error:false, errormessage:""} );
   }).catch((reason) => {
      return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
   });


   
});


app.route("/reports").get( auth, (req,res,next) => {
    //autenticazione
    if(!user.newUser(req.user).hasDeskRole())
       return next({ statusCode:401, error: false, errormessage: "Unauthorized: user is not a desk"} );

    //creo filtro per la query
    var filter: any = {};
		if(req.query.start || req.query.end) {
         filter.date = {}
         console.log(filter);
         console.log(req.query.start);
         console.log(req.query.end);
         if(req.query.start) {
            filter.date["$gte"] = new Date(req.query.start);
            filter.date["$gte"].setHours(0,0,0,0);
         }
         if(req.query.end) {
            filter.date["$lte"] = new Date(req.query.end);
            filter.date["$lte"].setHours(0,0,0,0);
            filter.date["$lte"].setDate(filter.date["$lte"].getDate()+1);
            //ALTRIMENTI NON FUNZIA
         }
         console.log(filter);
		}
		console.log(filter);
 
    //query
    report.getModel().find(filter).then( (reportslist) => {
       return res.status(200).json( reportslist ); 
    }).catch( (reason) => {
       return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
    })
 }).post( auth, (req,res,next) => {
    //autenticazione
    if(!user.newUser(req.user).hasDeskRole())
       return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
    
    //creo report da inserire
    var r = new (report.getModel()) (req.body);
    
    //da togliere
    console.log(r)
 
    //controllo formato
    if (!report.isReport(r))
       return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
		
		r.date.setHours(0,0,0,0); //in order to reset hour, minutes and seconds for searches
    //inserisco
    r.save().then( (data) =>  {
       return res.status(200).json({ error: false, errormessage: "", id: data._id });
    }).catch( (reason) => {
    if( reason.code === 11000)
       return next({statusCode:409, error:true, errormessage: "Report already exists"} );
    return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
    });
 });
 
 app.route("/reports/:id").get( auth, (req,res,next) => {
    //autenticazione
    var sender = user.newUser(req.user);
    if(!sender.hasDeskRole())
       return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk or a waiter"} );
 
    
    //trovo e restituisco il ticket richiesto
    report.getModel().findById(req.params.id).then( (data) => {
       return res.status(200).json(data); 
    }).catch( (reason) => {
       return next({ statusCode:500, error: true, errormessage: "DB error: "+ reason });
    });
 }).delete( auth, (req,res,next) => {
    //autenticazione
    if(!user.newUser(req.user).hasDeskRole()){
       return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
    }
    
    report.getModel().findOneAndDelete({_id:req.params.id}).then( ()=> {
       return res.status(200).json( {error:false, errormessage:""} );
    }).catch( (reason)=> {
       return next({ statusCode:500, error: true, errormessage: "DB error: "+reason });
    })
 }).patch(auth, (req, res, next) => {
    //autenticazione
    if(!user.newUser(req.user).hasDeskRole()){
       return next({ statusCode:401, error: true, errormessage: "Unauthorized: user is not a desk"} );
    }
 
    //controllo formato
    if ( !req.body || (req.body.data && req.body.data.toString() == 'Invalid Date') || (req.body.total && typeof(req.body.total) != 'number') || (req.body.total_orders && (typeof(req.body.total_orders[item.type[0]]) != 'number' || typeof(req.body.total_orders[item.type[1]]) != 'number' )) || (req.body.total_customers && typeof(req.body.total_customers) != 'number') || (req.body.average_stay && typeof(req.body.average_stay) != 'number') || ( (req.body.users_reports) && report.isUsersReports(req.body.users_reports)) ){
      return next({ statusCode:400, error: true, errormessage: "Wrong format"} );
   }

    var update: any = {};
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
   
    if (req.body.users_reports )
      update.users_reports = req.body.users_reports;
    
    report.getModel().findOneAndUpdate( {_id: req.params.id}, { $set: update}, ).then( (data : report.Report) => {
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
   var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '4h' } );
   
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
   var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '4h' } );

   return res.status(200).json({ error: false, errormessage: "", token: token_signed });

});

 // Add error handling middleware
app.use( function(err,req,res,next) {
   //console.log("SONO QUI");
   console.log("Request error: "/*.red*/ + JSON.stringify(err) );
   res.status( err.statusCode || err.status || 500 ).json( err );
 
});

app.use((req, res, next) => {
   res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});

mongoose.connect('mongodb+srv://lollocazzaro:prova@cluster0-9fnor.mongodb.net/restaurant-server?retryWrites=true&w=majority').then(function onconnected() {
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
      var t1 = (new tableModel({number : 1, max_people: 4, state: table.states[0]})).save();
      var t2 = (new tableModel({number : 2, max_people: 4, state: table.states[0]})).save();
      var t3 = (new tableModel({number : 3, max_people: 6, state: table.states[0]})).save();
      var t4 = (new tableModel({number : 4, max_people: 6, state: table.states[0]})).save();

      Promise.all([t1, t2, t3, t4]).then(function () {
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
         name: "Spaghetti al pomodoro",
         type: item.type[0],
         price: 5,
         ingredients: ["spaghetti", "sugo di pomodoro"],
         required_time: 12,
         description: "Semplici spaghetti al pomodoro che Cecchini non può però mangiare a pranzo, perchè porta sempre il riso per cani."
      })).save();

      var i2 = (new itemModel({
         name: "Spaghetti al ragù",
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
         start: new Date(),
         orders: [{
            //id_order: new ObjectID(),
            name_item: "Bistecca alla griglia",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 9,
            type_item: item.type[0],
            required_time: 10
         },
         {
            name_item: "Coca cola",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 2.5,
            type_item: item.type[1],
            required_time: 1
         }],
         state: ticket.ticketState[0],
         total: 0,
         people_number: 2
      }).save().then((data) => {
         console.log(data);
         table.getModel().findOneAndUpdate({number: 1}, {$set: {state: table.states[1], associated_ticket: data._id}}).then();
      });

      

      var ti3 = new ticketModel({
         waiter: "waiter1",
         table: 3,
         start: new Date(),
         orders: [{
            //id_order: new ObjectID(),
            name_item: "Bistecca alla griglia",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 9,
            type_item: item.type[0],
            required_time: 10
         }],
         state: ticket.ticketState[0],
         total: 0,
         people_number: 5
      }).save().then((data) => {
         table.getModel().findOneAndUpdate({number: 3}, {$set: {state: table.states[1],associated_ticket: data._id}}).then();
      });

      var ti2 = new ticketModel({
         waiter: "waiter2",
         table: 2,
         start: new Date(),
         orders: [{
            //id_order: new ObjectID(),
            name_item: "Spaghetti al pomodoro",
            username_waiter: "waiter2",
            state: ticket.orderState[0],
            price: 6,
            added: ["Mozzarella"],
            type_item: item.type[0],
            required_time: 12
         }, {
            //id_order: new ObjectID(),
            name_item: "Bistecca alla griglia",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 9,
            type_item: item.type[0],
            required_time: 10
         },
         {
            name_item: "Chinotto",
            username_waiter: "waiter1",
            state: ticket.orderState[0],
            price: 2.5,
            type_item: item.type[1],
            required_time: 1
         }],
         state: ticket.ticketState[0],
         total: 0,
         people_number: 2
      }).save().then((data) => {
         table.getModel().findOneAndUpdate({number: 2},{$set: {state: table.states[1], associated_ticket: data._id}}).then();
      });

      //fine inizializzazione DB
      Promise.all([ti1, ti2, ti3]).then(function () {
         console.log("Tickets saved");
      }).catch(function (reason) {
         console.log("Unable to save tickets: " + reason);
      });  
       
   });

   report.getModel().deleteMany({}).then(() => {
      var reportModel = report.getModel();

      var r1 = new reportModel({
         date: "2019-05-28T00:00:00.000Z",
         total: 175,
         total_customers: 18,
         total_orders: {
             dish: 24,
             beverage: 30
         },
         average_stay: 40,
         users_reports: {
            waiters: [{username: "waiter1", customers_served: 20, orders_served: 66}, {username: "waiter2", customers_served: 40, orders_served: 120}],
            bartenders: [{username: "bartender1", items_served: 60}],
            cookers: [{username: "cook1", items_served: 60}]
         }
      }).save().then(data => console.log(data["bartenders"], data["cookers"] ));

      var r2 = new reportModel({
         date: "2019-05-27T00:00:00.000Z",
         total: 320,
         total_customers: 40,
         total_orders: {
               dish: 50,
               beverage: 112
         },
         average_stay: 90,
         users_reports: {
            waiters: [{username: "waiter1", customers_served: 20, orders_served: 66}, {username: "waiter2", customers_served: 40, orders_served: 120}],
            bartenders: [{username: "bartender1", items_served: 60}],
            cookers: [{username: "cook1", items_served: 60}]
         }
      }).save().then(data => console.log(data["waiters"] ));

      var r3 = new reportModel({
         date: "2019-05-29T00:00:00.000Z",
         total: 5600,
         total_customers: 120,
         total_orders: {
               dish: 350,
               beverage: 712
         },
         average_stay: 120,
         users_reports: {
            waiters: [{username: "waiter1", customers_served: 80, orders_served: 912}, {username: "waiter2", customers_served: 40, orders_served: 305}],
            bartenders: [{username: "bartender1", items_served: 400}, {username: "waiter2", items_served: 700}],
            cookers: [{username: "cook1", items_served: 60}, {username: "cook2", items_served: 1110}]
         }
      }).save()/*.then(data => console.log(data["waiters"] ))*/;

      var r4 = new reportModel({
         date: "2019-05-30T00:00:00.000Z",
         total: 5600,
         total_customers: 120,
         total_orders: {
               dish: 350,
               beverage: 712
         },
         average_stay: 120,
         users_reports: {
            waiters: [{username: "waiter1", customers_served: 80, orders_served: 912}, {username: "waiter2", customers_served: 40, orders_served: 305}],
            bartenders: [{username: "bartender1", items_served: 400}, {username: "waiter2", items_served: 700}],
            cookers: [{username: "cook1", items_served: 60}, {username: "cook2", items_served: 1110}]
         }
      }).save()/*.then(data => console.log(data["waiters"] ))*/;

      var r5 = new reportModel({
         date: "2019-06-03T00:00:00.000Z",
         total: 5600,
         total_customers: 120,
         total_orders: {
               dish: 350,
               beverage: 712
         },
         average_stay: 120,
         users_reports: {
            waiters: [{username: "waiter1", customers_served: 80, orders_served: 912}, {username: "waiter2", customers_served: 40, orders_served: 305}],
            bartenders: [{username: "bartender1", items_served: 400}, {username: "waiter2", items_served: 700}],
            cookers: [{username: "cook1", items_served: 60}, {username: "cook2", items_served: 1110}]
         }
      }).save()/*.then(data => console.log(data["waiters"] ))*/;

      Promise.all([r1,r2, r3, r4, r5]).then().catch((err) => console.log("Save of report not completed: " + err));
   })



   let server = http.createServer(app);
   socket = new MySocket(server);
   // server.listen( 8080, () => console.log("HTTP Server started on port 8080") );

   console.log("aaaaaaaaaaaaaaaaaaa 1234" + process.env.PORT || 8080 );
   server.listen(process.env.PORT || 8080, () => console.log("HTTP Server started on port " + process.env.PORT || 8080) );

}, function onrejected() {
    console.log("Unable to connect to MongoDB");
    process.exit(-2);
});
