class Worm {
  constructor(x, y, r, l_max, angle_function) {
    this.points = [{'x': x, 'y': y}];
    this.x = x;
    this.y = y;
    this.r = r;
    this.step = 2.1*r;
    this.l = 0;
    this.l_max = l_max;
    this.angle_function = angle_function;
    this.running = true;
    this.renderer;
  }
  
  paint(pg=this.renderer) {
    for (let i=0; i<this.points.length-1; i++) {
      pg.line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
    }
  }

  paintCurve(pg=this.renderer) {
    pg.beginShape();
    pg.curveVertex(this.points[0].x, this.points[0].y);
    for (let i=0; i<this.points.length; i++) {
      pg.curveVertex(this.points[i].x, this.points[i].y);    
    }
    pg.endShape();
  }
  
  run(num_steps=null) {
    let th, dx, dy, c;

    while (this.running & (num_steps >= 0)) {
      th = this.angle_function(this.x, this.y);
      [dx, dy] = pol2cart(this.step, th);
      this.x += dx;
      this.y += dy;
      this.l += this.step;
      
      c = new CircleCollider(this.x, this.y, this.r)
      if (c.inside_canvas() & !colmgr.check_collision(c) & this.l < this.l_max) {
        colmgr.add_collider_to_grid(c);
        this.points.push({'x': this.x, 'y': this.y});
      }
      else {
        this.running = false;
      }
      if (num_steps != null) {
        num_steps--;
      }
    }
  }
}

class NoiseField {
  constructor(seed, scale=0.01, nfac=1, octaves=4, falloff=0.5) {
    this.seed = seed;
    this.scale = scale;
    this.nfac = nfac;
    this.octaves = octaves;
    this.falloff = falloff;
  }

  get_value(x, y) {
    noiseSeed(this.seed);
    noiseDetail(this.octaves, this.falloff);
    return noise(this.scale*x, this.scale*y)
  }

  calc_angle(x, y, angle_offset=0, rot_center=false) {
    let th = this.nfac * map(this.get_value(x, y), 0, 1, -PI, PI);
    th += angle_offset;
    if (rot_center){
      th += atan2(y-rot_center[1], x-rot_center[0]);
    }
    return th
  }
}

function create_worms(n){
  let err = 0;
  let worms = [];
  let r = 1;
  let l_max = 100;
  let x, y, c;
  for (let k=0; k<n; k++){
    let x = random(0, width);
    let y = random(0, height);
    let c = new Circ(x, y, r);
    if (c.inside_canvas() & !colmgr.check_collision(c)) {
      colmgr.add_collider_to_grid(c);
      let w = new Worm(x, y, r, l_max, (x, y) => nf.calc_angle(x, y));
      w.run();
      err = 0;
      worms.push(w)
    }
    else if (err > 300){
      break
    }
    else {
      err++
    }
  }  
  return worms
}

// Initialize parameters
let nf;
let lm;
let colmgr, worms;
let datestring;
const pfuncs = [
  (x, y) => {return prng.random_dec()},
  (x, y) => {return x+prng.random_num(-0.2, 0.2)},
  (x, y) => {return y+prng.random_num(-0.2, 0.2)},
  (x, y) => {return 2*(dist(x, y, 0.5, 0.5))+prng.random_num(-0.2, 0.2)},
  (x, y) => {return qf.get_value(x, y)}
]

function setup() {
  // general settings
  createCanvas(A3_dims.short, A3_dims.long, SVG);
  //noLoop();
  strokeWeight(1);
  stroke(0);
  noFill();

  colmgr = new CollisionManager(1);
  lm = new LayerManager(6);
  lm.nofill()
  lm.layers[0].stroke(color(255, 0, 0));
  lm.layers[1].stroke(color(255, 50, 50));
  lm.layers[2].stroke(color(255, 100, 100));
  lm.layers[3].stroke(color(0, 0, 255));
  lm.layers[4].stroke(color(50, 50, 255));
  lm.layers[5].stroke(color(100, 100, 255));
  
  datestring = int(str(year())+str(month())+str(day())+str(day())+str(hour())+str(minute())+str(second()))%1000;
  
  // geom init
  nf = new NoiseField(datestring, 0.02, nfac=0.25, octaves=4, falloff=0.5); // worm field

  background(30);
  worms = [];
  let x, y, worm;
  for (let n = 0; n < 5000; n++) {
    x = random(0, width);
    y = random(0, height);
    worm = new Worm(x, y, 1, (1-abs(y-height/2)/height)*random(10, 100), (x, y) => {return nf.calc_angle(x, y, 0.5*PI, [width/2, 0.4*height])});
    worm.renderer = lm.layers[0];
    worms.push(worm)
    worm.run();
    
    //x = random(0, width);
    //y = random(0, height);
    //worm = new Worm(x, y, 1, (1-abs(y-height/2)/height)*random(30, 200), (x, y) => {return nf.calc_angle(x, y, -0.5*PI, [width/2, 0.6*height])});
    //worm.renderer = lm.layers[1];
    //worms.push(worm)
  }  
}

function draw() {
  let all_worms_done = true;

  for (j=0;j<worms.length;j++){
    if (worms[j].running) {
      worms[j].run();
      all_worms_done = false;
    }
  }

  if (all_worms_done) {
    for (let j=0;j<worms.length;j++) {
      worms[j].paintCurve();
    }
    noLoop();
    lm.paint();
  }

  //print(colmgr.counter)
}

function keyPressed() {
  if (key == "s") {
    lm.save('primordial')
  }
}
