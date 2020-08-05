const container = document.querySelector('.wrapper');
const amount = document.getElementById('amount-of-values');
let valuesBefore = [];

function generateValues(){
	let arr = [];
	const size = amount.value ? parseInt(amount.value) : 500;
	let max = -1;
	for (let i = 0; i < size; i++){
		const value = Math.floor(Math.random() * 5000);
		arr.push(value);
		if (value > max) max = value;
	}
	arr = arr.map(x => [x, x/max*100]);
	showValues(arr);
	return arr;
}

async function heapSort(){
	await generateMaxHeap(values, values.length);
	let lastIdx = values.length-1;
	while (lastIdx > 1){
		const before = values[lastIdx];
		values[lastIdx--] = values[0];
		values[0] = before;
		if (isAnimating) await update(0, [0,0], [0 , lastIdx+1], [lastIdx+1 , values.length]);
		else update(0, [0,0], [0 , lastIdx+1], [lastIdx+1 , values.length]);
		await generateMaxHeap(values, lastIdx);
		if (isAnimating) await update(0, null, null, null, [0, lastIdx]);
		else update(0, null, null, null, [0, lastIdx]);
	}
	if (isAnimating) await update(0, null, null, [1, 0]);
	else update(0, null, null, [1, 0]);
}

async function generateMaxHeap(heap, lastIdx){
	for (let i = 1; i < lastIdx; i++){
		for (let j = i; j > 0; j--){
			const parentIdx = Math.floor(j/2);
			if (heap[j][0] > heap[parentIdx][0]){
				const before = heap[parentIdx];
				heap[parentIdx] = heap[j];
				heap[j] = before;
				if (isAnimating) await update(0, [j, parentIdx], [j, parentIdx]);
				else update(0, [j, parentIdx], [j, parentIdx]);
			}
		}
	}
}

function showValues(arr){
	let domString =  '';
	for (let i = 0; i < arr.length; i++){
		domString += `<a class='value' style='height:${arr[i][1]}%'></a>`
	} 
	container.innerHTML = domString;
}

function updateValues(scan, found, sorted, reset, vals){
	if (reset){
		for (let o = reset[0]; o < reset[1]; o++){
			container.children[o].style.background = '';
		}
	}
	if (found){
		container.children[found[0]].style.height = vals[found[0]][1] + '%';
		container.children[found[1]].style.height = vals[found[1]][1] + '%';
	}

	if (sorted) {
		for (let o = sorted[0]; o < sorted[1]; o++){
			container.children[o].style.background = '#0094C6';
		}
	}

	if (scan) {
		container.children[scan[0]].style.background = '#FFBA08';
		container.children[scan[1]].style.background = '#FFBA08';
	}

}

async function selectionSort(){
	for (let i = 0; i < values.length; i++){
		let min = values[i], idx = i;
		for (let j = i; j < values.length; j++){
			if (isAnimating) await update(0,[i, j]);
			else update(0,[i, j]);
			if (min[0] > values[j][0]) {
				min = values[j];
				idx = j;
				}
		}
		const before = values[i];
		values[i] = min;
		values[idx] = before;
		if (isAnimating) await update(0, null, [i, idx], [0, i], [i+1, values.length-1]);
		else update(0, null, [i, idx], [0, i], [i+1, values.length-1]);
	}
}

async function bubbleSort(){
	let idx = values.length-1;
	while (idx > 0){
		for (let i = 0; i < idx; i++){
			if (values[i][0] > values[i+1][0]){
				const before = values[i];
				values[i] = values[i+1];
				values[i+1] = before;
				if (isAnimating) await update(0, [i, i+1], [i, i+1]);
				else  update(0, [i, i+1], [i, i+1]);
			}
		}
		if (isAnimating) await update(0, null, null, [idx, values.length], [0, idx]);
		else update(0, null, null, [idx, values.length], [0, idx]);
		idx--;
	}
}

async function insertionSort(){
	for (let i = 1; i < values.length; i++){
		const key = values[i];
		let j = i-1;
		while (j >= 0 && key[0] < values[j][0]){
			values[j+1] = values[j--];
			if (isAnimating) await update(0,[j+2, j+1], [j+2, j+1]);
			else update(0,[j+2, j+1], [j+2, j+1]);
		}
		values[j+1] = key;
		if (isAnimating) await update(0, null, [j+2, j+1], [0,i]);
		else update(0, null, [j+2, j+1], [0,i]);
	}
}

async function mergeSort(mainArr, auxArray, startIdx, endIdx){
	if (startIdx === endIdx) return;
	const middleIdx = Math.floor((startIdx + endIdx) / 2);
	await mergeSort(auxArray, mainArr, startIdx, middleIdx);
	await mergeSort(auxArray, mainArr, middleIdx + 1, endIdx);
	await merge(mainArr, startIdx, middleIdx, endIdx, auxArray);
}

async function merge(mainArr, startIdx, middleIdx, endIdx, auxArray){
	let k = startIdx;
  	let i = startIdx;
  	let j = middleIdx + 1;

	while (i <= middleIdx && j <= endIdx){
		if (auxArray[i][0] <= auxArray[j][0]){
			mainArr[k++] = auxArray[i++];
			if (isAnimating) await update(0, [k-1, i-1], [k-1, i-1], null,null,mainArr);
			else update(0, [k-1, i-1], [k-1, i-1], null,null,mainArr);
		}
		else {
			mainArr[k++] = auxArray[j++];
			if (isAnimating) await update(0, [k-1, j-1], [k-1, j-1], null, null,mainArr);
			else update(0, [k-1, j-1], [k-1, j-1], null, null,mainArr);
		}
	}	

	while (i <= middleIdx){
		mainArr[k++] = auxArray[i++];
		if (isAnimating) await update(0, [k-1, i-1], [k-1, i-1], null, null,mainArr);
		else update(0, [k-1, i-1], [k-1, i-1], null, null,mainArr);
	}

	while (j <= endIdx){
		mainArr[k++] = auxArray[j++];
		if (isAnimating) await update(0, [k-1, j-1], [k-1, j-1], null, null,mainArr);
		else update(0, [k-1, j-1], [k-1, j-1], null, null,mainArr);
	}
	if (isAnimating) await update(0, null,null,[0, j], null, mainArr);
	else update(0, null,null,[0, j], null, mainArr);
}

