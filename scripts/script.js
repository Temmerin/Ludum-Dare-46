//---------------------------------------------
//Variable initialisation
var fps = 0;
var lastTime;

var showDebug = DEBUG ? false : false;
var debugLog = [];
var logID = 0;

let backgroundLayer = [[]];
let uiLayer = [];

var mouseX, mouseY;
var uiOffset = 5;
var selector = {texId:0, cost:0};

var playerGold = {value:150};
var slimeHealth = 100;

var shouldSpawnEnemy = true;

var path;
var player;
var enemies;
//---------------------------------------------
//Load the texture sheet
var texturesheet = new Image();
texturesheet.src = 'Imgs/Texturesheet/texturesheet.png';

//----------------------------------------------
//Event Listeners
window.addEventListener('mousemove', e=>{
	mouseX= Math.floor(e.x/64);
	mouseY= Math.floor(e.y/64);
});
window.addEventListener('mouseup', e=>{
	if(mouseY < 1){
		if(mouseX >= uiOffset && mouseX <= (uiOffset+uiLayer.length))
			selector = uiLayer[mouseX];
	}
	/*else if(mouseY >= 1 && mouseY <= tHigh){
		if(playerGold >= selector.cost){
			backgroundLayer[mouseX][mouseY].texId = selector.texId;
			backgroundLayer[mouseX][mouseY].moveCost = selector.cost;
		}
	}*/
});
window.addEventListener('keyup', e=>{
	switch(e.keyCode){
	case 192:
		showDebug = showDebug ? false : true;
		break;
	}
});
window.onload =  init();
//---------------------------------------------
//Main game Loop functions

function mainLoop(currentTime){
	var deltaTime = currentTime - lastTime;

	update(deltaTime);
	draw();
	
	fps = 1000/deltaTime;
	lastTime = currentTime;
	window.requestAnimationFrame(mainLoop);
}
function update(deltaTime){
	path.update();
	player.update(deltaTime);
	
	spawnEnemy();
}
function draw(){
	//Clear canvas and fill to black
	context.fillStyle = 'black';
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawBackgroundLayer();
	
	player.draw();
	//enemies.draw();
	
	drawUILayer();
	
	if(DEBUG){
		path.draw();
		player.drawPath();
	}
	if(showDebug){
		debugScreen(showDebug);
		//player.debug();
	}
}

