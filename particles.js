import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    swap(other) {
        return false;
    }

    update() {

    }
}

export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        return other.type == "water";
    }

    update(row, col) {
        let newRow = row + 1;
        if (!checkBounds(newRow, col)) {
            return;
        }

        // If nothing below move down
        if (!moveParticle(row, col, newRow, col, this.swap)) {
            // Try to move left
            if (!moveParticle(row, col, newRow, col-1, this.swap)) {
                // Move right
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }
    }
}

export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        // Make dirt below grass
        if (getParticle(row+1, col)?.type == "dirt") {
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        }

        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        } 
        
        // If nothing below, move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}

export class Stone extends Particle {
    constructor() {
        super();
        this.color = "gray";
        this.type = "stone";
    }
}

export class Dirt extends Sand {
    constructor() {
        super();
        this.color = "brown";
        this.type = "dirt";
    }
}

export class Grass extends Sand {
    constructor() {
        super();
        this.color = "green";
        this.type = "grass";
    }
}

export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } 
    else if (value == "Water") {
        return new Water();
    }  
    else if (value == "Stone") {
        return new Stone();
    }   
    else if (value == "Dirt") {
        return new Dirt();
    }    
    else if (value == "Grass") {
        return new Grass();
    } 
}