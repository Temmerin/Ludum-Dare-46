var DEBUG;
if (window.location.hostname == '')
	DEBUG = true;
else
	DEBUG = false;

//Canvas and Context Definitions
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const screen = window.screen;

const TILESIZE = 64;
const SCREEN_WIDTH = screen.width;
const SCREEN_HEIGHT = screen.height;
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const GRID_OFFSETX = (WINDOW_WIDTH - (Math.floor(WINDOW_WIDTH/TILESIZE)*TILESIZE));
const GRID_OFFSETY = (WINDOW_HEIGHT - (Math.floor(WINDOW_HEIGHT/TILESIZE)*TILESIZE));

var gridWidth;
var gridHeight;

function canvasSetup(width, height){
	canvas.height = height;
	canvas.width = width;
}

//if(GRID_OFFSETX > 0)
		//gridWidth = (WINDOW_WIDTH/64)-1;
	//else
		gridWidth = (WINDOW_WIDTH/64);
	
//if(GRID_OFFSETY > 0)
		//gridHeight = (WINDOW_HEIGHT/64)-1;
	//else
		gridHeight = (WINDOW_HEIGHT/64);


//Set the canvas height and width
//var tileSize = 64;
//var tWide = Math.floor((screen.width/tileSize));
//var tHigh = Math.floor((screen.height/tileSize)-(3));




//context.drawImage(texturesheet, 0, 0, 64, 64, (x*64)+((WINDOW_WIDTH - (Math.floor(WINDOW_WIDTH/64)*64))/2), (y*64), 64, 64);