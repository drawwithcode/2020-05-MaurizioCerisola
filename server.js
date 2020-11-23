console.log("node is running")

//Set Up
let express = require("express"); //laod express
let socket = require("socket.io"); //load socket.io
let app = express(); //execute express
let port = 3000;
let server = app.listen(port); //start the server
app.use(express.static("public")); //we are saying to express to use the folder "public"
let io = socket(server); //we enable the server to receive and send messages to the clients


let ids = [];
let colors =[];


io.on("connection", newConnection);

function newConnection(socket) {
  console.log("new connection: " + socket.client.id);
  socket.emit("yourId", socket.client.id);
  ids.push(socket.client.id);
  io.emit("clientsIds", ids);



  let clientColor = getRandomColor();
  colors.push(clientColor);
  io.emit("clientsColors", colors);

  socket.on("mouse", mouseMessage);

  function mouseMessage(dataReceived){
    //console.log(socket.client.id, dataReceived);
    io.emit("mouseBroadcast", dataReceived); //broadcast this information to everyone except from the one who sent it
  }
}

 function getRandomColor() {
   var letters = "0123456789ABCDEF"; //length = 16
   var color = "#";
   for (var i=0; i<6; i++){
     color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
 }
