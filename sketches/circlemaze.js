function angleValid(new_th, th_list, dth){
  let valid = true;
  for (let i=0; i<th_list.length; i++){
    if (angleBetween(th_list[i]-dth, th_list[i]+dth, new_th)){
      valid = false;
      break;
    }
  }
  return valid;
}

function randomAngles(n, prev_angles, dth){
  let angles = [];
  while (n > 0){
    let a = random(0, 360)
    if (angleValid(a, prev_angles, dth)){
      angles.push(a);
      prev_angles.push(a);
      n--;
    }
  }
  return angles;
}

function drawArcs(radius, thetas, dth){
  let sorted = thetas.sort(function(a, b){return a - b});
  for (let i=0; i<sorted.length-1; i++){
    arc(0, 0, 2*radius, 2*radius, sorted[i]+dth, sorted[i+1]-dth, OPEN)
  }
  arc(0, 0, 2*radius, 2*radius, sorted[sorted.length-1]+dth, sorted[0]-dth, OPEN)
}

function drawDoor(rmax, rmin, theta, dth){
  let radius = (rmax-rmin)/2;
  let x, y;
  
  // right circle
  [x, y] = pol2cart(rmin+radius, theta+dth);
  arc(x, y, 2*radius, 2*radius, theta+dth+180, theta+dth, OPEN);
  
  // left circle
  [x, y] = pol2cart(rmin+radius, theta-dth);
  arc(x, y, 2*radius, 2*radius, theta-dth, theta-dth+180, OPEN);
}

function drawCrossover(rmax, rmin, theta, crossover_lr){
  let radius = (rmax-rmin)/2;
  let dth = asin(radius/(rmin+radius));
  let x, y;

  if (random() < crossover_lr){
    // right circle
    [x, y] = pol2cart(rmin+radius, theta+dth);
    arc(x, y, 2*radius, 2*radius, theta-90, theta+dth, OPEN);

    // left circle
    [x, y] = pol2cart(rmin+radius, theta-dth);
    arc(x, y, 2*radius, 2*radius, theta+90, theta+180-dth, OPEN);

    // extra arcs to close gaps with main arcs
    arc(0, 0, 2*rmax, 2*rmax, theta+dth, theta+2*dth, OPEN)
    arc(0, 0, 2*rmin, 2*rmin, theta-2*dth, theta-dth, OPEN)
  }
  else {
    // right circle
    [x, y] = pol2cart(rmin+radius, theta+dth);
    arc(x, y, 2*radius, 2*radius, theta-180+dth, theta-90, OPEN);
    
    // left circle
    [x, y] = pol2cart(rmin+radius, theta-dth);
    arc(x, y, 2*radius, 2*radius, theta-dth, theta+90, OPEN);

    // extra arcs to close gaps with main arcs
    arc(0, 0, 2*rmax, 2*rmax, theta-2*dth, theta-dth, OPEN)
    arc(0, 0, 2*rmin, 2*rmin, theta+dth, theta+2*dth, OPEN)
  }
}

function circleMaze(start_radius, end_radius, growth_factor, crossover_chance, crossover_lr){
  let radius = start_radius;
  let door_angle = 2*asin((1-growth_factor)/(1+growth_factor));
  let max_thetas = floor(360 / (5*door_angle))
  let new_radius;
  let th_prev = [];
  let th_this;

  while (radius > end_radius){
    new_radius = radius * growth_factor;
    th_this = randomAngles(int(random(3, max_thetas)), [...th_prev], 2*door_angle);
    //th_this = randomAngles(1, [...th_prev], 2*door_angle);
    for (let i=0; i<th_this.length; i++){
      let [x1, y1] = pol2cart(radius, th_this[i]);
      let [x2, y2] = pol2cart(new_radius, th_this[i]);
      //line(x1, y1, x2, y2);
    }
    
    drawArcs(radius, th_this.concat(th_prev), door_angle);
    for (let i=0; i<th_this.length; i++) {
      if (random() < crossover_chance) {
        drawCrossover(radius, new_radius, th_this[i], crossover_lr)
      }
      else {
        drawDoor(radius, new_radius, th_this[i], door_angle)
      }
    }
    radius = new_radius;
    th_prev = th_this;
  }
  drawArcs(radius, th_prev, door_angle);
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

let circles = [];
let seed;

function setup() {
  createCanvas(297, 442, SVG);
  noFill()
  noLoop()
  angleMode(DEGREES)
  stroke(0);
  strokeWeight(1);
  seed = hour()+minute()+second();
  for (let i=0; i<100; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let r = random(width/100, width/10);
  }
}


function draw() {
  randomSeed(seed);

  push();
  translate(width/4, height/4);
  circleMaze(start_radius=0.2*width, end_radius=10, growth_factor=0.8, crossover_chance=0.5, crossover_lr=0.5);
  pop();
  push();
  translate(3*width/4, height/4);
  circleMaze(start_radius=0.2*width, end_radius=10, growth_factor=0.85, crossover_chance=0.5, crossover_lr=0.5);
  pop();
  push();
  translate(width/4, 3*height/4);
  circleMaze(start_radius=0.2*width, end_radius=10, growth_factor=0.9, crossover_chance=0.5, crossover_lr=0.5);
  pop();
  push();
  translate(3*width/4, 3*height/4);
  circleMaze(start_radius=0.2*width, end_radius=10, growth_factor=0.95, crossover_chance=0.5, crossover_lr=0.5);
}

function keyPressed() {
  if (key == 's'){
    save('circlemaze_' + str(seed) + '.svg')
  }
}
