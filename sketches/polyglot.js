const aspect_ratio = 1;
const cHeight = 400;
const cWidth = cHeight*aspect_ratio;
const fillFactor = 0.6;
const numLines = (cHeight/1000)*(cWidth/500)*200000*fillFactor;
let txr, characters, colors, pol, indices;

function setup() {
    // sketch settings
    createCanvas(2000, 2000);
    textSize(20);
    noLoop();
    stroke(30);
    frameRate(10);
    background(255);
    imageMode(CENTER);

    // color dict
    colors = {
        'ink': color(29, 19, 19), 
        'blue': color(48, 196, 201), 
        'red': color(210, 32, 66),
        'yellow': color(240, 198, 156)
    }
    fill(colors['ink']);

    // create texture
    txr = lineTexture(cWidth, cHeight, numLines, colors['ink'])
}

function draw() {
    invertYAxis();
    background(colors['yellow']);
    plotGrid()
    
    //translate((width-cWidth)/2, (height-cHeight)/2);
    
    //indices = pol.selfIntersection();
    //if (indices.length > 0){
    //    pol.paint();
     //   let [i, j] = random(indices);
    //    pol.swapPoints(i, j);
    //}    
    //else {
    //    pol.paintCurveShape();
    //}
}

function plotGrid() {
    for (let x=0; x<5; x++) {
        for (let y=0; y<5; y++) { 
            push();
            translate((x+0.5)*cWidth, (y+0.5)*cHeight);
            
            characters = fillPolygonArray(1, 5+10*x);
            let stamp = texturedPolygonImage(characters[0], txr)
            image(stamp, 0, 0);
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
        let pol = createPolygon(numPoints);
        
        // remove self-intersection
        let indices = pol.selfIntersection();
        while (indices.length > 0) {
            let [i, j] = random(indices);
            pol.swapPoints(i, j);
            indices = pol.selfIntersection();
        }

        polygons.push(pol);
    }
    
    return polygons;
}

function createPolygon(numPoints) {
    // create polygon
    let points = []
    for (let i=0; i<numPoints; i++) {
        let x = random(0.1*cWidth, 0.9*cWidth)//constrain(randomGaussian(cWidth/2, cWidth/4), 0.1*cWidth, 0.9*cWidth);
        let y = random(0.1*cHeight, 0.9*cHeight);
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
        save('polyglot.png')
    }
}