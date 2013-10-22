var assert = require("assert"),
    chatManager = require("../chatManager"),
    _ = require("underscore");

var rightMessage = function (message){
	return function (err){
		return err.message === message;
	}
}

describe("chatManager", function (){

  beforeEach(function (){
  	 chatManager.users = {};
  	 chatManager.roomsAndUsers = {};
     chatManager.messages = [];
  })

  describe("#getUserRooms",function (){
  	 it("should convert rooms object to list of rooms without '/' and skip empty room name", function (){
  	 	var roomsObj = {"":true,
  	                    "/music":true};
  	 	var userRooms = chatManager.getUserRooms(roomsObj);
  	 	assert.equal(1,userRooms.length);
  	 	assert.equal("music",userRooms[0]);
  	 })
  })

  describe("#getUsersInRoom", function (){
    it("should return the users names in the room", function(){
      chatManager.login("1","user");
      chatManager.join("music","1");
      chatManager.login("2","user2");
      chatManager.join("music","2");
      chatManager.login("3","user3");
      chatManager.join("music","3");

      var users = chatManager.getUsersInRoom("music");

      assert.equal(3, users.length);
      assert.equal(true, _.contains(users,"user"));
      assert.equal(true, _.contains(users,"user2"));
      assert.equal(true, _.contains(users,"user3"));
    })

  })
	
  describe("#login", function (){
  	it("should return username", function (){
  		assert.equal(chatManager.login("1","user"), "user");
  	})
    it("should add user to users object",function (){
    	chatManager.login("1","user");
    	assert.equal(chatManager.users["1"],"user");
    })
    it("should throw USER_ALREADY_LOGGED if called multiple times", function (){
    	assert.throws( function (){
    		chatManager.login("1","user");
    	  chatManager.login("1","user");
    	},rightMessage("USER_ALREADY_LOGGED"));
    })
    it("should throw USERNAME_TAKEN if name is taken", function (){
    	assert.throws( function (){
    		chatManager.login("1","user");
    	  chatManager.login("2","user");
    	}, rightMessage("USERNAME_TAKEN"));
    })

  })

  describe("#join", function (){

  	it("should add user id to the chatManager.roomAndUsers",function (){
  		chatManager.login("1","user");
  		chatManager.join("music","1");
  		assert.equal("1",chatManager.roomsAndUsers["music"][0])
  	})


  	it("should throw USER_ALREADY_IN_ROOM if user is already in room",function (){
  		assert.throws(function (){
  		chatManager.login("1","user");
  		chatManager.join("music","1");
  		chatManager.join("music","1");
  		}, rightMessage("USER_ALREADY_IN_ROOM"))
  	})
  })

  describe("#disconnect", function (){
      
    it("should remove user from chatManager.user object", function (){
      chatManager.login("1","user");
      chatManager.disconnect("1");
      assert.equal(0,_.keys(chatManager.users).length);
    })

    it("should remove user from chatManager.roomsAndUsers", function (){
      chatManager.login("1","user");
      chatManager.login("2","user2");
      chatManager.join("music","1");
      chatManager.join("music","2");
      chatManager.join("kettula","1");
      chatManager.join("kettula","2");
      
      chatManager.disconnect("1");
    

      assert.equal("2",chatManager.roomsAndUsers["music"][0])
      assert.equal("2",chatManager.roomsAndUsers["kettula"][0])
    })

  })

  describe("#sendMessage", function (){

    it("should add message to chat.messages", function (){
      chatManager.login("1","user");
      chatManager.join("music","1");
      var message = { room : "music", message : "heppa"}
      chatManager.sendMessage(["music"],"user",message);
      assert.equal(1,chatManager.messages.length);
    })

    it("should throw USER_NOT_IN_ROOM if user is not in room", function (){
      var message = { room : "music", message : "heppa"}
      assert.throws(function (){
      chatManager.sendMessage(["kissala"],"user",message);
      }, rightMessage("USER_NOT_IN_ROOM"));
    })

  })

  describe("#leave", function (){
    it("should remove user from desired room from chat.roomsAndUsers", function (){
      chatManager.login("1","user");
      chatManager.join("music","1");
      chatManager.login("2","user2");
      chatManager.join("music","2");
      assert.equal(2,chatManager.roomsAndUsers["music"].length);
      chatManager.leave("music","1");
      assert.equal(1,chatManager.roomsAndUsers["music"].length);
      assert.equal("2",chatManager.roomsAndUsers["music"][0]);
    })
    it("should not remove user from any other room from chat.roomsAndUsers", function (){
      chatManager.login("1","user");
      chatManager.login("2","user2");

      chatManager.join("music","1");
      chatManager.join("music","2");
      chatManager.join("715517","1");
      chatManager.join("715517","2");
      chatManager.join("foobar","1");
      chatManager.join("foobar","2");

      chatManager.leave("715517","1");
      assert.equal(2,chatManager.roomsAndUsers["music"].length);
      assert.equal(1,chatManager.roomsAndUsers["715517"].length);
      assert.equal(2,chatManager.roomsAndUsers["foobar"].length);
    })

  })

})