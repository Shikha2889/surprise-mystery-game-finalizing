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
  //get the code from epic archery
}

/*function startgame(){
  vidElement.show();
  vidElement.play(); // Play the video
}*/