//----------------------------------------------
//Utility functions
function init(){
	canvasSetup(WINDOW_WIDTH, WINDOW_HEIGHT);
	
	//Initialise Background Layer
	for(var x = 0; x < gridWidth; x++){
		backgroundLayer.push([]);
		for(var y = backgroundLayer[x].length; y < gridHeight;	y++){
			if( x > 0 && x < gridWidth-1 && y > 0 && y < gridHeight-1)
				addBackgroundElement(x, 64, (x*TILESIZE), (y*TILESIZE), false, 0);
			else
				addBackgroundElement(x, 0, (x*TILESIZE), (y*TILESIZE), false, 10);
		}
	}
	
	//Initialise UI Layer Here
	addUIElement(playerGold, 'Gold', 0);
	addUIElement(0, 'Button', 2);
	addUIElement(0, 'Button', 3);
	addUIElement(0, 'Button', 4);
	addUIElement(0, 'Button', 5);
	addUIElement(0, 'Health', -1);
	
	//Start to initilaise entities
	path = new pathfinder();
	
	//player = new entity(Number(Math.floor(Math.random()*tWide)),Number(Math.floor(Math.random()*(tHigh-1)+1)), 1, 'PlayerSlime/Slime', 64, 64, true, false);
	player = new entity(Math.floor(Math.random()*(gridWidth-3))+2,Math.floor(Math.random()*(gridHeight-3))+2,'Slime0.png', 64, 64, true, 23);
	path.buildGrid(Math.floor(player.posX/TILESIZE)+1, Math.floor(player.posY/TILESIZE));
	
	//start draw & update loop
	draw();
	window.requestAnimationFrame(mainLoop);
}
function drawBackgroundLayer(){
	for(var x = 0; x < gridWidth; x++)
		for(var y = 0; y < gridHeight; y++)
			context.drawImage(texturesheet, (backgroundLayer[x][y].texId), 1*TILESIZE, TILESIZE, TILESIZE, backgroundLayer[x][y].posX-GRID_OFFSETX, backgroundLayer[x][y].posY, TILESIZE, TILESIZE);
}
function drawUILayer(){	
	var fontSize = 25;
	context.font = fontSize+'px serif';
	context.fillStyle = 'White';
	
	for(var i = 0; i < uiLayer.length; i++){
		if(uiLayer[i].texId == 0){
			context.drawImage(texturesheet, (uiLayer[i].texId*TILESIZE), 0, TILESIZE, TILESIZE, (TILESIZE*(i+1)), 0, TILESIZE, TILESIZE);
			context.fillText(uiLayer[i].cost.value, (TILESIZE*(i+1))+(10), (TILESIZE/1.75));
		}
		else if(uiLayer[i].string == 'Health'){
			context.fillText(uiLayer[i].string, TILESIZE*(i+3), fontSize);
			
			context.lineWidth= 2;
			context.fillStyle = 'Grey';
			context.fillRect(TILESIZE*(i+3),fontSize+(fontSize/3),(TILESIZE*2),fontSize);
			context.fillStyle = 'Green';
			context.fillRect(TILESIZE*(i+3),fontSize+(fontSize/3),(TILESIZE*2)*(slimeHealth/100),fontSize);
			context.strokeStyle = 'Black';
			context.strokeRect(TILESIZE*(i+3),fontSize+(fontSize/3),(TILESIZE*2),fontSize);
		}
		else{
			context.drawImage(texturesheet, (uiLayer[i].texId*TILESIZE), 0, TILESIZE, TILESIZE, (TILESIZE*(i+2)), 0, TILESIZE, TILESIZE);
		}
	}
	
	var lMouseY = Math.floor(mouseY/TILESIZE)*TILESIZE;
	var lMouseX = Math.floor((mouseX+GRID_OFFSETX)/TILESIZE)*TILESIZE;
	if(mouseY > 0 && (mouseY/64) < Math.floor(gridHeight) && lMouseX > 0 && (lMouseX/64) < Math.floor(gridWidth)){
		context.strokeStyle = 'Grey';
		context.lineWidth= 1;
		context.strokeRect(lMouseX-GRID_OFFSETX, mouseY, TILESIZE, TILESIZE);
	}
	if(mouseY < 1 && mouseX > 2 && mouseX < 7){
		context.strokeStyle = 'Yellow';
		context.lineWidth= 1;
		context.strokeRect(mouseX*TILESIZE, 0, TILESIZE, TILESIZE);
	}
	
}
function spawnEnemy(){
	if(shouldSpawnEnemy){
		console.log(Date.now());
		console.log('Spawning');
		shouldSpawnEnemy = false;
	}
}

function addUIElement(value, string = null, texId = null){
	var newTile = {texId:texId, string:string, cost:value};
	let newLength = uiLayer.push(newTile);
}
function addBackgroundElement(tileId, textureID, xPos, yPos, visited, moveCost){
	var newTile = {texId:textureID, posX:xPos, posY:yPos, isVisited:visited, moveCost:moveCost};
	let newLength = backgroundLayer[tileId].push(newTile);
}
function passArray(node){
	var array = {posX:0, posY:0, moveCost:0, cID:0};
	array.posX = node.posX;
	array.posY = node.posY;
	array.cID = node.cID;
	return array;
}

function debugScreen(show){
	if(show || DEBUG){
		context.fillStyle = "rgba(200, 200, 200, 0.8)";
		context.fillRect(0,0, 8*64, 8*64);	
		context.strokeStyle = "rgba(0, 0, 0, 1)";
		context.strokeRect(0,0, 8*64, 8*64);
		
		context.font = '22px serif';
		context.fillStyle = 'White';
		context.strokeStyle = 'Grey';
		context.lineWidth= 0.5;
		
		pushLog(1,'Player Gold: '+playerGold.value+' || Slime Health: '+slimeHealth);
		pushLog(2,'FPS:' +Math.floor(fps));
		
		for(var i = 0; i < debugLog.length; i++){
			context.fillText(debugLog[i], 10, (22*(i+1)));
			context.strokeText(debugLog[i], 10, (22*(i+1)));
		}
	}
}
function pushLog(id, input){
	if(debugLog.length >= id)
		debugLog[id-1] = input;
	else
		debugLog.push(input);
}
