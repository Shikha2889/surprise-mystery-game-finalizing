var forest, bgImg
var boy, boyWalkingRight, boyWalkingLeft, boyStandingRight, boyStandingLeft
var button
var rules, paper
var hotel, hotel_image
var isTeleported = false
var addAccessToBasement = false
var reception, reception_bg
var key, lockpick, guestbook
var noteImg
var hiddenRoom, hiddenRoom_image
var startButton
var endOfReception
var basement, basement_image
var lockpick
var startButton_image

var gameState = "Start"
var isVideoPlaying = false;

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase, playerArcher;
var computer, computerBase, computerArcher;
var playerArrows = [];
var computerArrows = [];
var playerArcherLife = 3;
var computerArcherLife = 3;
var computerCollision

function preload() {
  bgImg = loadImage('../assets/forestBg.jpeg')
  boyWalkingRight = loadAnimation(
    '../assets/boy_right/boy_walking_right (4).png',
    '../assets/boy_right/boy_walking_right (5).png',
    '../assets/boy_right/boy_walking_right (6).png',
    '../assets/boy_right/boy_walking_right (7).png',
    '../assets/boy_right/boy_walking_right (8).png',
    '../assets/boy_right/boy_walking_right (9).png')
  boyWalkingLeft = loadAnimation(
    '../assets/boy_left/boy_walking_left (1).png',
    '../assets/boy_left/boy_walking_left (2).png',
    '../assets/boy_left/boy_walking_left (3).png',
    '../assets/boy_left/boy_walking_left (4).png',
    '../assets/boy_left/boy_walking_left (5).png',
    '../assets/boy_left/boy_walking_left (6).png');
  boyStandingRight = loadImage('../assets/boy_right/boy_walking_right (8).png')
  boyStandingLeft = loadImage('../assets/boy_left/boy_walking_left (5).png')
  rules = loadImage('../assets/paper_bg.png')
  hotel_image = loadImage('../assets/hotel.png')
  reception_bg = loadImage('../assets/reception.jpg')
  keyImg = loadImage('../assets/key.png')
  noteImg = loadImage('../assets/paper_bg.png')
  hiddenRoom_image = loadImage('../assets/room_selection.jpg')
  hotel_room = loadImage('../assets/hotel_room.jpg')
  splashImg = createImg('../assets/Adventure Games.gif')
  basement_image = loadImage('../assets/basement.jpeg')
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 /* vidElement = createVideo("../assets/AdventureGames.mp4");
  vidElement.position(0, 0); // Set the position to (0, 0) to start from the top-left corner
  vidElement.size(windowWidth, windowHeight); // Set the size to match the window dimensions
  vidElement.play() */
  
  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, random(450, height - 300), 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  computerBase = new ComputerBase(
    width - 300,
    random(450, height - 300),
    180,
    150
  );
  computer = new Computer(
    width - 280,
    computerBase.body.position.y - 153,
    50,
    180
  );

  computerArcher = new ComputerArcher(
    width - 350,
    computerBase.body.position.y - 180,
    120,
    120
  );
  handleComputerArcher();
 
  boy = createSprite(50, 400, 30, 30)
  boy.addImage("standingR", boyStandingRight)
  boy.addAnimation("walkingR", boyWalkingRight)
  boy.addImage("standingL", boyStandingLeft)
  boy.addAnimation("walkingL", boyWalkingLeft)

  button = createButton('Rules');
  button.position(20, 20);
  button.mousePressed(changeBG);
  button.size(100, 50)

  closeButton = createButton('Close Rules');
  closeButton.position(20, 85);
  closeButton.mousePressed(closeRules);
  closeButton.size(100, 50)
  closeButton.hide();

  startButton = createImg('../assets/startButtonImg.png')
  startButton.position(width/2- 200,height/2+ 200);
  startButton.size(400,100)
  startButton.mouseClicked(changeState)

  paper = createSprite(width / 2, height / 2, 30, 30)
  paper.visible = false
  paper.addImage('rules', rules)

  hotel = createSprite(width - 100, height / 2, 50, 50)
  hotel.addImage("hotel", hotel_image)
  hotel.scale = 0.3

  reception = createSprite(width / 2, height / 2, 30, 30)

  key = createSprite(width / 2, height / 2, 20, 20)
  key.addImage("key", keyImg)
  key.visible = false
  key.scale = 0.03

  guestbook = createSprite(width / 2 + 100, height / 2, 20, 20)
  guestbook.visible = false

  hiddenRoom = createSprite(width - 100, height / 2, 20, 20)
  hiddenRoom.visible = false
  hiddenRoom.addImage(hiddenRoom_image)

  lockpick = createSprite(300, height/2 + 110, 20, 20)

  endOfReception = createSprite(width, height/2, 20, 20)
  basement = createSprite(endOfReception.x, endOfReception.y, 40, 40)
  basement.addImage("basement", basement_image)
  basement.visible = false

  drawSprites();
}

