let y_step = 5;
let x_step_min = 2;
let x_step_max = 3.5;

function setup() {
    noLoop();
    createCanvas(A4_dims.short, A4_dims.long, SVG);

}

function draw() {
    background(240);

    for (let y=0; y + y_step < height; y += y_step) {
        
        let x_step_1 = 6+sin(y*10);//random(x_step_min, x_step_max);
        let x_step_2 = 4+100*noise(y*0.01)//random(x_step_min, x_step_max);

        for (let x = random(-x_step_1, x_step_1); x < width; x += x_step_1) {
            line(x, y, x, y+y_step+randomGaussian(0, 0.5));
        }
        
        for (let x = 0; x < width; x += x_step_2) {
            line(x, y, x, y+y_step+randomGaussian(0, 0.5));
        }
    }
}

function mouseClicked() {
    redraw();
}

function keyPressed() {
    if (key == "s") {
        save('bridgelines.svg')
    }
}