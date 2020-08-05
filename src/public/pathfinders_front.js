const selector = document.getElementById('algo-selector');
const mazeAlgoSelector = document.getElementById('maze-algo-selector');
const speed = document.getElementById('animation-speed');
const start = document.getElementById('start');
const trash = document.getElementById('clear-board');
const generateMaze = document.getElementById('generate-maze');
const mazeSize = document.getElementById('maze-size');
let isRunning = false, isAnimating = false;
let animationSpeed;

speed.onchange = _ => {
	setAnimationSpeed();
}

trash.onmouseup = _ => {
	createCanvas();
	setStartFinish();
}

generateMaze.onmouseup = _ => {
	if (isRunning){
		isAnimating = false;
		return;
	}
	isRunning = true;
	isAnimating = true;
	switch(mazeAlgoSelector.selectedIndex){
		case 0:
			createCanvas(true,mazeSize.value);
			recursiveBackgracking(0,0).then(_ => resetAfterAnimation(true));
			break;
		case 1:
			createCanvas(true,mazeSize.value);
			randomizedPrimsAlgorithm(grid[0]).then(_ => resetAfterAnimation(true));
			break;
		case 2:
			createCanvas(false,mazeSize.value);
			recursiveDivisionAlgorithm(1,cols-1,1,rows-1,true).then(_ => resetAfterAnimation(true));
			break;
	}
	changeButtonText(generateMaze, 'Finish', '#D02536')
}

start.onmouseup = _ => {
	if (isRunning){
		isAnimating = false;
		return;
	}
	draw();
	startNode.visited = true;
	isRunning = true;
	isAnimating = true;
	setAnimationSpeed();
	switch (selector.selectedIndex){
		case 0:
			breadthFirstSearch(startNode.x, startNode.y).then(_ => resetAfterAnimation());
			break;
		case 1:
			depthFirstSearch(startNode.x, startNode.y).then(_ => resetAfterAnimation());
			break;
		case 2:
			dijkstraAlgorithm(startNode).then(_ => resetAfterAnimation());
			break;
		case 3:
			greedyBestFirstSearch(startNode).then(_ => resetAfterAnimation());
			break;
		case 4:
			aStarAlgorithm(startNode).then(_ => resetAfterAnimation());
			break;
	}
	changeButtonText(start, 'Finish', '#D02536')
}

function resetAfterAnimation(isGenerating=false){
	isRunning = false;
	if (isGenerating) {
		changeButtonText(generateMaze, 'Generate maze','');
		setStartFinish()
		draw();
	}
	else changeButtonText(start, 'Find path','')
}

async function markPath(i,ms=0){
	grid[i].setColor('#FFBA08');
	return new Promise((resolve) => setTimeout(resolve, animationSpeed))
}

async function renderPath(i,ms=0){
	grid[i].setColor('#0094C6');
	return new Promise((resolve) => setTimeout(resolve, animationSpeed))
}

function deletePath(i){
	grid[i].removeColor();
}

function setAnimationSpeed(){
	if (speed.value){
		animationSpeed = speed.value;
	}
}

function changeButtonText(element, text, color){
	element.innerText = text;
	element.style.backgroundColor = color;
}