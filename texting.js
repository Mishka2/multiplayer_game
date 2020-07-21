
//Canvas dimensions and object
var myGameArea;
var canvasHeight = 600;
var canvasWidth = 800;
var canvas_obj = document.getElementById("canvas");
var context_obj = canvas_obj.getContext("2d");

//the two players' pieces
var ownBlock;
var opponentBlock;

//names of the two player's pieces
var username;
var opponent;

//Y position of the opponent
var opponentYPos;

//load game when website loads
function loadGame(){
  myGameArea.start();
}

//Wait for the button to be pressed
function setYourOwnPlayer() {
    myGameArea.start();
    document.body.style.backgroundColor = "#afebf0";
    sendJSON();
}

//set up information for yourself to be a player
function sendJSON(){
  username = document.getElementById("myUsername").value;

  //look for username in the server
  var request = new XMLHttpRequest();
  request.open('GET', "http://0.0.0.0:5000/players/" + username, true);
  request.onreadystatechange = function() {
    //if username is found in the server
    if (request.readyState == 4 && request.status == 200){
        var parsed = JSON.parse(this.responseText);
        ownBlock = new ownBlockObject(parsed.data.color);
        markSelfOnline();

    //if username is not found in the server
    } else if (request.readyState == 4){
        let xhr = new XMLHttpRequest();
        let url = "http://0.0.0.0:5000/addUser/"; 
        xhr.open("POST", url, true);
        var data = JSON.stringify({ "username": username, "color": "yellow" });

        xhr.send(data);
        alert("Created player " + username);
        markSelfOnline();
    }
  };
  request.send();
}

//make yourself appear online on the server
function markSelfOnline(){
  var xhr = new XMLHttpRequest();
  let url = "http://0.0.0.0:5000/online/"; 
  xhr.open("POST", url, true);

  var data = JSON.stringify({ "username": username });
  xhr.send(data);
}

//connect your screen to the other player
function connectToOtherPlayer(){
  opponent = document.getElementById("opponentUsername").value;

  var request = new XMLHttpRequest();
  request.open('GET', "http://0.0.0.0:5000/players/" + opponent, true);
  request.onreadystatechange = function() {
    //if username is found
    if (request.readyState == 4 && request.status == 200){
        var parsed = JSON.parse(this.responseText);
        if(parsed.data.online == true){
          opponentBlock = new opponentBlockObject(parsed.data.color);
        } else {
          alert("Player not online! Try again soon.")
        }

    //if username is not found
    } else if (request.readyState == 4){
        alert("No players of that name")  
    }
  };
  request.send();
}


//update screen
function updateGameArea() {
  myGameArea.clear();
  if(ownBlock){
    ownBlock.update();
    document.onkeydown = checkKey;
  }
  if(opponentBlock != null){
    updateOpponent();
    console.log("updating opponent...");
    opponentBlock.update();
    console.log("opponent ypos: " + String(opponentBlock.ypos));
  } 
}

//check for key press
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
      ownBlock.ypos -= 10;
  }
  else if (e.keyCode == '40') {
      ownBlock.ypos += 10;
  }
  updateServerPosition();
}

//update your imformation on the server
function updateServerPosition(){
    var xhr2 = new XMLHttpRequest();
    let url2 = "http://0.0.0.0:5000/updateYPos/"; 
    xhr2.open("POST", url2, true);

    var data2 = JSON.stringify({ "username": username, "newYpos": ownBlock.ypos });
    xhr2.send(data2);
}

//game area object
var myGameArea = {
  canvas: document.getElementById("canvas"),
  start: function () {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;

      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);

      this.interval = setInterval(updateGameArea, 100);
  },
  clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

//object that holds data for your own block
function ownBlockObject(color) {
  this.color = color;
  this.ypos = 20;
  this.update = function () {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = this.color;
    ctx.fillRect(20, this.ypos, 20, 100);
  }
}

//object that holds data for the opponent's block
function opponentBlockObject(color) {
  this.color = color;
  this.ypos = 20;
  this.update = function () {
    this.ypos = opponentYPos;
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = this.color;
    ctx.fillRect(canvasWidth-40, this.ypos, 20, 100);
  }
}

//updates opponent's ypos in the server
function updateOpponent() {

  var request = new XMLHttpRequest();
  request.open('GET', "http://0.0.0.0:5000/players/" + opponent, true);
  request.onreadystatechange = function() {
    //if username is found
    if (request.readyState == 4 && request.status == 200){
        console.log("Response text for opponent: " + this.responseText);
        var parsed = JSON.parse(this.responseText);
        opponentYPos = parsed.data.ypos;
    }
  };
  request.send();

}
