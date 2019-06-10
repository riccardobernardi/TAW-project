import io = require('socket.io');               // Socket.io websocket library
import http = require('http');                // HTTP module
export class MySocket {
    ios: any
    constructor(server: http.Server){
        this.ios = io(server);
    }
    emitEvent(eventType){
        socketEvents[eventType].destRooms.forEach((r) => {
           this.ios.emit(r);
        });
     }
}

var rooms = ["waiters", "cooks", "desks", "bartenders"];

var socketEvents = {
   "modified user": {
      destRooms: [rooms[2]]
   },
   "modified table": {
      destRooms: [rooms[0], rooms[2]]
   },
   
   "ordered dish": {
      destRooms: [rooms[1]]
   },
   "ordered drink":{
      destRooms: [rooms[3]]
   },
   "dish in preparation": {
      destRooms: [rooms[1]]
   },
   "beverage in preparation": {
      destRooms: [rooms[3]]
   },
   "ready item - cooks": {
      destRooms: [rooms[1]]
   },
   "ready item - bartenders": {
      destRooms: [rooms[3]]
   },
   "ready item - waiters": {
      destRooms: [rooms[0]]
   },

};
