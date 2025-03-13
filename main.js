import { redraw, getMouse, setUpMouseListeners, createParticle, getRandomLocation, getParticle } from "./canvas.js";

const speedSlider = document.getElementById("speedRange");

function update() {
    const {isDragging, mousePosition} = getMouse();
    if (isDragging && mousePosition) {
        createParticle(mousePosition);
    }
    for (let i = 0; i <= (speedSlider.value * speedSlider.value); i++) {
        const {row, col} = getRandomLocation();
        const particle = getParticle(row, col);
        if (!particle) {
            continue;
        } 

        particle.update(row, col);
    }
    redraw();
}

setUpMouseListeners();
setInterval(update, 1);