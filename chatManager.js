_ = require("underscore");

exports.users = {};

exports.roomsAndUsers = {}

exports.messages = [];

exports.getRooms = function (){
  return _.keys(exports.roomsAndUsers) || [];
}

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

exports.UserNotInRoomException = {message :"USER_NOT_IN_ROOM"};

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

exports.leave = function (room,socketId){
  var users = _.filter(exports.roomsAndUsers[room],function (userId){
      return socketId !== userId;
  });
  exports.roomsAndUsers[room] = users;
};

exports.sendMessage = function (userRooms,user,message){
    if (!_.contains(userRooms,message.room)){
         throw exports.UserNotInRoomException;
    }
    var message = {
      sender : user,
    	timestamp : new Date().getTime(),
    	room : message.room,
    	message : message.message
    };
    exports.messages.push(message);
    return message;
}

exports.disconnect = function (id){
  delete exports.users[id];
  _.each(exports.getRooms(), function (room){
     exports.roomsAndUsers[room] = _.filter(exports.roomsAndUsers[room], function (userId){
        return userId !== id;
     });
  })
}