function draw() {
  if(gameState=="Start") {
    splashImg.position(50, 50)
    
  }
  if (!isTeleported && gameState == "Play") {
    background(bgImg);
    reception.visible = false;
    lockpick.visible = false;
    startButton.hide()
    if (keyDown('d')) {
      boy.changeAnimation("walkingR", boyWalkingRight)
      boy.x = boy.x + 7
      boy.scale = 1
    }
    if (keyDown('a')) {
      boy.changeAnimation("walkingL", boyWalkingLeft)
      boy.x = boy.x - 7
      boy.scale = 0.15
    }
    if (boy.isTouching(hotel)) {
      teleportToHotel()
    }
    drawSprites();
  }
  else if(boy.isTeleported && gameState=="Play"){
    background(reception_bg);
    if (keyDown('d')) {
      boy.changeAnimation("walkingR", boyWalkingRight)
      boy.x = boy.x + 7
      boy.scale = 2
    }
    if (keyDown('a')) {
      boy.changeAnimation("walkingL", boyWalkingLeft)
      boy.x = boy.x - 7
      boy.scale = 0.3
    }
    if (boy.overlap(guestbook)) {
      showNote()
    }
    drawSprites();
  }
  else if (boy.isTouching(endOfReception) && gameState==="Play") {
    openHiddenRoom(hiddenRoom_image);
    background();
    if (keyDown('d')) {
      boy.changeAnimation("walkingR", boyWalkingRight)
      boy.x = boy.x + 7
      boy.scale = 2
    }
    if (keyDown('a')) {
      boy.changeAnimation("walkingL", boyWalkingLeft)
      boy.x = boy.x - 7
      boy.scale = 0.3
    }
  }
  else if (boy.isTouching(lockpick) && gameState==="Play" && boy.isTouching(basement)) {
    background(basement_image);
    if (keyDown('d')) {
      boy.changeAnimation("walkingR", boyWalkingRight)
      boy.x = boy.x + 7
      boy.scale = 2
    }
    if (keyDown('a')) {
      boy.changeAnimation("walkingL", boyWalkingLeft)
      boy.x = boy.x - 7
      boy.scale = 0.3
    }
  }
}

function changeBG() {
  paper.visible = true
  closeButton.show()
}

function changeState() {
  gameState = "Play"
  console.log(gameState)
  startButton.hide()
  splashImg.hide()
}

function teleportToHotel() {
  isTeleported = true
  boy.x = 100
  boy.y = height / 2 + 100
  boy.scale = 2
  hotel.visible = false
  hotel.x = width - 100
  hotel.y = height - 100
  hotel.scale = 0.3
}

function closeRules() {
  paper.visible = false
}

function showNote() {
  var note = createSprite(width / 2, height / 2, 20, 20)
  note.visible = true
  note.addImage('note', noteImg)
  note.scale = 1
  note.x = width / 2 - 100
  note.y = height / 2 - 100
  guestbook.visible = false
  var message = "Hello Adventurer! Take the key and walk towards your right hand side!"
  var dialogueBox = createDiv(message)
  dialogueBox.addClass("dialogue")

  setTimeout(function () {
    note.visible = false
    key.visible = true
    key.depth = note.depth + 1
  }, 3000)
}

