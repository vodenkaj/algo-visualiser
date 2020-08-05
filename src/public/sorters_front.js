const selector = document.getElementById('algo-selector');
const sort = document.getElementById('start-sort');
const regenerate = document.getElementById('new-values');
let isRunning = false, isAnimating = false, animationSpeed = 0;
let values;
const speed = document.getElementById('animation-speed');

speed.onchange = _ => {
	setAnimationSpeed();
}

window.onload = () => {
	values = generateValues();
}

regenerate.onmouseup = () => {
	if (isRunning) return;
	values = generateValues();
}

sort.onmouseup = (e) => {
	if (isRunning){
		isAnimating = false;
		return;
	}
	isRunning = true;
	isAnimating = true;
	updateValues(null,null,null,[0,values.length]);
	switch (selector.selectedIndex){
		case 0:
			selectionSort().then(_ => resetAfterAnimation())
			break;
		case 1:
			bubbleSort().then(_ => resetAfterAnimation());
			break;
		case 2:
			insertionSort().then(_ => resetAfterAnimation());
			break;
		case 3:
			const auxArray = values.slice();
			mergeSort(values, auxArray, 0, auxArray.length-1).then(_ => resetAfterAnimation());
			break;
		case 4:
			heapSort().then(_ => resetAfterAnimation());
			break;
		case 5:
			quickSort(values, 0, values.length-1).then(_ => resetAfterAnimation());
			break;
		case 6:
			radixSort().then(_ => resetAfterAnimation());
			break;
		case 7:
			countingSort().then(_ => resetAfterAnimation());
			break;
		case 8:
			shellSort().then(_ => resetAfterAnimation());
			break;
		case 9:
			combSort().then(_ => resetAfterAnimation());
			break;
	}
	changeButtonText(sort, 'Finish','#D02536');
}

function resetAfterAnimation(){
	updateValues(null,null,[0,values.length]);
	isRunning = false;
	changeButtonText(sort, 'Sort','');
}

function changeButtonText(element, text, color){
	element.innerText = text;
	element.style.backgroundColor = color;
}

function setAnimationSpeed(){
	if (speed.value){
		animationSpeed = speed.value;
	}
}