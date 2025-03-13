import { checkParticleType } from "./particles.js";
import { getRandomInt } from "./util.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// Setup sliders
const speedSlider = document.getElementById("speedRange");
const speedOutput = document.getElementById("speed");
const brushSlider = document.getElementById("brushRange");
const brushOutput = document.getElementById("brushSize");

speedOutput.innerHTML = speedSlider.value;
speedSlider.oninput = function() {
    speedOutput.innerHTML = this.value;
}
brushOutput.innerHTML = brushSlider.value;
brushSlider.oninput = function() {
    brushOutput.innerHTML = this.value;
}

// Setup clear button
const clearScreen = document.getElementById("clear-button");
clearScreen.addEventListener("click", () => {
    clearGrid();
});

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const eachSize = 10;

const numberOfRows = Math.floor(canvasHeight/eachSize);
const numberOfColumns = Math.floor(canvasWidth/eachSize);

let grid = new Array(numberOfRows);
for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(numberOfColumns);
}

export function checkBounds(row, col) {
    return row < grid.length && row >= 0 && col < grid[0].length && col >= 0;
}

export function moveParticle(row, col, newRow, newCol, swap) {
    if (!checkBounds(row, col) || !checkBounds(newRow, newCol)) {
        return false;
    }
    if (getParticle(newRow, newCol)) {
        if (swap(getParticle(newRow, newCol))) {
            const temp = grid[newRow][newCol];
            grid[newRow][newCol] = grid[row][col];
            grid[row][col] = temp;
        }
        else {
            return false;
        }
    }
    else {
        grid[newRow][newCol] = grid[row][col];
        grid[row][col] = null;
    }
    return true;
}

export function getRandomLocation() {
    const row = getRandomInt(0, grid.length);
    const col = getRandomInt(0, grid[0].length);
    return {row, col};
}

export function getParticle(row, col) {
    if (!checkBounds(row, col)) {
        return null;
    }
    return grid[row][col];
}

export function setParticle(row, col, particle) {
    if (!checkBounds(row, col)) {
        return;
    }
    grid[row][col] = particle;
}

export function createParticle(mousePosition) {
    const rect = canvas.getBoundingClientRect();
    
    const y = mousePosition.clientY - rect.top;
    const x = mousePosition.clientX - rect.left;
    
    const row = Math.floor(y / eachSize);
    const col = Math.floor(x / eachSize);
    
    const particleType = document.getElementById("particle");
    const value = particleType.value;
    const brushSize = parseInt(brushSlider.value);

    const brushSpread = (row, col, size) => {
        if (!checkBounds(row, col)) {
            return;
        }
        grid[row][col] = checkParticleType(value);
        if (size > 1) {
            size -= 1;
            brushSpread(row+1, col, size);
            brushSpread(row-1, col, size);
            brushSpread(row, col+1, size);
            brushSpread(row, col-1, size);
        }
    }
    
    brushSpread(row, col, brushSize);
}

let isDragging = false;
let mousePosition = null;
export function getMouse() {
    return {isDragging, mousePosition};
}

export function setUpMouseListeners() {
    canvas.addEventListener("mousedown", (event) => {
        isDragging = true;
        mousePosition = {clientX: event.clientX, clientY: event.clientY};
    });
    canvas.addEventListener("mousemove", (event) => {
        mousePosition = event;
    });
    canvas.addEventListener("mouseup", (event) => {
        isDragging = false;
    });
}

export function clearGrid() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            grid[row][col] = null;
        }
    }
}

export function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const box = grid[row][col];
            if (box) {
                ctx.fillStyle = box.color;
                ctx.fillRect(col * eachSize, row * eachSize, eachSize, eachSize);
            }
        }
    }
}