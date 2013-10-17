var assert = require("assert"),
    chatManager = require("../chatManager")

var rightMessage = function (message){
	return function (err){
		return err.message === message;
	}
}

describe("chatManager", function (){

  beforeEach(function (){
  	 chatManager.users = {};
  	 chatManager.roomsAndUsers = {};
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

  describe("#sendMessage", function (){

  })

})