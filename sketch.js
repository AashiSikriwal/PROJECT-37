//Create variables here
var dog,happyDog,database, foodS, foodStock;
var dogSprite,ground;
var fedTime,lastFed,feed,addFood,foodObj;
var currentTime,gameState,readState;
var bedroom,garden,washroom;

function preload()
{
  //load images here
  dog1=loadImage("images/Dog.png");
  happyDog=loadImage("images/Happy.png")
  bedroon=loadImage("images/bedRoom.png")
  garden=loadImage("images/Garden.png")
  washroom=loadImage("images/washRoom.png")

}

function setup() {
  database=firebase.database();
  createCanvas(600,600);
   foodObj=new Food()
   foodStock=database.ref('Food');
   foodStock.on("value",readStock);
   
   
   fedTime=database.ref('FeedTime'); 
   fedTime.on("value",function(data){ 
     lastFed=data.val();
     });
    //read game state from database 
    readState=database.ref('gameState'); 
    readState.on("value",function(data){ 
      gameState=data.val(); 
    });
     dog=createSprite(200,400,150,150); 
     dog.addImage(dog1);
      dog.scale=0.15; 
      feed=createButton("Feed the dog");
       feed.position(700,95); 
       feed.mousePressed(feedDog); 
       addFood=createButton("Add Food"); 
       addFood.position(800,95); 
       addFood.mousePressed(addFoods);
  
}


function draw() {  
  background("lightgreen")
  
  foodObj.display();
  currentTime=hour(); 
  if(currentTime==(lastFed+1)){
     update("Playing");
      foodObj.garden();
     }
     else if(currentTime==(lastFed+2)){ 
       update("Sleeping");
        foodObj.bedroom(); 
      }
      else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ 
        update("Bathing");
         foodObj.washroom();
         }
         else{ 
           update("Hungry") 
           foodObj.display();
           } 
           if(gameState!="Hungry"){ 
             feed.hide(); 
             addFood.hide();
             dog.remove(); 
            }
            else{
               feed.show();
                addFood.show();
                 dog.addImage(dog1);
                 }
  
  drawSprites();
 //add styles here
 



}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
   database.ref('/').update({
     Food:foodObj.getFoodStock(), 
     FeedTime:hour(),
     gameState:"hungry"
    }) 
  } 



  function addFoods(){ 
    foodS++; 
    database.ref('/').update({
       Food:foodS
       }) 
  }

function update(state){
  database.ref('/').update({
    gameState:state
  })

}