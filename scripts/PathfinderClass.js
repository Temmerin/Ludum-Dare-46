let pathfinder = class{
	constructor(){
		this.camefrom = [];
		this.path = [];
	}
	rebuildGrid(){
		for(var x = 0; x < gridWidth; x++)
			for(var y = 0; y < gridHeight; y++)
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
			var temp = current;
			
			if(current.posX > 1){
				temp.posX--;
				this.getNode(index, temp, node, frontier);
				temp.posX++;
			}
				
			if(current.posY >= 2){
				temp.posY--;
				this.getNode(index, temp, node, frontier);
				temp.posY++;
			}
						
			if(current.posX < gridWidth-2){
				temp.posX++;
				this.getNode(index, current, node, frontier);
				temp.posX--;
			}

			if(current.posY < gridHeight-2){
				temp.posY++;
				this.getNode(index, current, node, frontier, 0, 1);
				temp.posY--;
			}
			index++;
		}
		this.rebuildGrid();
	}
	findPath(goalX, goalY){
		var newPath = [];
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
			newPath.push(passArray(node));
		}
		
		return newPath;
	} 
	update(){
		if(DEBUG)
			this.path = path.findPath(mouseX, mouseY);
	}
	draw(){		
		context.strokeStyle = 'Pink';
		for(var i = 0; i < this.camefrom.length; i++)
			context.strokeRect(((this.camefrom[i].posX)*TILESIZE)-GRID_OFFSETX,(this.camefrom[i].posY*TILESIZE), TILESIZE, TILESIZE); 		
	
		context.strokeStyle = 'Blue';
		for(var i = 0; i < this.path.length; i++)
			context.strokeRect((this.path[i].posX*TILESIZE)-GRID_OFFSETX,(this.path[i].posY*TILESIZE), 64, 64);	
	}
/* 	 getNode(index, nodeIn, nodeOut, frontier, xOffset, yOffset){
		var current = nodeIn;
		console.log(current);
		console.log((current.posX+xOffset)+'||'+(current.posY+yOffset));
		if(!backgroundLayer[current.posX+xOffset][current.posY+yOffset].isVisited && backgroundLayer[current.posX+xOffset][current.posY+yOffset].moveCost != 10){
			backgroundLayer[current.posX+xOffset][current.posY+yOffset].isVisited = true;
			nodeOut.posY = Math.floor(backgroundLayer[current.posX+xOffset][current.posY+yOffset].posY/64);
			nodeOut.posX = Math.floor(backgroundLayer[current.posX+xOffset][current.posY+yOffset].posX/64);
			console.log(Math.floor(backgroundLayer[current.posX+xOffset][current.posY+yOffset].posY/64));
			console.log(Math.floor(backgroundLayer[current.posX+xOffset][current.posY+yOffset].posX/64));
			nodeOut.cID = index;
			frontier.push(passArray(nodeOut));
			this.camefrom.push(passArray(nodeOut));
		}
	}  */	
	getNode(index, nodeIn, nodeOut, frontier){
		var current = nodeIn;
		if(!backgroundLayer[current.posX][current.posY].isVisited && backgroundLayer[current.posX][current.posY].moveCost != 10){
			backgroundLayer[current.posX][current.posY].isVisited = true;
			nodeOut.posY = Math.floor(backgroundLayer[current.posX][current.posY].posY/64);
			nodeOut.posX = Math.floor(backgroundLayer[current.posX][current.posY].posX/64);
			nodeOut.cID = index;
			frontier.push(passArray(nodeOut));
			this.camefrom.push(passArray(nodeOut));
		}
	} 
}