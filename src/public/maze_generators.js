const idxArray = [0,1,2,3];

async function recursiveBackgracking(x,y){
	const moves = [];
	let rndIdx = idxArray.slice(), r, newX, newY;
	for (let i = 0; i < 4; i++){
		j = Math.floor(Math.random()*rndIdx.length);
		r = rndIdx[j];
		rndIdx.splice(j,1);
		newX = x + colDir[r];
		newY = y + rowDir[r];
		if (!updateWall(x,y,newX,newY,r,false)) continue;
		if (isAnimating){
			await renderPath(x+y*cols);
			await renderPath(newX+newY*cols);
			await recursiveBackgracking(newX, newY);
		}
		else recursiveBackgracking(newX, newY);
	};
}

async function randomizedPrimsAlgorithm(start){
	let nodes = [start];
	let newNodes = [];
	start.visited = true;
	while (nodes.length > 0){
		let node = nodes.pop();
		let rndIdx = idxArray.slice();
		let r;

		for (let i = 0; i < 4; i++){
			while (rndIdx.length > 0){
				j = Math.abs(Math.floor(Math.random()*rndIdx.length));
				r = rndIdx[j]
				rndIdx.splice(j, 1);
				if (node.walls[j] === true) break;
			}
			let newX = node.x + colDir[r];
			let newY = node.y + rowDir[r];

			if (newX < 0 || newX >= cols) continue;
			if (newY < 0 || newY >= rows) continue;
			if (grid[newX+newY*cols].visited) continue;

			updateWalls(node.x,node.y,newX,newY,false,r);

			if (isAnimating){
				await renderPath(node.x+node.y*cols);
				await renderPath(newX+newY*cols);
			}
			grid[newX+newY*cols].visited = true;
			nodes.push(grid[newX+newY*cols]);
		}

	}
}

async function recursiveDivisionAlgorithm(x, maxX, y, maxY,h){
	if (isAnimating){
		draw();
		await (timeout(animationSpeed));
	}

	if (h) {
		if (maxX - x < 0) return;
		if (maxX-x > maxY-y){
			await recursiveDivisionAlgorithm(x, maxX, y, maxY,!h);
			return;
		}
		let wallY = randomValueBetween(y,maxY);

		let entrance = randomValueBetween(x,maxX);

		for (let i = x-1; i <= maxX; i++){
			if (i === entrance) continue;
			grid[i+wallY*cols].walls[0] = true;
			grid[i+(wallY-1)*cols].walls[1] = true;
		}

		await recursiveDivisionAlgorithm(x, maxX, y, wallY-1,!h);
		await recursiveDivisionAlgorithm(x, maxX, wallY+1, maxY,!h);

	}
	else {	
		if (maxY - y < 0) return;
		if (maxX-x < maxY-y){
			await recursiveDivisionAlgorithm(x, maxX, y, maxY,!h);
			return;
		}
		let wallX = randomValueBetween(x,maxX);
		let entrance = randomValueBetween(y,maxY);

		for (let i = y-1; i <= maxY; i++){
			if (i === entrance) continue;
			grid[wallX+i*cols].walls[3] = true;
			grid[wallX-1+i*cols].walls[2] = true;
		}

		await recursiveDivisionAlgorithm(x, wallX-1, y, maxY,!h);
		await recursiveDivisionAlgorithm(wallX+1, maxX, y, maxY,!h);
	}


}

function updateWall(x,y,newX,newY,i,isWall,updating=true){
	if (newX < 0 || newX >= cols) return false;
	if (newY < 0 || newY >= rows) return false;
	if (isWall == false && updating){
		if (grid[newX+newY*cols].visited) return false;
		grid[newX+newY*cols].visited = true;
	}
	updateWalls(x,y,newX,newY,isWall,i);

	return true;
}

function updateWalls(x,y,newX,newY,isWall,i){
	if (i == 0){
		 grid[newX+newY*cols].walls[1] = isWall;
		 grid[x+y*cols].walls[i] = isWall;
	}
	else if (i == 1){
		grid[newX+newY*cols].walls[0] = isWall;
		grid[x+y*cols].walls[i] = isWall;
	}
	else if (i == 2){
		grid[newX+newY*cols].walls[i] = isWall;
		grid[x+y*cols].walls[3] = isWall;
	}
	else {
		grid[newX+newY*cols].walls[3] = isWall;
		grid[x+y*cols].walls[2] = isWall;
	}
}

async function timeout(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

function randomValueBetween(min,max){
	return Math.floor(Math.random()*(max - min + 1)) + min;
}