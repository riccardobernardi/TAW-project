"use strict";
exports.__esModule = true;
var io = require("socket.io"); // Socket.io websocket library
var MySocket = /** @class */ (function () {
    function MySocket(server) {
        this.ios = io(server);
    }
    MySocket.prototype.emitEvent = function (eventType) {
        var _this = this;
        socketEvents[eventType].destRooms.forEach(function (r) {
            _this.ios.emit(r);
        });
    };
    return MySocket;
}());
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
        destRooms: [rooms[1]]
    },
    "ordered drink": {
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
    }
};
