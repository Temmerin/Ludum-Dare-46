//Canvas and Context Definitions
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
//Set the canvas height and width
var tWide = 21;
var tHigh = 9;
var tileSize = 64;
canvas.height = (tileSize*tHigh);
canvas.width = (tileSize*tWide);
//---------------------------------------------
//Variable initialisation
var tileCount = 0;
let backgroundLayer = [
	[]
];


var uiPos = 6;
var uiCount = 0;
let uiLayer = [];

var selectorX = 0;
var selectorY = 0;
var selectorID;;

var playerGold = 150;
var slimeHealth = 100;
var mouseX, mouseY;

var entranceX, entranceY;

window.addEventListener('mousemove', e=>{
	mouseX= e.x;
	mouseY= e.y;
	});
window.addEventListener('mouseup', e=>{
	if(mouseY < tileSize){
		for(var x = 0; x < uiCount; x++){
			if(mouseX >= (x+uiPos)*tileSize && mouseX <= ((x+uiPos)*tileSize)+tileSize){
				selectorX = (x+uiPos)*tileSize;
				selectorID = uiLayer[x];
			}
		}
	}
	else if(mouseY > tileSize){
		if(playerGold >= selectorID.cost){
			for(var x = 0; x < tWide; x++){
				for(var y = 0; y < tHigh; y++){
					if(mouseX >= backgroundLayer[x][y].positionX && mouseX <= backgroundLayer[x][y].positionX+tileSize){
						if(mouseY >= backgroundLayer[x][y].positionY && mouseY <= backgroundLayer[x][y].positionY+tileSize){
							if(backgroundLayer[x][y].texId != 64){
								if(mouseX <=tileSize){
									if(backgroundLayer[x+1][y].texId != 0 || backgroundLayer[x][y-1].texId != 0 || backgroundLayer[x][y+1].texId != 0){
										backgroundLayer[x][y].texId = (selectorID.texId);
										playerGold -= selectorID.cost;
									}
								}
								else if(mouseX > tileSize || mouseX < (tWide*tileSize)){
									if(backgroundLayer[x-1][y].texId != 0 || backgroundLayer[x+1][y].texId != 0 || backgroundLayer[x][y-1].texId != 0 || backgroundLayer[x][y+1].texId != 0){
										backgroundLayer[x][y].texId = (selectorID.texId);
										playerGold -= selectorID.cost;
									}
								}
							}
						}
						
					}
				}
			}
		}
	}
});

//---------------------------------------------
//Load the texture sheet
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
	//Clear canvas and fill to black
	context.fillStyle = 'black';
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawBackgroundLayer();
	drawUILayer();
}

//----------------------------------------------
//Utility functions
function init(){
	//Initialise Background Layer
	for(var x = 0; x < tWide; x++){
		backgroundLayer.push([]);
	}
	for(var x = 0; x < tWide; x++){
		for(var y = backgroundLayer[x].length; y < tHigh; y++){
			{
				newTile = {texId:0, positionX:(x*tileSize), positionY:(y*tileSize), cost:10};
				addBackgroundElement(x, 0, x*tileSize, y*tileSize);
			}
		}
	}
	
	//Initialise UI Layer Here
	addUIElement(2, 10);
	addUIElement(3, 10);
	addUIElement(4, 10);
	addUIElement(5, 10);

	setStartPosition(1, 2);
	
	draw();
	mainLoop();
}
function drawBackgroundLayer(){
	for(var x = 0; x < tWide; x++){
		for(var y = 1; y < tHigh; y++){
			context.drawImage(texturesheet, (backgroundLayer[x][y].texId), 0, 64, 64, backgroundLayer[x][y].positionX, backgroundLayer[x][y].positionY, 64, 64);
		}
	}
}
function drawUILayer(){
	context.font = '25px serif';
	context.fillStyle = 'Gold';
	context.fillText('Gold: '+ playerGold, tileSize*1, Number(tileSize/3));
	context.fillText('Slime Health: '+ slimeHealth, (tileSize*3), Number(tileSize/3));
	for(var i = 0; i < uiCount; i++){
			context.drawImage(texturesheet, uiLayer[i].texId, 0, tileSize, tileSize, (i+uiPos)*tileSize, 0, tileSize, tileSize);
	}
	context.strokeStyle = 'red';
	context.lineWidth= 3;
	context.strokeRect(selectorX, 0, tileSize, tileSize);
}
function addUIElement(textureID, cost){
	var newTile = {texId:(textureID*tileSize), cost:cost};
	let newLength = uiLayer.push(newTile);
	uiCount++;
}
function addBackgroundElement(tileId, textureID, xPos, yPos){
	var newTile = {texId:textureID, positionX:xPos, positionY:yPos};
	let newLength = backgroundLayer[tileId].push(newTile);
	tileCount++;
}
function setStartPosition(startTexId, entranceTexId){
	var playerStartX = Number(Math.floor(Math.random()*tWide));
	var playerStartY = Number(Math.floor(Math.random()*(tHigh-1)+1));
	backgroundLayer[playerStartX][playerStartY].texId = startTexId*tileSize; //Set starting tile to a random position
	
	var	X=Math.floor(Math.random()*tWide)
	var	Y=Math.floor(Math.random()*(tHigh-1)+1)
	//if(Math.abs(playerStartX, X) > 5 && Math.abs(playerStartY, Y) > 5)
	//{
		backgroundLayer[X][Y].texId = entranceTexId*tileSize; //Set starting tile to a random position
	//}
	//else{
	//	backgroundLayer[playerStartX+5][playerStartY+5].texId = entranceTexId*tileSize;
	//}
	 
}





