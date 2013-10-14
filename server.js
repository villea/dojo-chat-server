var io = require("socket.io").listen(80),
     _ = require("underscore");


var messages = [];

var rooms = ["music","videos","pics","coding"];

var users = [];



io.sockets.on('connection', function (socket) {
  
  var userRooms = function (id){
    var rooms = io.sockets.manager.roomClients[id];
  	return _.chain(rooms).
  	         keys().
  	         filter(function (room){
                return room != "";
  	         }).
  	         map(function (room) {
                return room.slice(1);
  	         }).value();
  }

  socket.on("login", function (user){
  
  socket.set("user",user, function (){
     users.push({id: socket.id,
  	          user : user});
     console.log(users);
     socket.emit("updateUsers",users);
     socket.emit("updateRooms",rooms);
  });


  socket.on("sendMessage", function (data,errHandler) {
       socket.get("user",function (err,user){
         var room = data.room;
         if (!_.contains(userRooms(socket.id),room)){
             return errHandler("not_in_room");
         }
         data.date = new Date();
         data.sender = user;
         messages.push(data);
         io.sockets.in(room).emit("updateMessages",data);
         console.log(messages);
      });
  });

  socket.on("join",function (room){
  	socket.join(room);
  	console.log(userRooms(socket.id));
  })

  });
});