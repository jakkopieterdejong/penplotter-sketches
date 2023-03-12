const aspect_ratio = 1;
const cHeight = 200;
const cWidth = cHeight*aspect_ratio;
const fillFactor = 0.4;
const numLines = (cHeight/1000)*(cWidth/500)*200000*fillFactor;
let txr, characters, colors, pol, indices;

function setup() {
    // sketch settings
    createCanvas(A3_dims.short*1, A3_dims.long*1, SVG);
    textSize(20);
    noLoop();
    stroke(30);
    strokeWeight(0.6);
    noFill();
    frameRate(10);
    background(255);
    imageMode(CENTER);
    angleMode(DEGREES);

    // color dict
    colors = {
        'ink': color(29, 19, 19), 
        'blue': color(48, 196, 201), 
        'red': color(210, 32, 66),
        'yellow': color(240, 198, 156)
    }

    // create texture
   
}

function draw() {
    invertYAxis();
    translate(width/2, height/5);
    background(colors['yellow']);

    pol = createPolygon(12);
    pol.removeSelfIntersection(); 
    let d = 1.6;
    for (let i=0; i<100; i++) {
        pol.paintCurveShape();
        translate(2*d*(noise(i*0.07)-0.5), d);
        //translate(0.4*sin(i*2), d);
    }
    
}

function drawBorder(size, delta) {
    noFill()

    let d = (cWidth-size);
    beginShape();
    vertex(d+delta*randomGaussian(), d+delta*randomGaussian());
    vertex(d+delta*randomGaussian(), size+delta*randomGaussian());
    vertex(size+delta*randomGaussian(), size+delta*randomGaussian());
    vertex(size+delta*randomGaussian(), d+delta*randomGaussian());
    endShape(CLOSE);
}

function plotGrid(cols, rows) {
    let colSize = width/cols;
    let rowSize = height/rows;

    for (let i=0; i<cols; i++) {
       
        let x= i * colSize + 0.5*(colSize-cWidth)
        
        for (let j=0; j<rows; j++) { 
            
            let y= j *rowSize + 0.5*(rowSize-cHeight)
            
            push();
            translate(x, y);
            //drawBorder(cWidth*1.2, 20);
            stroke(0);
            //txr = lineTexture(cWidth, cHeight, numLines, colors['ink'])
            characters = fillPolygonArray(1, 100);
            characters[0].paintCurveShape()
            //let stamp = texturedPolygonImage(characters[0], txr)
            //image(stamp, 0, 0);
            pop();
        }
    }
}

function texturedPolygonImage(polygon, txr) {
    let maskPG = createGraphics(txr.width, txr.height);
    maskPG.fill(255);
    maskPG.stroke(color(0,0,0,0));

    maskPG.clear();
    maskPG.background(color(0, 0, 0, 0));
    polygon.paintCurveShape(maskPG);
    
    let stamp = createImage(txr.width, txr.height);
    stamp.copy(txr, 0, 0, txr.width, txr.height, 0, 0,txr.width, txr.height);
    stamp.mask(maskPG);
    
    return stamp;
}

function fillPolygonArray(N, numPoints) {
    let polygons = [];

    for (let c=0; c<N; c++) {
        let pol = donutPolygon(numPoints, cWidth*0.25, cWidth*0.4);
        pol.removeSelfIntersection();
        polygons.push(pol);
    }
    
    return polygons;
}

function donutPolygon(numPoints, radius_min, radius_max) {
    let points = [];
    for (let i=0; i<numPoints; i++) {
        let [x, y] = pol2cart(random(radius_min, radius_max), random(360));
        points.push(new Point(x+cWidth/2, y+cHeight/2))
    }
    points.push(points[0]);
    return new Polygon(points);
}

function createPolygon(numPoints) {
    // create polygon
    let points = []
    for (let i=0; i<numPoints; i++) {
        let x = random(-0.4*cWidth, 0.4*cWidth);
        let y = random(-0.25*cHeight, 0.25*cHeight);
        points.push(new Point(x, y));
    }
    points.push(points[0]);
    return new Polygon(points);
}

function mouseClicked() {
    redraw();
}

function keyPressed() {
    if (key == "s") {
        save('polyglot.svg')
        //save(txr, 'texture.svg')
    }
}