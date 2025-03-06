class Particle {
    constructor(x,y) {
    this.x = x;
    this.y = y;
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
    grid[column][row] = new Particle(x,y);
    

})

function update () {
    
    for(let i = 0; i <= (slider.value * 10); i++){
        let col = getRandomInt(0,numColumns);
        let row = getRandomInt(0,numRows);
        const box = grid[col][row];
        if(box){
            if (row+1 < numRows && !grid[col][row+1]) { 
                grid[col][row+1] = grid[col][row];
                grid[col][row+1].row = row+1;
                grid[col][row] = null;
            }
        } 
    }
    
}
function reDraw() {
    update()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "orange";
    for (let col = 0; col < numColumns; col++) {
        for (let r = 0; r < numRows; r++) {
            const box = grid[col][r];
            if (box) {
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

