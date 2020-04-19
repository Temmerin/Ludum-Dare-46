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


var uiPos = 5;
var uiCount = 0;
let uiLayer = [];

var selectorX = 0;
var selectorID;;

var	entranceX = 0;
var	entranceY = 0;
var playerStartX = 0;
var playerStartY = 0;
var playerGold = 150	;
var slimeHealth = 100;


var entranceX, entranceY;
var mouseX, mouseY;
var lastTime;
var currentTime;
var deltaTime;

var palyer;
var orcs;

let entity = class {
	constructor(startX, startY, speed, texture, height, width){
		this.posX = startX;
		this.posY = startY;
		this.height = height;
		this.width = width;
		this.state = 0;
		this.speed = speed;
		this.sprite = new Image();
		this.sprite.src='Imgs/'+texture+'0.png';
		this.direction = 0;
		this.moveCounter = 0;
	}
	draw(){
		context.drawImage(this.sprite, (this.posX*tileSize), (this.posY*tileSize), this.width, this.height);
	}
	update(){
		if(this.moveCounter == 64){
			this.direction = Math.floor(Math.random() * 5);
			this.moveCounter = 0;
		}
		this.move(this.speed);
		//this.moveCounter++;
	}
	move(speed){
		switch(this.direction){
			case 0:
				if(this.posX > 0){
					if(backgroundLayer[Math.floor(this.posX-(1/tileSize))][this.posY].texId != 0){
						if(this.moveCounter < tileSize)
						{
							this.posX -= (speed/tileSize);
						}						
					}
				}
				this.moveCounter++;
			break;
			
			case 1:
				if(this.posY > 0){
					if(backgroundLayer[Math.floor(this.posX)][Math.floor(this.posY-(1/tileSize))].texId != 0){
						if(this.moveCounter < tileSize)
						{
							this.posY -= (speed/tileSize);
						}
					}
				}
				this.moveCounter++;
			break;
			
			case 2:
				if(this.posX < (tWide-1)){
					if(backgroundLayer[Math.floor(this.posX+1)][this.posY].texId != 0){
						if(this.moveCounter < tileSize)
						{
							this.posX += (speed/tileSize);
						}
					}
				}
				this.moveCounter++;
			break;
			
			case 3:
				if(this.posY < (tHigh-1)){
					if(backgroundLayer[Math.floor(this.posX)][Math.floor(this.posY+1)].texId != 0){
						if(this.moveCounter < tileSize)
						{
							this.posY += (speed/tileSize);
						}
					}		
				}
				this.moveCounter++;
			break;
			case 4:
				this.moveCounter++;
			break;
		}
	}
}

//---------------------------------------------
//Load the texture sheet
var texturesheet = new Image();
texturesheet.addEventListener('load', function(){
		init();
	});
texturesheet.src = 'Imgs/texturesheet.png';

//----------------------------------------------
//Event Listeners
window.addEventListener('mousemove', e=>{
	mouseX= e.x;
	mouseY= e.y;
	});
window.addEventListener('mouseup', e=>{
	if(mouseY < tileSize){
		for(var x = 0; x < uiCount; x++){
			if(mouseX >= (x+uiPos)*tileSize && mouseX <= ((x+uiPos)*tileSize)+tileSize){
				selectorID = uiLayer[x];
				selectorX = (x+uiPos)*tileSize;
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
									//if((selectorID.texId/tileSize) == 3){
									//	backgroundLayer[x][y].texId = 0;
									//	playerGold -= selectorID.cost;
									//}
									if(backgroundLayer[x+1][y].texId != 0 || backgroundLayer[x][y-1].texId != 0 || backgroundLayer[x][y+1].texId != 0){
										backgroundLayer[x][y].texId = (selectorID.texId);
										playerGold -= selectorID.cost;
									}
								}
								else if(mouseX > tileSize || mouseX < (tWide*tileSize)){
									//if((selectorID.texId/tileSize) == 3){
									//	backgroundLayer[x][y].texId = 0;
									//	playerGold -= selectorID.cost;
									//}
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
//Main game Loop functions
function mainLoop(){
	update();
	draw();
	requestAnimationFrame(mainLoop);
}
function update(){
	currentTime = Date.now();
	deltaTime = currentTime - lastTime;
	
	player.update();
	//orcs.update();
	
	lastTime = currentTime;
}
function draw(){
	//Clear canvas and fill to black
	context.fillStyle = 'black';
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawBackgroundLayer();
	
	player.draw();
	orcs.draw();
	
	drawUILayer();
}

//----------------------------------------------
//Utility functions
function init(){
	selectorX = uiPos*tileSize;
	
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
	//addUIElement(3, 10);
	addUIElement(1, 10);
	selectorID = uiLayer[0];
	
	//set the start position of the players base and the dungeon entrance
	setStartPosition(1, 2);
	
	//Start to initilaise entities
	player = new entity(playerStartX, playerStartY, 1, 'Slime', 64, 64);
	orcs = new entity(entranceX, entranceY, 1, 'Orc', 64, 64);
	
	//start draw/update loop
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
	context.fillText('Gold: '+ playerGold, tileSize*0, Number(tileSize/3));
	context.fillText('Slime Health: '+ slimeHealth, (tileSize*2), Number(tileSize/3));
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
	playerStartX = Number(Math.floor(Math.random()*tWide));
	playerStartY = Number(Math.floor(Math.random()*(tHigh-1)+1));
	backgroundLayer[playerStartX][playerStartY].texId = startTexId*tileSize; //Set starting tile to a random position
	
	player = new entity(playerStartX, playerStartY, 1, 'Slime', 64, 64);
	
	entranceX=Math.floor(Math.random()*tWide)
	entranceY=Math.floor(Math.random()*(tHigh-1)+1)
	//if(Math.abs(playerStartX, X) > 5 && Math.abs(playerStartY, Y) > 5)
	//{
		backgroundLayer[entranceX][entranceY].texId = entranceTexId*tileSize; //Set starting tile to a random position
	//}
	//else{
	//	backgroundLayer[playerStartX+5][playerStartY+5].texId = entranceTexId*tileSize;
}





