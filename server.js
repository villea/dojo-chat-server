var io = require("socket.io").listen(80),
     _ = require("underscore"),
     chat = require("./chatManager")


 var userRooms = function (id){
    var rooms = io.sockets.manager.roomClients[id];
  	return chat.getUserRooms(rooms);
 }

io.sockets.on('connection', function (socket) {

  socket.on("login", function (user,errHandler){
  
  try {
  chat.login(socket.id,user);
  } catch (exception){
  	 return errHandler(exception.message);
  }
  socket.set("user",user, function (){
     socket.emit("updateAllRooms",chat.getRooms());
  });


  socket.on("sendMessage", function (data,errHandler) {
       socket.get("user",function (err,user){
         try {
         var message = chat.sendMessage(userRooms(socket.id),user,data);
         io.sockets.in(message.room).emit("receiveMessage",message);
         console.log(chat.messages);
         } catch (exception){
         	return errHandler(exception.message);
         }      
      });
  });

  socket.on("joinRoom",function (room,errHandler){
  	try {

  	chat.join(room,socket.id);	
  	socket.join(room);
    if (chat.isNewRoom(room)){
      io.sockets.emit("updateAllRooms",chat.getRooms());
    }
  	socket.emit("updateJoinedRooms",userRooms(socket.id));
  	io.sockets.in(room).emit("updateUsersInRoom",{
  		room : room,
  		users : chat.roomsAndUsers[room]
  	});
    } catch (exception){
    	return errHandler(exception.message);
    }
  });

  socket.on("leaveRoom", function (room,errHandler){
    try {
    chat.leave(room,socket.id);
    socket.leave(room);
  	socket.emit("updateJoinedRooms",userRooms(socket.id));
  	io.sockets.in(room).emit("updateUsersInRoom",{
  		room : room,
  		users : chat.roomsAndUsers[room]
  	});
    } catch (exception){
    	return errHandler(exception.message);
    }
  })

  socket.on("disconnect", function (){
    chat.disconnect(socket.id);
    console.log(chat.roomsAndUsers);
  })

  });
});