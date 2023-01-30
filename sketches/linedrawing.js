let img;
function preload() {
  img = loadImage('assets/roos.jpg');
}

function setup() {
    img.resize(0, 600);
    img.filter(GRAY);
    img.filter(BLUR, 2);    
    createCanvas(img.width, img.height, SVG);
    
    background(0);
    noLoop();
    noFill();
    strokeWeight(1);
    stroke(255);
    //angleMode();
}

function draw() {
    background(0);
    interferenceCircles(img, 4, -2)
}

function interferenceLines(img) {
    img.loadPixels();

    for (let y=0; y<=height; y+=3) {
        line(0, y, width, y);
        
        beginShape();
        curveVertex(0, y);
        for (let x=0; x<=width; x+=1){
            let index = 4*(x+y*width);
            let intensity = (img.pixels[index] + img.pixels[index+1] + img.pixels[index+2]) / 3;
            let displacement = -(intensity/255)*20
            curveVertex(x, y+displacement);
        }
        curveVertex(width, y);
        endShape();
    }
}

function interferenceCircles(img, r_step, displacement_factor) {
    img.loadPixels();
    let index, x, y, intensity, displacement, th_step;

    for (let r=r_step; r<=width/2; r+=r_step) {
        th_step = 2*PI / (2*PI*r / r_step);
        circle(width/2, height/2, 2*r);
        
        beginShape();
        for (let th=0; th<2*PI; th+=th_step) {
            //print(th_step);
            [x, y] = pol2cart(r, th);
            x = round(x + width/2);
            y = round(y + height/2);
            
            index = 4*(x+y*width);
            if (index >=0 & index <= 4*img.width*img.height){
                intensity = (img.pixels[index] + img.pixels[index+1] + img.pixels[index+2]) / 3;
                displacement = (intensity/255)*displacement_factor;
            }
            else {displacement = 0}
                    
            [x, y] = pol2cart(r+displacement, th);
            curveVertex(x + width/2, y + height/2);
        }
        endShape(CLOSE);
    }
    
}

function keyPressed() {
    if (key="s"){
        save('lines.svg')
    }
}