async function quickSort(mainArr, startIdx, endIdx){
	if (startIdx >= endIdx) return;
	let i = startIdx+1, j = endIdx;
	while (i <= j){
		if (isAnimating) await update(0, [startIdx, i]);
		else update(0, [startIdx, i]);
		if (mainArr[startIdx][0] < mainArr[i][0]){
			while (j >= i){
				if (mainArr[j][0] <= mainArr[startIdx][0]){
					const before =  mainArr[i];
					mainArr[i] = mainArr[j];
					mainArr[j] = before;
					if (isAnimating) await update(0, [j, endIdx], [i, j]);
					else update(0, [j, endIdx], [i, j]);
					j--;
					break;
				}else if (isAnimating) await update(0, [j, endIdx]);
				else update(0, [j, endIdx]);
				j--;
			}
		}
		i++;
	}
	const before = mainArr[j];
	mainArr[j] = mainArr[startIdx];
	mainArr[startIdx] = before;
	if (isAnimating) await update(0, null, [j, startIdx], [0,j+1], [j, values.length]);
	else update(0, null, [j, startIdx], [0,j+1], [j, values.length]);
	await quickSort(mainArr, startIdx, j-1);
	await quickSort(mainArr, j+1, endIdx);
	
}

async function radixSort(){
	let max = values[0];
	values.forEach((x) => {
		if (max[0] < x[0]) max = x;
	})
	max = max[0].toString();
	values.map((x) => {
		let s = x[0].toString();
		let n = '';
		for (let i = max.length - s.length; i > 0; i--){
			n += 0;
		}
		x[0] = n + s;

	})


	for (let i = 1; i <= max.length; i++){

		const buckets = []
		for (let i = 0; i <= 9; i++){
			buckets.push([]);
		}
		for (let j = 0; j < values.length; j++){
			const val = values[j][0][max.length-i];
			buckets[val].push([values[j], j]);
		}
		await update(0, null, null,null,[0, values.length]);
		let idx = 0;
		for (let j = 0; j < buckets.length; j++){
			for (let k = 0; k < buckets[j].length; k++){
				values[idx++] = buckets[j][k][0];
				if(isAnimating) await update(0, [idx-1, buckets[j][k][1]], [idx-1, buckets[j][k][1]]);
				else update(0, [idx-1, buckets[j][k][1]], [idx-1, buckets[j][k][1]]);
			}
		}
	}
	if (isAnimating) await update(0, null,null, [0, values.length]);
	else update(0, null,null, [0, values.length]);
}

async function countingSort(){
	const arr = new Array(5000).fill(0);
	for (let i = 0; i < values.length; i++){
		arr[values[i][0]]++;
	}
	for (let i = 1; i < 5000; i++){
		arr[i] += arr[i-1];
	}
	const newArr = values.slice();
	let idxG = 0;
	for (let i = 0; i < values.length; i++){	
		const idx = (arr[values[i][0]]--)-1;
		newArr[idx] = values[i];
		if (isAnimating) await update(0,[idx,i], [idx, i], [idx, i], null, newArr);
		else update(0,[idx,i], [idx, i], [idx, i], null, newArr);
	}
	if (isAnimating) await update(0,null, null, [0, newArr.length], null, newArr);
	else update(0,null, null, [0, newArr.length], null, newArr);
}

async function shellSort(){
	let gap = Math.floor(values.length/2);
	while (gap > 1){
		for (let i = 0; i < gap; i++){
			if (isAnimating) await update(0,[i,gap+i]);
			else update(0,[i,gap+i]);
			if (values[i][0] > values[gap+i][0]){
				const before = values[gap+i];
				values[gap+i] = values[i];
				values[i] = before;
				if (isAnimating) await update(0,null, [i, gap+i]);
				else update(0,null, [i, gap+i]);
			}

		}
		if (isAnimating) await update(0,null,null,null,[0, values.length]);
		else update(0,null,null,null,[0, values.length]);
		gap = Math.floor(gap/2);
	}
	await insertionSort();
}

async function combSort(){
	gap = values.length;
	let swapped = true;

	while (gap != 1 || swapped){
		gap = Math.floor(getNextGap(gap));

		swapped = false;

		for (let i = 0; i < values.length-gap; i++){
			if (values[i][0] > values[i+gap][0]){
				const before = values[i];
				values[i] = values[i+gap];
				values[i+gap] = before;
				swapped = true;
				if (isAnimating) await update(0,[i, i+gap],[i, i+gap], [0,i]);
				else update(0,[i, i+gap],[i, i+gap], [0,i]);
			}
		}
		if (isAnimating) await update(0,null,null,null,[0, values.length]);
		else update(0,null,null,null,[0, values.length]);
	}
	if (isAnimating) await update(0,null,null, [0,values.length]);
	else update(0,null,null, [0,values.length]);
}

function getNextGap(gap){
	const newGap = (gap * 10)/13;
	return newGap < 1 ? 1 : newGap;
}

async function update(ms, scan, found, sorted, reset, vals=values){
	updateValues(scan,found,sorted,reset, vals)
	return new Promise(resolve => setTimeout(resolve, animationSpeed));
}