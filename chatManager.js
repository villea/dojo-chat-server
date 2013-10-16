_ = require("underscore");

exports.rooms = [];

exports.users = {};

exports.roomsAndUsers = {}

exports.messages = [];

exports.getUserRooms = function (rooms){
  	return _.chain(rooms).
  	         keys().
  	         filter(function (room){
                return room != "";
  	         }).
  	         map(function (room) {
                return room.slice(1);
  	         }).value();
}

exports.UserAlreadyLoggedException = { message : "USER_ALREADY_LOGGED"};
exports.UsernameTakenException = { message : "USERNAME_TAKEN"};

exports.login = function (id,name){
    if (exports.users[id]){
        throw exports.UserAlreadyLoggedException;
    }
    if (_.contains(_.values(exports.users),name)){
    	throw exports.UsernameTakenException; 
    }
    exports.users[id] = name;
    return name;
}

exports.UserAlreadyInRoomException = { message : "USER_ALREADY_IN_ROOM"}

exports.isNewRoom = function(room){
	return !_.contains(exports.room,room);
}

exports.join = function (room,socketId){
	if (_.contains(exports.roomsAndUsers[room],socketId)){
		throw exports.UserAlreadyInRoomException; 
	}
	if (_.has(exports.roomsAndUsers,room)){
  		exports.roomsAndUsers[room].push(socketId);
  	} else {
  		exports.roomsAndUsers[room] = [socketId];
  	}
}

exports.UserNotInRoomException = {message :"USER_NOT_IN_ROOM"};

exports.sendMessage = function (userRooms,message){
    if (!_.contains(userRooms,message.room)){
         throw exports.UserNotInRoomException;
    }
    var message = {
    	timestamp : new Date().getTime(),
    	room : message.room,
    	message : message.message
        };
    exports.messages.push(message);
    return message;
}


