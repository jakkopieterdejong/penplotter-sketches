let lm;
let sf = 4;

function setup() {
    createCanvas(A4_dims.short * sf, A4_dims.long * sf, SVG);
    noLoop();

    lm = new LayerManager(2);
    lm.layers[0].stroke(255, 0, 0, 125);
    lm.layers[0].noFill();

    lm.layers[1].stroke(0, 0, 255, 125);
    lm.layers[1].noFill();
}

function draw() {
    background(255);
    lm.clear();

    let d = 6*sf;
    let nv;
    let nf = 0.003;

    for (let x=0; x<width; x+=d) {
        for (let y=0; y<height; y+=d) {
            nv = constrain(noise(x*nf, y*nf), 0, 0.9);
            lm.layers[0].circle(x, y, nv*d);
            lm.layers[1].circle(x+0.5*d, y+0.5*d, (1-nv)*d);   
        }
    }
    
    lm.paint();
}

function mouseClicked() {
    redraw();
}

function keyPressed() {
    if (key == "s") {
        lm.save(fname='dots')
    }
}