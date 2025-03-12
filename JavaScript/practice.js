class Particle {
    constructor(color) {
    this.color = color;
    }
}
class Sand extends Particle {
    constructor(color) {
        super("orange");
        }
}
class Water extends Particle {
    constructor(color) {
        super("blue");
    }
}
class Stone extends Particle {
    constructor(color) {
        super("gray");
    }
}
class Dirt extends Particle {
    constructor(color) {
        super("brown");
    }
}
class Grass extends Particle {
    constructor(color) {
        super("green");
    }
}
let speedSlider = document.getElementById("speedRange");
let speedOutput = document.getElementById("speed");
speedOutput.innerHTML = speedSlider.value;
speedSlider.oninput = function() {
    speedOutput.innerHTML = this.value;
}
let brushSlider = document.getElementById("brushRange");
let brushOutput = document.getElementById("brushSize");
brushOutput.innerHTML = brushSlider.value;
brushSlider.oninput = function() {
    brushOutput.innerHTML = this.value;
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const eachSize = 10;
const numColumns = Math.floor(canvasWidth/eachSize);
const numRows = Math.floor(canvasHeight/eachSize);

let grid = new Array(numColumns);
for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(numRows);
}
let isDragging = false;
let lastEvent = null;
canvas.addEventListener("mousedown", (event) => {

    isDragging = true;
    lastEvent = event;
    createParticle(event);
    startParticleLoop();
})
canvas.addEventListener("mousemove", (event) => {
    if(isDragging){
        lastEvent = event;
        createParticle(event);
    }
})
canvas.addEventListener("mouseup", (event) => {
    isDragging = false;

})

function createParticle(event){
    const rect = canvas.getBoundingClientRect();
    
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let column = Math.floor(x / eachSize);
    let row = Math.floor(y / eachSize);
    const particleType = document.getElementById("particle")
    const value = particleType.value;
    const brushSize = parseInt(brushSlider.value);
    for(let i = 0; i <= brushSize; i++){
        if(column - 1 >= 0 && column < numColumns && row < numRows && row >= 0){
            grid[column - 1][row] = checkParticleType(value);
        }
        if(row + 1 < numRows){
            grid[column][row + 1] = checkParticleType(value);
        }
        if(column + 1 < numColumns && row < numRows && row >= 0){
            grid[column + 1][row] = checkParticleType(value);
        }
        if(row - 1 > 0){
            grid[column][row - 1] = checkParticleType(value);
        }
        grid[column][row] = checkParticleType(value);
        column += 1
        row += 1
    }
}
function checkParticleType(value){
    if (value == "Sand"){
        return new Sand();
    } else if (value == "Water"){
        return new Water();
    }  else if (value == "Stone"){
        return new Stone();
    }   else if (value == "Dirt"){
        return new Dirt();
    }    else if (value == "Grass"){
        return new Grass();
    } 
}
function startParticleLoop() {
    function loop() {
        if (isDragging && lastEvent) {
            createParticle(lastEvent);
            requestAnimationFrame(loop);
        }
    }
    requestAnimationFrame(loop);
}
function update() {
    for (let i = 0; i <= (speedSlider.value * 10); i++) {
        let col = getRandomInt(0, numColumns);
        let row = getRandomInt(0, numRows - 1);
        const box = grid[col][row];

        if (box) { 
            if (box instanceof Sand || box instanceof Dirt || box instanceof Grass) {
                let newRow = row + 1;

                if (newRow < numRows && !grid[col][newRow]) {
                    grid[col][newRow] = grid[col][row];
                    grid[col][newRow].row = newRow;
                    grid[col][row] = null;
                } 
                else if (newRow < numRows) { 
                    let moveLeft = col > 0 && !grid[col - 1][newRow];
                    let moveRight = col < numColumns - 1 && !grid[col + 1][newRow];
                    let direction = getRandomInt(0, 1);
                    
                    if (moveLeft && moveRight) {
                        direction = getRandomInt(0, 1);
                    } else if (!moveLeft) {
                        direction = 1;
                    } else if (!moveRight) {
                        direction = 0;
                    }

                    if (direction == 0 && moveLeft) {
                        grid[col - 1][newRow] = grid[col][row];
                        grid[col - 1][newRow].row = newRow;
                        grid[col - 1][newRow].col = col - 1;
                        grid[col][row] = null;
                    } 
                    else if (direction == 1 && moveRight) {
                        grid[col + 1][newRow] = grid[col][row];
                        grid[col + 1][newRow].row = newRow;
                        grid[col + 1][newRow].col = col + 1;
                        grid[col][row] = null;
                    }
                }
            }

            else if (box instanceof Water) {
                let newRow = row + 1;

                if (newRow < numRows && !grid[col][newRow]) {
                    grid[col][newRow] = grid[col][row]; 
                    grid[col][newRow].row = newRow;
                    grid[col][row] = null;
                } 
                else if (newRow < numRows && grid[col][newRow] instanceof Dirt) {
                    grid[col][newRow] = checkParticleType("Grass"); 
                } 
                else { 
                    let moveLeft = col > 0 && !grid[col - 1][row]; 
                    let moveRight = col < numColumns - 1 && !grid[col + 1][row]; 
                    
                    let direction = getRandomInt(0, 2); 
                    if (!moveLeft) direction = 2;
                    if (!moveRight) direction = 0;

                    if (direction <= 1 && moveLeft) { 
                        grid[col - 1][row] = grid[col][row]; 
                        grid[col - 1][row].col = col - 1;
                        grid[col][row] = null;
                    } 
                    else if (direction >= 2 && moveRight) { 
                        grid[col + 1][row] = grid[col][row]; 
                        grid[col + 1][row].col = col + 1;
                        grid[col][row] = null;
                    }
                }
            }
        }
    }
}


function reDraw() {
    update()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < numColumns; col++) {
        for (let r = 0; r < numRows; r++) {
            const box = grid[col][r];
            if (box) {
                ctx.fillStyle = box.color;
                ctx.fillRect(col * eachSize, r * eachSize, eachSize, eachSize);
            }
        }
    }
}

const clearScreen = document.getElementById("clear-button");
clearScreen.addEventListener("click", () => {
    clearGrid();
    
})
function clearGrid() {
    for (let col = 0; col < numColumns; col++) {
        for (let r = 0; r < numRows; r++) {
            const box = grid[col][r];
            if (box) {
                grid[col][r] = null;
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

setInterval(reDraw, 1);

