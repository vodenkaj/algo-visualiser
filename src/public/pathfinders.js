const rowDir = [-1,1,0,0];
const colDir = [0,0,-1,1];

async function depthFirstSearch(x,y){
	for (let i = 0; i < 4; i++){
		let newX = x + colDir[i];
		let newY = y + rowDir[i];

		if (!constraints(x,y,newX,newY,i)) continue;

		grid[newX+newY*cols].visited = true;
		if (grid[newX+newY*cols].isFinish) return [x,y];
		if (isAnimating) await renderPath(newX+newY*cols);
		else renderPath(newX+newY*cols);
		let result = await depthFirstSearch(newX, newY);
		if (result != null) return result;
		markPath(newX+newY*cols);
	}
	return null;;
}

async function breadthFirstSearch(x=0,y=0){
	const rowQueue = [y];
	const cellQueue = [x];
	const map = new Map();
	while (rowQueue.length > 0){
		while (rowQueue.length > 0){
			let x = cellQueue.shift();
			let y = rowQueue.shift();
			if (grid[x+y*cols].isFinish){
				let arr = map.get(`${grid[x+y*cols].y} ${grid[x+y*cols].x}`);
				let nodeBefore = `${arr[0]} ${arr[1]}`;
				while (!grid[arr[1]+arr[0]*cols].isStart){
					if (isAnimating) await renderPath(arr[1]+arr[0]*cols);
					else renderPath(arr[1]+arr[0]*cols);
					arr = map.get(nodeBefore);
					map.delete(nodeBefore);
					nodeBefore = `${arr[0]} ${arr[1]}`;
				}
				return;
			}
			if (!grid[x+y*cols].isStart){
				if (isAnimating) await markPath(x+y*cols);
				else markPath(x+y*cols);
			} 

			bfsSearch(x, y, rowQueue, cellQueue, map);
		}
	}
}

function bfsSearch(x,y, rowQueue, cellQueue, map){
	for (let i = 0; i < 4; i++){
		let newX = x + colDir[i];
		let newY = y + rowDir[i];

		if (!constraints(x,y,newX,newY,i)) continue;

		grid[newX+newY*cols].visited = true;
		map.set(`${newY} ${newX}`, [y, x]);
		rowQueue.push(newY);
		cellQueue.push(newX);
	}
}

async function dijkstraAlgorithm(start){
 	let queue = [start];
 	let newQueue = [];
 	let currentNode;
 	start.hCost = 0;
 	while (queue.length > 0){
 		currentNode = queue.shift();
 		
 		for (let i = 0; i < 4; i++){
 			let newX = currentNode.x + colDir[i];
			let newY = currentNode.y + rowDir[i];

			if (!constraints(currentNode.x,currentNode.y,newX,newY,i)) continue;
			let newNode = grid[newX+newY*cols];
			let newDistance = newNode.gCost + currentNode.hCost;
			newNode.hCost = newNode.hCost > newDistance ? newDistance : newNode.hCost;
			
			if (newNode.isFinish){
				await findShortestPath(newNode);
				return;
			}

			if (isAnimating) await markPath(newX+newY*cols);
			else markPath(newX+newY*cols);
			newNode.drawDistanceNumber();
			newNode.visited = true;
			queue.push(newNode);
 		}
 	}

 }

 async function findShortestPath(node){
 	if (node.isStart){
 		return node;
 	}
 	let nextNode = null;
 	for (let i = 0; i < 4; i++){
 		let newX = node.x + colDir[i];
		let newY = node.y + rowDir[i];

		if (!constraints(node.x,node.y,newX,newY,i,true)) continue;
		if (nextNode == null || grid[newX+newY*cols].hCost < nextNode.hCost){
			nextNode = grid[newX+newY*cols];
			if (nextNode.isStart) return;
		}
		
 	}
 	if (!nextNode.isFinish){
 		if (isAnimating) await renderPath(nextNode.x+nextNode.y*cols);
 		else renderPath(nextNode.x+nextNode.y*cols);
 	}
 	if (w >= 20) nextNode.drawDistanceNumber();
 	await findShortestPath(nextNode);

}

async function greedyBestFirstSearch(){
	const queue = [new QueueElement(startNode,0)];
	while (queue.length > 0){
		const node = queue.shift().node;
		if (node.isFinish){
			break;
		}
		if(!node.isStart) {
			if (isAnimating) await renderPath(node.x+node.y*cols,0);
			else renderPath(node.x+node.y*cols,0);
			node.drawDistanceNumber()
		}
		for (let i = 0; i < 4; i++){
	 		let newX = node.x + colDir[i];
			let newY = node.y + rowDir[i];
			if (!constraints(node.x,node.y,newX,newY,i)) continue;
			const currentNode = grid[newX + newY*cols];
			const distanceFromFinish = heuristic(currentNode);
			currentNode.hCost = distanceFromFinish;
			addNodeToQueue(queue,currentNode,distanceFromFinish);
		}
		node.visited = true;
	}
}

async function aStarAlgorithm(node){
	node.hCost = 0;
	const queue = [new QueueElement(node, 0)];
	const visitedNodes = [];
	while (queue.length > 0){
		const node = queue.shift().node;
		if (node.isFinish){
			await findShortestPath(node);
			break;
		}
		if(!node.isStart) {
			if (isAnimating) await markPath(node.x+node.y*cols,0);
			else markPath(node.x+node.y*cols,0);
			node.drawDistanceNumber()
		}
		for (let i = 0; i < 4; i++){
			let newX = node.x + colDir[i];
			let newY = node.y + rowDir[i];
			if (!constraints(node.x,node.y,newX,newY,i)) continue;
			const currentNode = grid[newX + newY*cols];
			const distanceFromFinish = node.hCost + currentNode.gCost;
			if (visitedIncludes(visitedNodes, currentNode, distanceFromFinish)) continue;
			currentNode.hCost = distanceFromFinish;
			visitedNodes.push(node);

			addNodeToQueue(queue,currentNode,distanceFromFinish+heuristic(currentNode));
		}
	}
}

function heuristic(node) {
	return (Math.abs(node.x-finishNode.x)+Math.abs(node.y-finishNode.y));
}

function QueueElement(node,priority){
	this.node = node;
	this.priority = priority;
}

function visitedIncludes(queue,node,cost){
	for (let i = 0; i < queue.length; i++){
		if (queue[i] === node){
			if (queue[i].hCost > cost){
				queue[i].hCost = cost;
				return false;
			}
			return true;
		}
	}
	return false;
}

function addNodeToQueue(queue,node,priority){
	const newNode = new QueueElement(node, priority);
	if (queue.length === 0){
		queue.push(newNode);
		return;
	}

	for (let i = 0; i < queue.length; i++){
		if (queue[i].node === newNode.node) return;
		if (queue[i].priority > priority){
			queue.splice(i, 0, newNode);
			return;
		}
	}
	queue.push(newNode);
}

function constraints(x,y,newX,newY,i,backtrack=false){
	if (newX < 0 || newX >= cols) return false;
	if (newY < 0 || newY >= rows) return false;
	if (!backtrack && grid[newX+newY*cols].visited) return false;
	if (i == 0 && grid[x+y*cols].walls[0]) return false;
	if (i == 1 && grid[x+y*cols].walls[1]) return false;
	if (i == 2 && grid[x+y*cols].walls[3]) return false;
	if (i == 3 && grid[x+y*cols].walls[2]) return false;
	return true;
 }