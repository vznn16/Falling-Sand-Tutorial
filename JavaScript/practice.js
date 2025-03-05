class Box {
    constructor(x,y) {
    this.x = x;
    this.y = y;
    }
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const eachSize = 20;
const numColumns = Math.floor(canvasWidth/eachSize);
const numRows = Math.floor(canvasHeight/eachSize);

let grid = new Array(numColumns);
for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(numRows);
}

canvas.addEventListener("click", (event) => {
    // console.log(event.clientX)
    // console.log(event.clientY)
    
    const rect = canvas.getBoundingClientRect();
    
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    clearCanvas(ctx,grid);
    const column = Math.floor(x / eachSize);
    const row = Math.floor(y / eachSize);
    grid[column][row] = new Box(x,y);
    
    
    ctx.fillStyle = "red";
    // for (let col = 0; col < numColumns; col++) {
    //     for (let row = numRows-1; row > 0; row--) {
    //         grid[col][row] = grid[col][row-1];
    //     }
    //     grid[col][0] = null;
    // }
    
    console.log(grid)
    ctx.fillStyle = "red";
    for (let col = 0; col < numColumns; col++) {
        for (let r = 0; r < numRows; r++) {
            const box = grid[col][r];
            if (box) {
                ctx.fillRect(box.x, box.y, 50, 50);
                console.log(grid)
            }
        }
    }
    

})

function clearCanvas (ctx,grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < numColumns; col++) {
        for (let r = 0; r < numRows; r++) {
            const box = grid[col][r];
            if (box) {
                grid[col][r] = null;
            }
        }
    }
}