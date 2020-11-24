console.log("node is running")

//Set Up
let express = require("express"); //laod express
let socket = require("socket.io"); //load socket.io
let app = express(); //execute express
let port = process.env.PORT || 3000;
let server = app.listen(port); //start the server
app.use(express.static("public")); //we are saying to express to use the folder "public"
let io = socket(server); //we enable the server to receive and send messages to the clients


let ids = [];
let colors =[];


io.on("connection", newConnection);

function newConnection(socket) {
  console.log("new connection: " + socket.client.id);

  //ids
  socket.emit("yourId", socket.client.id);
  ids.push(socket.client.id);
  io.emit("clientsIds", ids);

  //colors
  let clientColor = getRandomColor();
  colors.push(clientColor);
  io.emit("clientsColors", colors);

  //disconnection
  socket.on('disconnect', function () {
    console.log("disconnection: "+ socket.client.id);
    //Search index
    let index;
    for(let i=0; i<ids.length; i++) {
      if(ids[i]==socket.client.id) {
        index=i;
      }
    }
    //update ids and colors
    ids.splice(index,1);
    colors.splice(index,1);
    //broadcast updates
    io.emit("clientDisconnection", index);
  });

  //mouse
  socket.on("mouse", function (dataReceived){
    io.emit("mouseBroadcast", dataReceived);
  });

}

 function getRandomColor() {
   var letters = "0123456789ABCDEF"; //length = 16
   var color = "#";
   for (var i=0; i<6; i++){
     color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
 }
