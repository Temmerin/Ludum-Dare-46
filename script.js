//Canvas and Context Definitions
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
//Set the canvas height and width
var tWide = 21;
var tHigh = 9;
canvas.height = (64*tHigh);
canvas.width = (64*tWide);
//Fill the canvas with black
context.fillStyle = 'black';
context.fillRect(0,0,canvas.width,canvas.height);
//---------------------------------------------
//Variable initialisation
var tileCount = 0;
let tiles = [];

var playerGold = 100;
var slimeHealth = 100;
//---------------------------------------------
//Load the texture sheet
var texIndex = 2; //Total number of textures
var texWidth = 10;// Number of textures per row
var texturesheet = new Image();
texturesheet.addEventListener('load', function(){
		init();
	});
texturesheet.src = 'Imgs/texturesheet.png';
//---------------------------------------------
//Main game Loop functions
function mainLoop(){
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

function update(){

}

function draw(){
	drawBackground();
	drawUI();
}

//----------------------------------------------
//Utility functions
function init(){
	var newTile = {id:0,positionX:0,positionY:0,texId:0};
	for(var x = 0; x < tWide; x++){
		for(var y = 1; y < tHigh; y++){
			newTile = {id:tileCount,positionX:(x*64),positionY:(y*64),texId:0};
			let newLength = tiles.push(newTile);
			tileCount++;
		}
	} 
	tiles[Math.floor(Math.random() * tileCount)].texId = 1; //Set starting tile to a random position
	draw();
	update();
}
function drawBackground(){
	for(var i = 0; i < tileCount; i++){
			context.drawImage(texturesheet, getTexXPos(i), 0, 64, 64, tiles[i].positionX, tiles[i].positionY, 64, 64);
	}
}
function drawUI(){
	context.font = '25px serif';
	context.fillStyle = 'Gold';
	context.fillText('Gold: '+ playerGold, 10, 25);
	context.fillText('Slime Health: '+ slimeHealth, (25*6), 25);
	
}
function getTexXPos(index){
	var xPos = 0;
	if(getTexYPos(index) >= 1){
		xPos = tiles[index].texId/texWidth;
		return Number(xPos)+(64*tiles[index].texId);
	}
	else{
		return (tiles[index].texId*64);
	}
}
function getTexYPos(index){
	var yPos = 0;
	yPos = tiles[index].texId/texIndex;
	return Number(yPos);
}
	
//----------------------------------------------
//let tileGrid;

//Pick a random starting position

//init();




