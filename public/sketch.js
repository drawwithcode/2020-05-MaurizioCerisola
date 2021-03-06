let socket = io(); //we are loading socket.io
let windowDiagonal = 200;
let ellipseDiameter = 20;
let backgroundColor = "black"
let memory = 10;
let id;
let ids=[];
let colors=[];
let oldMouseXs = [[]];
let oldMouseYs = [[]];
let overlapX = [0];
let overlapY = [0];
let overlapColor = [backgroundColor];

socket.on("yourId", setId);
socket.on("clientsIds", setIds);
socket.on("clientsColors", setColors);
socket.on("clientDisconnection", manageDisconnection);
socket.on("mouseBroadcast", drawMouse);



function setId(serverId) {
  id=serverId;
}
function setIds(serverIds) {
  ids = serverIds;
  while (oldMouseXs.length<ids.length) {
      oldMouseXs.push([0]);
      oldMouseYs.push([0]);
  }
}
function setColors(serverColors){
  colors=serverColors;
}
function manageDisconnection(index) {
  //update data structures
  ids.splice(index,1);
  colors.splice(index,1);
  oldMouseXs.splice(index,1);
  oldMouseYs.splice(index,1);
  //draw()
  background(backgroundColor);
  //Draw ellipses
  for(let i=0; i<ids.length; i++) {
    push();
    fill(colors[i]);
    for(let j=0; j<oldMouseXs[i].length; j++) {
      ellipse(oldMouseXs[i][j], oldMouseYs[i][j], ellipseDiameter);
    }
    pop();
  }
  //Draw overlaps
  for(let i=0; i<overlapX.length; i++){
    push();
    fill(overlapColor[i]);
    star(overlapX[i], overlapY[i], ellipseDiameter/7*3/2, ellipseDiameter/2, 5);
    pop();
  }
}
function drawMouse(data){
  background(backgroundColor);
  //map movements
  let x = map(data.x,0,1,0,windowWidth);
  let y = map(data.y,0,1,0,windowHeight);
  //Search index
  let index;
  for(let i=0; i<ids.length; i++) {
    if (data.id==ids[i]){
      index=i;
    }
  }
  //Check for overlaps
  let overlap = false;
  for(let i=0; i<ids.length; i++) {
    if (data.id!=ids[i]){
      for(let j=0; j<oldMouseXs[i].length; j++) {
        let distance_data_oldMouse = pow(pow(x-oldMouseXs[i][j],2)+pow(y-oldMouseYs[i][j],2),0.5);
        let distance_data_lastOverlap = pow(pow(x-overlapX[0],2)+pow(y-overlapY[0],2),0.5);
        if (distance_data_oldMouse<ellipseDiameter/2 && distance_data_lastOverlap>ellipseDiameter/2) {
          overlap=true;
          //remove that point from the array so that it will not be displayed
          oldMouseXs[i].splice(j,1);
          oldMouseYs[i].splice(j,1);
          let c = lerpColor(color(colors[index]),color(colors[i]),0.5);
          overlapColor.unshift(c);
          overlapX.unshift(x);
          overlapY.unshift(y);
        }
      }
    }
  }
  //Add latest mouse position
  if(!overlap) {
    oldMouseXs[index].unshift(x);
    oldMouseYs[index].unshift(y);
  }
  //Draw ellipses
  for(let i=0; i<ids.length; i++) {
    push();
    fill(colors[i]);
    for(let j=0; j<oldMouseXs[i].length; j++) {
      ellipse(oldMouseXs[i][j], oldMouseYs[i][j], ellipseDiameter);
    }
    pop();
  }
  //Draw overlaps
  for(let i=0; i<overlapX.length; i++){
    push();
    fill(overlapColor[i]);
    star(overlapX[i], overlapY[i], ellipseDiameter/7*3/2, ellipseDiameter/2, 5);
    pop();
  }
  //Delete oldest points
  if(oldMouseXs[index].length>memory) {
    oldMouseXs[index].pop();
    oldMouseYs[index].pop();
  }
  //bound on the overlap points memory
  if(overlapX.length>100*memory) {
    overlapX.pop();
    overlapY.pop();
    overlapColor.pop();
  }
}


function preload(){
  // put preload code here
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  background(backgroundColor);
  noStroke();
  //initialize parameters
  windowDiagonal = pow(pow(windowHeight,2)+pow(windowWidth,2),0.5);
  ellipseDiameter = windowDiagonal/40;
}
function draw() {
  // write instructions
  push();
  textSize(windowDiagonal/50);
  textAlign(CENTER);
  fill("white");
  textFont("Comic Sans MS");
  text("Join forces to create a permanent pattern!", windowWidth/2, windowHeight/8);
  pop();
}


function mouseMoved() {
  //create the message (as an object)
  let x = map(mouseX,0,windowWidth,0,1);
  let y = map(mouseY,0,windowHeight,0,1);
  let message = {
    id: id,
    x: x,
    y: y,
  };
  //send the message
  socket.emit("mouse", message);
}
// references: https://p5js.org/examples/form-star.html
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
