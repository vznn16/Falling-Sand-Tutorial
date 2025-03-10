class Particle {
    constructor(x,y,color) {
    this.x = x;
    this.y = y;
    this.color = color;
    }
}

class Sand extends Particle {
    constructor(x,y,color) {
        super(x, y, "orange");
        }
}
class Water extends Particle {
    constructor(x,y,color) {
        super(x, y, "blue");
        }
}

let slider = document.getElementById("myRange");
let output = document.getElementById("demo");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
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

canvas.addEventListener("click", (event) => {
    
    const rect = canvas.getBoundingClientRect();
    
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const column = Math.floor(x / eachSize);
    const row = Math.floor(y / eachSize);
    const particleType = document.getElementById("particle")
    const value = particleType.value;
    if (value == "Sand"){
        grid[column][row] = new Sand(x,y);
    } else if (value == "Water"){
        grid[column][row] = new Water(x,y);
    } 

    

})

function update() {
    for (let i = 0; i <= (slider.value * 10); i++) {
        let col = getRandomInt(0, numColumns);
        let row = getRandomInt(0, numRows - 1);
        const box = grid[col][row] 
        
        if (box) { 
            if (box instanceof Sand || box instanceof Water)
            {
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

const clearScreen = document.getElementById("clearBtn");
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

