let img, pg;
const debugging = false;

function preload() {
  img = loadImage('./assets/Spheer.ai-46.jpg');
}

function setup() {
    createCanvas(A4_dims.short*4, A4_dims.long*4, SVG);
    pg = createGraphics(width, height);
    
    img.filter(GRAY);
    img.filter(BLUR, 4);    
    if (img.width/img.height > width/height) {
        img.resize(width, 0);
    }
    else {
        img.resize(0, height);
    }
    print(width, height, img.width, img.height);
    print(pixelDensity())
    pg.image(img, (width-img.width)/2, (height-img.height)/2);
    
    noLoop();
    noFill();
    strokeWeight(1);
    stroke(0);
}

function draw() {
    interferenceCircles(3, -2)
    //interferenceLines(12, 50)
    if (debugging) {
        background(0);
        image(pg, 0, 0)
    }
}

function getPixelIntensity(img, x, y) {
    let d = pixelDensity();
    let index = 4*(x+y*width);
    return (img.pixels[index] + img.pixels[index+1] + img.pixels[index+2]) / (3*255);
}

function interferenceLines(y_step, displacement_factor) {
    pg.loadPixels();

    for (let y=0; y<=height; y+=y_step) {
        line(0, y, width, y);
        
        beginShape();
        curveVertex(0, y);
        for (let x=0; x<=width; x+=y_step){
            let intensity = getPixelIntensity(pg, x, y);
            let displacement = (1-intensity)*displacement_factor;
            curveVertex(x, y+displacement);
        }
        curveVertex(width, y);
        endShape();
    }
}

function interferenceCircles(r_step, displacement_factor) {
    pg.loadPixels();
    let x, y, intensity, displacement, th_step;
    let y_offset = -320;
    let x_offset = -20;
    let sc = 0.6;

    for (let r=r_step; r<=width/2; r+=r_step) {
        th_step = 2*PI / (2*PI*r / r_step);
        circle(width/2, height/2, 2*r);
        
        beginShape();
        for (let th=0; th<2*PI; th+=th_step) {
            [x, y] = pol2cart(r*sc, th);
            x = round(x + width/2 + x_offset);
            y = round(y + height/2 + y_offset);
            
            intensity = getPixelIntensity(pg, x, y)
            displacement = (1-intensity)*displacement_factor;
                    
            [x, y] = pol2cart(r+displacement, th);
            vertex(x + width/2, y + height/2);
        }
        endShape(CLOSE);
    }
    
}

function keyPressed() {
    if (key=="s"){
        save('lines.svg')
    }
}

