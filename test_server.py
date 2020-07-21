import json
from flask import Flask, request
app = Flask(__name__)

#_____________________________Information of all players_________________________________
playerInfoDict = {
  "playerOne": 
  {
    "online": False,
    "color": "red",
    "ypos" : 20
  },
  
  "playerTwo": 
  {
    "online": False,
    "color": "blue",
    "ypos" : 20
  }
}

#___________________________________GET commands_________________________________________

#GET all player information
@app.route("/", methods=["GET"])
def sendKeys():
  res = playerInfoDict
  return json.dumps(res), 200

#GET information on a single player
@app.route("/players/<string:username>/", methods=["GET"]) 
def get_player(username):
  player = playerInfoDict.get(username)
  if not player:
    return json.dumps({"success": False, "error": "Username not found"}), 404
  return json.dumps({"success": True, "data": player}), 200

#___________________________________POST commands_________________________________________

#POST testing POST command
@app.route("/", methods = ["POST"])
def bloop():
  return "Bloop!!"

#POST making a player appear online
@app.route("/online/", methods = ["POST"])
def userOnline():
  body = json.loads(request.data)
  user = body["username"]
  playerInfoDict[user]["online"] = True
  return json.dumps({"success": True, "data": body}), 201

#POST adding a player to player info dict
@app.route("/addUser/", methods = ["POST"])
def addUser():
  body = json.loads(request.data)
  newUser = body["username"]
  userInfo = {
    "online": True,
    "color": body["color"],
    "ypos" : 20
  }
  playerInfoDict[newUser] = userInfo
  return json.dumps({"success": True, "data": userInfo}), 201

#POST new y position of a player
@app.route("/updateYPos/", methods=["POST"]) 
def updateYpos():
  body = json.loads(request.data)
  user = body["username"]
  playerInfoDict[user]["ypos"] = body["newYpos"]
  return json.dumps({"success": True, "data": body}), 201

#___________________________________Run the server_________________________________________
if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)