function openHiddenRoom() {
  key.visible = false
  hiddenRoom.visible = true
}

function findLockpick(){
  if (boy.isTouching(lockpick)){
    boy.addAccessToBasement = true
  }
}

function basement(){
  if(addAccessToBasement === true){
    bossFight();
  }
}

function bossFight(){
  background(backgroundImg);

  Engine.update(engine);

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  for (var i = 0; i < playerArrows.length; i++) {
    showArrows(i, playerArrows);
  }

  playerBase.display();
  player.display();
  player.life();
  playerArcher.display();
  handlePlayerArrowCollision();

  for (var i = 0; i < computerArrows.length; i++) {
    showArrows(i, computerArrows);
  }

  computerBase.display();
  computer.display();
  computer.life();
  computerArcher.display();
  handleComputerArrowCollision();
}

function keyPressed() {
  if (keyCode === 32) {
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle;

    var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function showArrows(index, arrows) {
  arrows[index].display();
  if (
    arrows[index].body.position.x > width ||
    arrows[index].body.position.y > height
  ) {
    if (!arrows[index].isRemoved) {
      arrows[index].remove(index, arrows);
    } else {
      arrows[index].trajectory = [];
    }
  }
}

function handleComputerArcher() {
  if (!computerArcher.collapse && !playerArcher.collapse) {
    setTimeout(() => {
      var pos = computerArcher.body.position;
      var angle = computerArcher.body.angle;
      var moves = ["UP", "DOWN"];
      var move = random(moves);
      var angleValue;

      if (move === "UP" && computerArcher.body.angle < 1.87) {
        angleValue = 0.1;
      }else{
          angleValue = -0.1;
      }
      if(move === "DOWN" && computerArcher.body.angle > 1.47) {
        angleValue = -0.1;
      }else{
          angleValue = 0.1;
      }
      
      angle += angleValue;

      var arrow = new ComputerArrow(pos.x, pos.y, 100, 10, angle);

      Matter.Body.setAngle(computerArcher.body, angle);
      Matter.Body.setAngle(computerArcher.body, angle);

      computerArrows.push(arrow);
      setTimeout(() => {
        computerArrows[computerArrows.length - 1].shoot(angle);
      }, 100);

      handleComputerArcher();
    }, 2000);
  }
}

function handlePlayerArrowCollision() {
  for (var i = 0; i < playerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerBase.body
    );

     var computerCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computer.body
    );

    var computerArcherCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerArcher.body
    );

    if (
      baseCollision.collided ||
      computerArcherCollision.collided ||
      computerCollision.collided
    ) {

      /**Update the code here so that computer life 
      reduces if player's arrow hits the target***/
      computerArcherLife -= 1;
      computer.reduceLife(computerArcherLife);

      if (computerArcherLife <= 0) {
        computerArcher.collapse = true;
        Matter.Body.setStatic(computerArcher.body, false);
        Matter.Body.setStatic(computer.body, false);
        Matter.Body.setPosition(computer.body, {
          x: width - 100,
          y: computer.body.position.y
        });
      }
    }
  }
}

function handleComputerArrowCollision() {
  for (var i = 0; i < computerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerBase.body
    );

    var playerCollision = Matter.SAT.collides(
      computerArrows[i].body,
      player.body
    );

    var playerArcherCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerArcher.body
    );

    if (
      baseCollision.collided ||
      playerCollision.collided||
      playerArcherCollision.collided
    ) {
      playerArcherLife -= 1;
      player.reduceLife(playerArcherLife);
      if (playerArcherLife <= 0) {
        playerArcher.collapse = true;
        Matter.Body.setStatic(playerArcher.body, false);
        Matter.Body.setStatic(player.body, false);
        Matter.Body.setPosition(player.body, {
          x: 100,
          y: player.body.position.y
        });
      }
    }
  }
}

/*function startgame(){
  vidElement.show();
  vidElement.play(); // Play the video
}*/

