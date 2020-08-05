const canvas = document.getElementById('canvas');
const wrapper = document.querySelector('.wrapper');
const ctx = canvas.getContext('2d');
let cols, rows, startNode, finishNode;
let isStartSelected = false, isFinishSelected = false;
let grid = [];
let w = 50;

window.onload = () => {
	createCanvas();
	setStartFinish();
}

canvas.onmouseup = (e) => {
	if (isRunning) return;
	const rect = e.target.getBoundingClientRect();
	let x = e.offsetX * ctx.canvas.width / ctx.canvas.clientWidth - w;
	let y = e.offsetY * ctx.canvas.height / ctx.canvas.clientHeight - w;
	for (let i = 0; i < grid.length; i++){
		const element = grid[i];
		if (element.y*w > y && element.x*w > x){
			if (element.isStart){
				if (isFinishSelected) break;
				element.isStart = false;
				element.hCost = Infinity;
				element.gCost = 1;
				element.removeColor();
				isStartSelected = true;
			}
			else if (element.isFinish){
				if (isStartSelected) break;
				element.isFinish = false;
				element.removeColor();
				isFinishSelected = true;
			}
			else if (isStartSelected){
				element.setStart();
				startNode = element;
				isStartSelected = false;
			}
			else if (isFinishSelected) {
				element.setFinish();
				finishNode = element;
				isFinishSelected = false;
			}
			else {
				const xIn = Math.abs(element.x*w-x);
				const yIn = Math.abs(element.y*w-y);

				if (xIn > w/2 && yIn > w/2){
					if (yIn > xIn){
						if (element.walls[0]) updateWall(element.x,element.y,element.x,element.y-1,0,false,false);
						else updateWall(element.x,element.y,element.x,element.y-1,0,true);
					}
					else{
						if (element.walls[3]) updateWall(element.x,element.y,element.x-1,element.y,2,false,false);
						else updateWall(element.x,element.y,element.x-1,element.y,2,true);
					}
				}
				else if (xIn < w/1.3 && yIn < w/1.3){
					if (yIn < xIn){
						if (element.walls[1]) updateWall(element.x,element.y,element.x,element.y+1,1,false,false);
						else updateWall(element.x,element.y,element.x,element.y+1,1,true);
					}
					else {
						if (element.walls[2]) updateWall(element.x,element.y,element.x+1,element.y,3,false,false);
						else updateWall(element.x,element.y,element.x+1,element.y,3,true);
					}
				}

			}
			break;
		}
	}
	draw();
}

function createCanvas(walls=false,size){
	canvas.width += 0;
	canvas.height += 0;
	grid = [];
	canvas.width = wrapper.scrollWidth;
	canvas.height = wrapper.scrollHeight;

	if (size) w=parseInt(size);

	cols = Math.floor(canvas.width/w)
	rows = Math.floor(canvas.height/w)

	for (let y = 0; y < rows; y++){
		for (let x = 0; x < cols; x++){

			let cell = new Cell(x,y);
			if (walls) cell.walls = new Array(4).fill(true);
			grid.push(cell);
		}
	}
}

function Cell(x, y){
	this.x = x;
	this.y = y;
	this.visited = false;
	this.isFinish = false;
	this.isStart = false;
	this.walls = [false, false, false, false];
	this.hCost = Infinity;
	this.fCost = Infinity;
	this.gCost = 1;

	this.show = _ => {
		let x = this.x*w;
		let y = this.y*w;

		if (this.walls[0]) drawLine(x,y,x+w,y,'#23282F'); // TOP
		if (this.walls[1]) drawLine(x+w,y+w,x,y+w,'#23282F'); // BOTTOM
		if (this.walls[2]) drawLine(x+w,y,x+w,y+w,'#23282F'); // RIGHT
		if (this.walls[3]) drawLine(x,y+w,x,y,'#23282F'); // LEFT
	}

	this.setColor = (color) => {
		let x = this.x*w;
		let y = this.y*w;
		ctx.beginPath();
		ctx.rect(x,y,w,w);
		ctx.fillStyle = color;
		ctx.closePath();
		ctx.fill();
		this.show();
	}

	this.removeColor = _ => {
		let x = this.x*w;
		let y = this.y*w;
		ctx.clearRect(x,y,w,w);
		this.show();
	}

	this.clear = _ => {
		this.visited = false;
		this.hCost = Infinity;
		this.gCost = 1;
		if (this.isStart) return;
		if (this.isFinish) return;
		this.removeColor();
	}

	this.drawDistanceNumber = _ =>{
		if (w < 20) return;
		let x = this.x*w;
		let y = this.y*w;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.beginPath();
		if (this.hCost < 100) ctx.font = `${w/2}px Arial`;
		else if(this.hCost < 1000) ctx.font = `${w/2.5}px Arial`;
		else ctx.font = `${w/3}px Arial`;
		ctx.fillStyle = '#EFF6E0';
		ctx.fillText(this.hCost,x+(w/2),y+(w/2));
		ctx.closePath();
	}

	this.setStart = _ => {
		let x = this.x*w;
		let y = this.y*w;
		this.isStart = true;
		this.gCost = 0;
		this.hCost = 0;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		this.setColor('#058C42');
		ctx.beginPath();
		ctx.fillStyle = '#EFF6E0';
		ctx.font = `${w/2}px FontAwesome`;
		ctx.fillText('\uf13d',x+(w/2),y+(w/2))
		ctx.closePath();
	}

	this.setFinish = _ => {
		let x = this.x*w;
		let y = this.y*w;
		this.isFinish = true;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		this.setColor('#D72638');
		ctx.beginPath();
		ctx.fillStyle = '#EFF6E0';
		ctx.font = `${w/2}px FontAwesome`;
		ctx.fillText('\uf024',x+(w/2),y+(w/2))
		ctx.closePath();

	}
 }

function draw(){
	for (let i = 0; i < grid.length; i++){
		grid[i].clear();
		grid[i].show();
	}
}

function drawLine(startX, startY, endX, endY,color='black'){
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.stroke();
}

function setStartFinish(){
	const pos = [];
	for (let i = 0; i < 2; i++){
		pos.push(Math.floor(Math.random()*cols*rows));
	}
	grid[pos[0]].setStart();
	startNode = grid[pos[0]];
	grid[pos[1]].setFinish();
	finishNode = grid[pos[1]];
}