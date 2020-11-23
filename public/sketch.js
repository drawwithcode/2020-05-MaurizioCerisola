<<<<<<< HEAD
let socket = io(); //we are loading socket.io
let myColor = "white";
let windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2), 0.5);

//Input sockets
socket.on("connect", newConnection); //note that the syntax is similar but different wrt the server
socket.on("mouseBroadcast", drawOtherMouse);
socket.on("color", setColor);

function newConnection() {
  console.log("your id: " + socket.id);
}

function drawOtherMouse(data){
  push();
  fill(data.color);
  ellipse(data.x, data.y, windowDiagonal/200);
  pop();
}

function setColor(assignedColor){
  myColor =assignedColor;
}




=======
>>>>>>> parent of ff876fb... Restored last node project
function preload(){
  // put preload code here
}

function setup() {
  createCanvas(windowWidth,windowHeight)
  // put setup code here
}

function draw() {
  background("purple");
  // put drawing code here
}
<<<<<<< HEAD

function mouseMoved() {
  push();
  fill(myColor);
  ellipse(mouseX, mouseY, windowDiagonal/200);
  pop();
  //create the message (as an object)
  let message = {
    x: mouseX,
    y: mouseY,
    color: myColor,
  };
  //send the message
  socket.emit("mouse", message);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
=======
>>>>>>> parent of ff876fb... Restored last node project
