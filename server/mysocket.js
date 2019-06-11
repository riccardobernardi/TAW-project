"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io"); // Socket.io websocket library
class MySocket {
    constructor(server) {
        this.ios = io(server);
    }
    emitEvent(eventType) {
        socketEvents[eventType].destRooms.forEach((r) => {
            this.ios.emit(r);
        });
    }
}
exports.MySocket = MySocket;
var rooms = ["waiters", "cooks", "desks", "bartenders"];
var socketEvents = {
    "modified user": {
        destRooms: [rooms[2]]
    },
    "modified table": {
        destRooms: [rooms[0], rooms[2]]
    },
    "ordered dish": {
        destRooms: [rooms[1], rooms[2]]
    },
    "ordered drink": {
        destRooms: [rooms[3], rooms[2]]
    },
    "dish in preparation": {
        destRooms: [rooms[1], rooms[2]]
    },
    "beverage in preparation": {
        destRooms: [rooms[3], rooms[2]]
    },
    "ready item - cooks": {
        destRooms: [rooms[1], rooms[2]]
    },
    "ready item - bartenders": {
        destRooms: [rooms[3], rooms[2]]
    },
    "ready item - waiters": {
        destRooms: [rooms[0]]
    },
};
//# sourceMappingURL=mysocket.js.map