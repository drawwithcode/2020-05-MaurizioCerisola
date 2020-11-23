console.log("node is running");


let express = require("express"); //laod the piece of code called "express" and place it in the variable express
//let socket = require("socket.io");
let app = express(); //execute express
let port = 3000; //standard number, this is the port we will use for our project
let server = app.listen(port); //start the server

app.use(express.static("public")); //we are saying to express to use the folder "public"
