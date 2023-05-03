var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var girl;
var bt, bt_image,btSound;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var girl_running;
var girl_collided;
var girl_jump;

var obstaclesGroup, obstacle1;

var bird, birdImg, birdGroup;

var score=0;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var life=3;

var coin, coin_image;

var gameOver, restart;

function preload(){
  girl_running =   loadAnimation("assets/girl1.png","assets/girl2.png","assets/girl3.png","assets/girl4.png","assets/girl5.png","assets/girl7.png",);
  girl_collided = loadAnimation("assets/girl_crash2.png");
  girl_jump= loadAnimation("assets/girl_jump1.png","assets/girl_jump2.png","assets/girl_jump3.png",);
  bt_image=loadAnimation("assets/bt1.png", "assets/bt2.png", "assets/bt3.png", "assets/bt4.png");
  jungleImage = loadImage("assets/bg.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  btSound=loadSound("assets/bt.wav");
  birdImg= loadAnimation("assets/Bird1.png", "assets/Bird 2.png");
  coin_image= loadImage("assets/heart_1.png");

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
 
  jungle.x = width /2;

  girl = createSprite(50,200,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided", girl_collided);
  
  
  girl.setCollider("circle",0,0,50)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  heart1 = createSprite(camera.position.x+100,50,20,20)
  heart1.visible = false
  heart1.addImage("heart1",heart1Img)
  heart1.scale = 0.2

  heart2 = createSprite(camera.position.x+100,50,20,20)
  heart2.visible = false
  heart2.addImage("heart2",heart2Img)
  heart2.scale = 0.2

  heart3 = createSprite(camera.position.x+100 ,50,20,20)
  heart3.addImage("heart3",heart3Img)
  heart3.visible= true;
  heart3.scale = 0.2

  gameOver.visible = false;
  restart.visible = false;
  
  
  btGroup = new Group();
  obstaclesGroup = new Group();
  birdGroup= new Group();
  coinGroup= new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  girl.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-4

    if(jungle.x<100)
    {
       jungle.x=1500
    }
   console.log(girl.y)

   if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  if(life===0){
    gameState = END;
    
  }

    if(keyDown("space")&& girl.y>270) {
      girl.changeAnimation("jump",girl_jump);
      jumpSound.play();
      girl.velocityY = -16;
    }
  
    girl.velocityY = girl.velocityY + 0.8
    spawnbt();
    spawnObstacles();
    spawnBirds();
    spawnCoin();

    girl.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(girl)){
      collidedSound.play();
      
      for(var i=0; i<obstaclesGroup.length; i++){
        if(obstaclesGroup[i].isTouching(girl)){
          obstaclesGroup[i].destroy();
          life=life-1
        }
      }
    
    }

    if(birdGroup.isTouching(girl)){
      collidedSound.play();
      
      for(var j=0; j<birdGroup.length; j++){
        if(birdGroup[j].isTouching(girl)){
          birdGroup[j].destroy();
          life=life-1
        }
      }
    
    }

    if(coinGroup.isTouching(girl)){
      btSound.play();
      
      for(var h=0; h<coinGroup.length; h++){
        if(coinGroup[h].isTouching(girl)){
          coinGroup[h].destroy();
          if(life<3){
            life=life+1;
          }
          
        }
      }
    
    }

    if(btGroup.isTouching(girl)){
      btSound.play();
      score = score + 1;
      btGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    gameOver.y= camera.position.y+10;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    girl.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    btGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);

    heart1.visible = false;
    heart3.visible = false;
    heart2.visible = false;

    girl.changeAnimation("collided",girl_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    btGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    btGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);

    girl.changeAnimation("collided",girl_collided);

    obstaclesGroup.setLifetimeEach(-1);
    btGroup.setLifetimeEach(-1);
    birdGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 10){
    girl.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnbt() {
 
  if (frameCount % 150 === 0) {

    var bt = createSprite(camera.position.x+500,random(100,200),40,10);

    bt.velocityX = -(6 + 3*score/100)
    bt.scale = 0.4;

    bt.addAnimation("bt", bt_image);
   
       
    bt.lifetime = 400;
    
    bt.setCollider("rectangle",0,0,bt.width/2,bt.height/2)
    btGroup.add(bt);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function spawnCoin() {
  if(frameCount % 120 === 0) {

    var coin = createSprite(camera.position.x+random(380,400),random(150,300),40,40);
    coin.setCollider("rectangle",0,0,200,200)
    coin.addImage(coin_image);
    coin.velocityX = -(6 + 3*score/100)
    coin.scale = 0.2;      

    coin.lifetime = 400;
    coinGroup.add(coin);
    
  }
}

function spawnBirds(){
  if(frameCount%150===0){
      var bird= createSprite(camera.position.x+650,random(100,150),10,10);
      bird.addAnimation("bird",birdImg);
      bird.scale= 0.2;
      bird.velocityX= -(6+3*score/100);
      bird.lifetime= 300;
      //bird.debug= true;
      bird.setCollider("rectangle",0,0,250,100)
      birdGroup.add(bird);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.visible = true;
  girl.changeAnimation("running",
               girl_running);
  obstaclesGroup.destroyEach();
  btGroup.destroyEach();
  score = 0;
  life=3;
} 

