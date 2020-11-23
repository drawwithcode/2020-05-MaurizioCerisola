console.log("node is running")

//Start the server
let express = require("express"); //laod express
let socket = require("socket.io"); //load socket.io
let app = express(); //execute express
let port = 3000;
let server = app.listen(port); //start the server
//Set up express
app.use(express.static("public")); //we are saying to express to use the folder "public"
//Set up socket.io
let io = socket(server); //we enable the server to receive and send messages to the clients

//Event: New connection
io.on("connection", newConnection); //when there is a message called "connection" execute a function called "newConnection"

function newConnection(socket) {
  console.log("new connection: " + socket.client.id); //socket.client.id by default contains the ip adress of the new connection

  let clientColor = getRandomColor(); //get a random color for the new connection
  socket.emit("color", clientColor);

  socket.on("mouse", mouseMessage); //for each client, if you get any connection called "mouse", execute "mouseMessage"
  // mouse is a customized name, we can name it how we want
  function mouseMessage(dataReceived){
    console.log(socket.client.id, dataReceived);
    socket.broadcast.emit("mouseBroadcast", dataReceived); //broadcast this information to everyone except from the one who sent it
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
