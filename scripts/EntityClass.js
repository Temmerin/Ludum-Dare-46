let entity = class{
	constructor(startX, startY, texture, height, width, isPlayer, speed){
		this.posX = ((startX*TILESIZE)- GRID_OFFSETX);
		this.posY = ((startY*TILESIZE));
		this.height = height;
		this.width = width;
		this.sprite = new Image();
		this.state = 0;
		this.sprite.src='imgs/'+texture+this.state+'.png';
		this.isPlayer = isPlayer;
		this.speed = speed;
		this.moveCount = 0;
		
		//Pathfinding variables
		this.path = [];
		this.goal = {id:0, posX:0, posY:0};
		this.shouldPathfind = true;
	}
	draw(){
		context.drawImage(this.sprite, this.posX-GRID_OFFSETX, this.posY, this.width, this.height);
	}
	drawPath(draw){
		 if(this.isPlayer)
			context.strokeStyle = 'Magenta';
		else
			context.strokeStyle = 'Green';
		
		for(var i = 0; i < this.path.length; i++)
			context.strokeRect((this.path[i].posX*TILESIZE)-GRID_OFFSETX,(this.path[i].posY*TILESIZE), 64, 64);
	}
	update(deltaTime){
		if(this.path.length == 0)
			this.shouldPathfind = true;
		
		if(this.isPlayer && this.shouldPathfind){
			this.goal.id = Math.floor(Math.random()*50)+1;
			this.goal.posX = path.camefrom[this.goal.id].posX;
			this.goal.posY = path.camefrom[this.goal.id].posY;
			this.path = path.findPath(this.goal.posX,this.goal.posY);
			this.shouldPathfind = false;
		}
		/*else if(!this.isPlayer && this.shouldPathfind){
			this.goal.posX = this.posX;
			this.goal.posY = this.posY;
			this.shouldPathfind = false;
		}*/
		
		if(this.isPlayer){
			this.move(deltaTime);
		}
	}	
	move(deltaTime){
		const speed = (Math.floor(deltaTime)/this.speed);
		var handle = {posX:(this.posX+TILESIZE/2), posY:(this.posY+TILESIZE/2)};
		var pathHandle = {posX:this.path[this.path.length-1].posX*TILESIZE, posY:this.path[this.path.length-1].posY*TILESIZE};
		
		if(speed > 0){
			if(handle.posX >= pathHandle.posX+(TILESIZE/2)){
				this.posX -= speed;
			}
			if(handle.posX <= pathHandle.posX+(TILESIZE/2)){
				this.posX += speed;
			}
			if(handle.posY >= pathHandle.posY+(TILESIZE/2)){
				this.posY -= speed;
			}
			if(handle.posY <= pathHandle.posY+(TILESIZE/2)){
				this.posY += speed;
			}
			
			if(handle.posX >= (pathHandle.posX) && handle.posX <= (pathHandle.posX + TILESIZE) && handle.posY >= (pathHandle.posY+(TILESIZE/2)-speed) && handle.posY <= (pathHandle.posY+(TILESIZE/2)+speed)){
				this.path.splice(-1,1);
				if(this.isPlayer)
					path.buildGrid(Math.floor(this.posX/TILESIZE)+1, Math.floor(this.posY/TILESIZE));
			}
		}
	}
	debug(){
		pushLog (3, '\n');
		pushLog(4, 'PlayerX: '+this.posX+' / PlayerY: '+this.posY);
	}
}