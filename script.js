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
var canPlay = false;

var uiPos = 5;
var uiCount = 0;
let uiLayer = [];

var selectorX = 0;
var selectorID;;

var	entranceX = 0;
var	entranceY = 0;
var playerX = 0;
var playerY = 0;
var playerGold = 150	;
var slimeHealth = 100;

var entranceX = 5;
var entranceY = 5
var mouseX, mouseY;
var lastTime;
var currentTime;
var deltaTime;

var player;
var path;

let pathfinder = class{
	constructor(){
		//this.posX
		this.shouldBuildGrid = true;
		this.camefrom = [];
		this.path = [];
	}
	rebuildGrid(){
		for(var x = 0; x < tWide; x++)
			for(var y = 0; y < tHigh; y++)
				backgroundLayer[x][y].isVisited = false;
	}
	buildGrid(thisX,thisY){
		var frontier = [];
		this.camefrom = [];
		var node = {posX:thisX, posY:thisY, moveCost:0, cID:0};
		var index = 0;
		frontier.push(node);		
		this.camefrom.push(node);

		while(!frontier.length == 0)
		{
			var current = frontier[0];
			frontier.splice(0, 1);

			if(current.posX >= 1){		
				if(!backgroundLayer[(current.posX-1)][current.posY].isVisited && backgroundLayer[current.posX-1][current.posY].moveCost < 9){
					backgroundLayer[current.posX-1][current.posY].isVisited = true;
					node.posY = backgroundLayer[current.posX-1][current.posY].posY;
					node.posX = backgroundLayer[current.posX-1][current.posY].posX;
					node.cID = index;
					frontier.push(passArray(node));
					this.camefrom.push(passArray(node));
				}
			}
			
			if(current.posX < tWide-1){
				if(!backgroundLayer[current.posX+1][current.posY].isVisited && backgroundLayer[current.posX+1][current.posY].moveCost < 9){
					backgroundLayer[current.posX+1][current.posY].isVisited = true;
					node.posY = backgroundLayer[current.posX+1][current.posY].posY;
					node.posX = backgroundLayer[current.posX+1][current.posY].posX;
					node.cID = index;
					frontier.push(passArray(node));
					this.camefrom.push(passArray(node));
				}
					
			}

			if(current.posY > 1){
				if(!backgroundLayer[current.posX][current.posY-1].isVisited && !backgroundLayer[current.posX][current.posY-1].movecost < 9){
					backgroundLayer[node.posX][node.posY-1].isVisited = true;
					node.posY = backgroundLayer[node.posX][node.posY-1].posY;
					node.posX = backgroundLayer[node.posX][node.posY-1].posX;
					node.cID = index;
					frontier.push(passArray(node));
					this.camefrom.push(passArray(node));
				}
			}

			if(current.posY+1 < tHigh){
				if(!backgroundLayer[current.posX][current.posY+1].isVisited && backgroundLayer[current.posX][current.posY+1].moveCost < 9){
					backgroundLayer[current.posX][current.posY+1].isVisited = true;
					node.posY = backgroundLayer[current.posX][current.posY+1].posY;
					node.posX = backgroundLayer[current.posX][current.posY+1].posX;
					node.cID = index;
					frontier.push(passArray(node));
					this.camefrom.push(passArray(node));
				}
			} 
			index++;
		}
		this.shouldBuildGrid = false;
		this.rebuildGrid();
	}
	findPath(goalX, goalY){
		this.path = [];
		var goalID = 0;
		var node = {posX:goalX, posY:goalY, moveCost:0, cID:0};
		
		for(var i = 0; i < this.camefrom.length; i++){
			if(this.camefrom[i].posX == node.posX && this.camefrom[i].posY == node.posY){
				goalID = i;
				break;
			}
		}
		
		while(goalID != 0)
		{
			node.posX = this.camefrom[goalID].posX;
			node.posY = this.camefrom[goalID].posY;
			goalID = this.camefrom[goalID].cID;
			this.path.push(passArray(node));
		}
	}
	draw(){		
		context.fillStyle = 'Red';
		for(var i = 0; i < this.camefrom.length; i++)
			context.fillRect(((this.camefrom[i].posX)*tileSize),(this.camefrom[i].posY*tileSize), tileSize, tileSize); 		
		
		context.fillStyle = 'Blue';
		for(var i = 0; i < this.path.length; i++)
			context.fillRect(((this.path[i].posX)*64),(this.path[i].posY*64), 64, 64);
		
		
		context.fillStyle = 'Gold';
		context.fillRect((player.posX*tileSize),(player.posY*tileSize), 64, 64);	
	}
}

let entity = class{
	constructor(startX, startY, speed, texture, height, width, buildGrid, pathfind){
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
		
		//Pathfinding variables
		this.path = [];
		this.goal = {ID:0, X:9, Y:7};
		
		//this.frontier = [];
		//this.index = 0;
		//this.current;
		//this.node;
	}
	draw(){
		context.drawImage(this.sprite, (this.posX*tileSize), (this.posY*tileSize), this.width, this.height);
	}
	update(){
	}
	/* move(speed){
		if(!this.shouldPathfind){
			switch(this.direction){
				case 0:
					if(this.posX > 0){
						if(backgroundLayer[Math.floor(this.posX-(1/tileSize))][Math.floor(this.posY)].texId != 0){
							if(this.moveCounter < tileSize)
							{
								this.posX -= (speed/tileSize);
							}						
						}
					}
					this.moveCounter++;
				break;
				
				case 1:
					if(this.posY > 64){
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
						if(backgroundLayer[Math.floor(this.posX+1)][Math.floor(this.posY)].texId != 0){
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
		else{
			if(this.path.length != 0){
					var I = this.path.length;
					if(this.moveCounter < tileSize)
					{
						var Xdiff = (this.path[I-1].X-this.posX);
						var Ydiff = (this.path[I-1].Y-this.posY);
						//console.log('X diff: '+ Xdiff);
						//console.log('Y diff: '+ Ydiff);
						this.posX += Math.floor(Xdiff)*(speed/tileSize);
						this.posY += Ydiff*(speed/tileSize);
						//I = this.path.length;
					}
					if(this.moveCounter >= tileSize){
						this.path.splice(-1,1);
						this.moveCounter = 0;
					}
				this.movecounter++;
				//console.log(this.moveCounter);
			}
		}
	} */	
	getXPos(){return this.xPos;}
}

