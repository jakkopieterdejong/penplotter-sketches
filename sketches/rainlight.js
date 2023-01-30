let A, B;
let light;

class Light {
  constructor(A, B, C, intensity, decay_length) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.intensity = intensity;
    this.decay_length = decay_length;
    this.AB = p5.Vector.sub(B, A);
    this.BC = p5.Vector.sub(C, B);
    this.CA = p5.Vector.sub(A, C);
    this.n_AB = (createVector(this.AB.y, -this.AB.x)).div(this.AB.mag());
    this.n_BC = (createVector(this.BC.y, -this.BC.x)).div(this.BC.mag());
    this.n_CA = (createVector(this.CA.y, -this.CA.x)).div(this.CA.mag());
  }

  _distanceToSides(P) {
    let AP = p5.Vector.sub(P, this.A);
    let BP = p5.Vector.sub(P, this.B);
    let CP = p5.Vector.sub(P, this.C);
    let d1 = AP.x*this.AB.y - AP.y*this.AB.x;
    let d2 = BP.x*this.BC.y - BP.y*this.BC.x;
    let d3 = CP.x*this.CA.y - CP.y*this.CA.x;

    return [d1, d2, d3];
  }

  _signedDistance(P) {
    let AP = p5.Vector.sub(P, this.A);
    let h = min(1, max(0, p5.Vector.dot(AP, this.AB) / this.AB.magSq()));
    let d = p5.Vector.sub(AP, p5.Vector.mult(this.AB, h)).mag();
  
    return [h, d];
  }

  getIntensityAtPoint(P) {
    let [d1, d2, d3] = this._distanceToSides(P)

    if ((d1 > 0) & (d2 < 0) & (d3 < 0)) {
      let [h, d] = this._signedDistance(P)
      return 1 / (1+d/this.decay_length);
    }
    else {return 0};
  }

  paint(c = color(255), debugMode = false) {
    fill(c);

    line(this.A.x, this.A.y, this.B.x, this.B.y)
    for (let i = 0.1; i<0.99; i+=0.1) {
      let pos = p5.Vector.lerp(this.A, this.B, i).add(p5.Vector.mult(this.n_AB, 5));
      circle(pos.x, pos.y, 5);
    }

    if (debugMode) {
      fill(color(0, 0, 0));
      circle(this.A.x, this.A.y, 10);
      circle(this.B.x, this.B.y, 10);
      circle(this.C.x, this.C.y, 10);
    }
    
  }

}


function setup() {
  createCanvas(400, 400);
  light = new Light(createVector(150, 200), createVector(200, 200), createVector(300, 360), 1, 200)
  
  noStroke();
  noLoop();
}

function draw() {
  background(60);
  scale(1, -1);
  translate(0, -height);
  let c = color(255, 0, 0);
  fill(c);
  
  for (x=0; x<width; x+=10) {
    for (y=0; y<height; y+=10) {
      let iap = light.getIntensityAtPoint(createVector(x, y));
      fill(255*iap, 0, 0)
      circle(x, y, 5);
    }
  }

  light.paint(c = color(255))
}