//---------------------------------------------
//Load the texture sheet
var texturesheet = new Image();
texturesheet.addEventListener('load', function(){
		init();
	});
texturesheet.src = 'Imgs/Texturesheet/texturesheet.png';

//----------------------------------------------
//Event Listeners
window.addEventListener('mousemove', e=>{
	mouseX= Math.floor(e.x/64);
	mouseY= Math.floor(e.y/64);
	});
window.addEventListener('mouseup', e=>{
	player.posX = mouseX;
	player.posY = mouseY;
	path.shouldBuildGrid = true;
	path.buildGrid(player.posX, player.posY);
});
/* window.addEventListener('mouseup', e=>{
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
											//console.log('backgroundLayer move cost'+backgroundLayer[x][y].moveCost);
											backgroundLayer[x][y].texId = (selectorID.texId);
											backgroundLayer[x][y].moveCost = 0;
											//console.log('backgroundLayer move cost'+backgroundLayer[x][y].moveCost);
											playerGold -= selectorID.cost;
											orcs.drawPath();
										}
									}
									else if(mouseX > tileSize || mouseX < (tWide*tileSize)){
										//if((selectorID.texId/tileSize) == 3){
										//	backgroundLayer[x][y].texId = 0;
										//	playerGold -= selectorID.cost;
										//}
										if(backgroundLayer[x-1][y].texId != 0 || backgroundLayer[x+1][y].texId != 0 || backgroundLayer[x][y-1].texId != 0 || backgroundLayer[x][y+1].texId != 0){
											backgroundLayer[x][y].texId = (selectorID.texId);
											//console.log('backgroundLayer move cost'+backgroundLayer[x][y].moveCost);
											backgroundLayer[x][y].moveCost = 0;
											//console.log('backgroundLayer move cost'+backgroundLayer[x][y].moveCost);
											playerGold -= selectorID.cost;
											orcs.drawPath();
										}
									}
								}
							}
							
						}
					}
				}
			}
		}
		
		//	for(var i = 0; i < orcs.path.length; i++){
			//console.log('X: '+orcs.path[i].X);
		//}
}); */

//---------------------------------------------
//Main game Loop functions
function mainLoop(){
	update();
	draw();
	requestAnimationFrame(mainLoop);
}
function update(){
	path.findPath(mouseX, mouseY);
}
function draw(){
	//Clear canvas and fill to black
	context.fillStyle = 'black';
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawBackgroundLayer();
		
	path.draw();
	
	player.draw();

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
				addBackgroundElement(x, 1, x, y, false, 0);
			}
		}
	}
	
	//Initialise UI Layer Here
	//addUIElement(3, 10);
	addUIElement(0, 10);
	selectorID = uiLayer[0];
	
	//set the start position of the players base and the dungeon entrance
	//setStartPosition(1, 2);
	
	//Start to initilaise entities
	path = new pathfinder();
	player = new entity(5,5, 1, 'PlayerSlime/Slime', 64, 64, true, false);
	//orcs = new entity(entranceX, entranceY, 1, 'Enemies/Orc', 64, 64, true);
	
	//start draw/update loop
	path.buildGrid(player.posX,player.posY);
	draw();
	mainLoop();
}
function drawBackgroundLayer(){
	for(var x = 0; x < tWide; x++){
		for(var y = 0; y < tHigh; y++){
			context.drawImage(texturesheet, (backgroundLayer[x][y].texId*tileSize), 0, tileSize, tileSize, backgroundLayer[x][y].posX*tileSize, backgroundLayer[x][y].posY*tileSize, tileSize, tileSize);
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
function addBackgroundElement(tileId, textureID, xPos, yPos, visited, moveCost){
	var newTile = {texId:textureID, posX:xPos, posY:yPos, isVisited:visited, moveCost:moveCost};
	let newLength = backgroundLayer[tileId].push(newTile);
	tileCount++;
}
function setStartPosition(startTexId, entranceTexId){
	playerX = Number(Math.floor(Math.random()*tWide));
	playerY = Number(Math.floor(Math.random()*(tHigh-1)+1));
	backgroundLayer[playerX][playerY].texId = startTexId; //Set starting tile to a random position
	
	player = new entity(playerX, playerY, 1, 'Slime', 64, 64);
	
	entranceX=Math.floor(Math.random()*tWide)
	entranceY=Math.floor(Math.random()*(tHigh-1)+1)
	//if(Math.abs(playerStartX, X) > 5 && Math.abs(playerStartY, Y) > 5)
	//{
		backgroundLayer[entranceX][entranceY].texId = entranceTexId; //Set starting tile to a random position
	//}
	//else{
	//	backgroundLayer[playerStartX+5][playerStartY+5].texId = entranceTexId*tileSize;
}
function passArray(node){
	var array = {posX:0, posY:0, moveCost:0, cID:0};
	array.posX = node.posX;
	array.posY = node.posY;
	array.cID = node.cID;
	return array;
}


