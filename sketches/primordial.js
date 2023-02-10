class Circ {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

function circles_overlap(c1, c2) {
  return sq(c1.x-c2.x) + sq(c1.y-c2.y) < sq(c1.r + c2.r);
}

function all_circles_overlap(c, c_list) {
  let overlap = false;
  for (let i=0; i<c_list.length; i++) {
    if (circles_overlap(c, c_list[i])) {
      overlap = true;
      break;
    }
  }
  return overlap;
}

function all_circles_overlap_grid(c, c_grid) {
  let [i, j] = get_grid_values(c.x, c.y, n_grid)
  let overlap = false;
  breakpoint:
  for (let m=max(0, i-1); m<min(i+1, c_grid.length); m++) {
    for (let n=max(0, j-1); n<min(j+1, c_grid.length); n++) {
      if (all_circles_overlap(c, c_grid[m][n])) {
        overlap=true;
        break breakpoint;
      }
    }
  }
  return overlap
}

function get_grid_values(x, y, n){
  return [int(floor(x*n)), int(floor(y*n))]
}

// COLOR
function palette_double_linear(n_pairs, hue_start, hue_gap, hue_range, sat_range) {
  push()
  colorMode(HSB, 360, 100, 100)
  let sat_max = 100
  let inv = prng.random_int(0, 1)
  let hue_step = hue_range * (180-2*hue_gap)/(n_pairs-1)
  let sat_step = sat_range /(n_pairs-1)
  let palette = [[],[]]
  for (let i=0; i<n_pairs; i++) {
    let h1 = mod(hue_start + hue_gap + i * hue_step, 360)
    let h2 = mod(hue_start - hue_gap - i * hue_step, 360)
    let sat = sat_max * (1 - sat_step*i)
    palette[0+inv].push(color(h1, sat, 100))
    palette[(1+inv)%2].push(color(h2, sat, 100))
  }
  pop()
  return palette
}

// PICKER
// sfunc and ifunc should be mathematical functions (x, y) with values between 0 and 1
function color_picker(x, y, sfunc, ifunc, palette){
  let s = Math.floor(constrain(sfunc(x, y), 0, 0.99) * palette.length)
  let i = Math.floor(constrain(ifunc(x, y), 0, 0.99) * palette[s].length)
  return palette[s][i]
}

function rl_picker(x, y, rfunc, lfunc){
  let r = map(constrain(rfunc(x, y), 0, 1), 0, 1, r_min, r_max)
  let l = map(constrain(lfunc(x, y), 0, 1), 0, 1, l_min, l_max)
  return [r, l]
}

function calc_angle(x, y, nfield, nfac, angle_offset, rot_center=false) {
  let th = nfac * map(nfield.get_value(x, y), 0, 1, -PI, PI);
  if (rot_center){
    th += atan2(x-rot_center[0], y-rot_center[1])
  }
  if (qf){
    th = (qf.get_value(x, y) > 0.5)? quantize_angle(th, qn) : th
  }
  th += angle_offset
  return th
}


// CLASSES
class MaskBlob {
  constructor(x, y, r, noiseField){
    this.x = x;
    this.y = y;
    this.r = r;
    this.nf = noiseField;
  }
  calcR(th){
    let [_x, _y] = pol2cart(1, th);
    return this.r * (1.0 + 1.0 * map(this.nf.get_value(_x+1, _y+1), 0, 1, -1, 1));
  }
  isInMask(x, y){
    let _r = sqrt(sq(x-this.x) + sq(y-this.y))
    let _th = atan2(y-this.y, x-this.x)
    return _r <= this.calcR(_th);
  }
}

class Worm {
  constructor(x, y, r, l_max, col) {
    this.points = [{'x': x, 'y': y}];
    this.x = x;
    this.y = y;
    this.r = r;
    this.l = 0;
    this.l_max = l_max;
    this.col = col;
    this.running = true;
  }
  paint(sc, col=null) {
    if (col == null){
      col = this.col
    }
    if (this.points.length > 1) {
      strokeWeight(sc * W * 2 * this.r);
      stroke(col);
      for (let i=0; i<this.points.length-1; i++) {
        line(this.points[i].x*W, this.points[i].y*W, this.points[i+1].x*W, this.points[i+1].y*W);
      }
    }
  }
  run(nf) {
    while (this.running) {
      let th = calc_angle(this.x, this.y, nf, nfac, angle_offset, rot_center, qf);
      let step = 2.1*this.r;
      let [dx, dy] = pol2cart(step, th);
      this.x += dx;
      this.y += dy;
      this.l += step;
      let c = new Circ(this.x, this.y, this.r)
      if (all_circles_overlap_grid(c, all_circles_grid) | this.l > this.l_max | (this.x < this.r) | (this.x > (1-this.r)) | (this.y < this.r) | (this.y > ((1/RATIO)-this.r))) {
        this.running = false;
      }
      else {
        let [i, j] = get_grid_values(c.x, c.y, n_grid);
        all_circles_grid[i][j].push(c);
        this.points.push({'x': this.x, 'y': this.y});
      }
    }
  }
}

class NoiseField {
  constructor(seed, scale, octaves=4, falloff=0.5) {
    this.seed = seed;
    this.scale = scale;
    this.octaves = octaves;
    this.falloff = falloff;
  }
  get_value(x, y) {
    noiseSeed(this.seed);
    noiseDetail(this.octaves, this.falloff);
    return noise(this.scale*x, this.scale*y)
  }
}

function worm_layer(n){
  let err = 0;
  let ws = [];
  for (let k=0; k<n; k++){
    let x = prng.random_num(r_max, 1-r_max);
    let y = prng.random_num(r_max, 1/RATIO-r_max);
    let col = color_picker(x, y, sfunc, ifunc, palette)
    let [r, l] = rl_picker(x, y, rfunc, lfunc)
    let c = new Circ(x, y, r);
    if (!all_circles_overlap_grid(c, all_circles_grid) & mask.isInMask(x, y)) {
      let [i, j] = get_grid_values(c.x, c.y, n_grid);
      all_circles_grid[i][j].push(c);
      let w = new Worm(x, y, r, l, col);
      w.run(nf);
      err = 0;
      ws.push(w)
    }
    else if (err > 300){
      break
    }
    else {
      err++
    }
  }  
  return ws
}


// Initialize parameters
let tokenData
let prng
let RATIO = 1
let W = Math.min(window.innerWidth, window.innerHeight*RATIO)
let H = Math.min(window.innerHeight, window.innerWidth/RATIO)
let mask
const n_worms = 10000
const n_grid = 20
let angle_offset, nfac
let all_circles_grid
let nseed, ns
let nf, nf2 
let bseed, bs
let qf, qn, qs
let rot_center = null
let palette, hue_start, hue_gap, hue_range, sat_range, n_pairs
let sfunc, ifunc, rfunc, lfunc
let params
const pfuncs = [
  (x, y) => {return prng.random_dec()},
  (x, y) => {return x+prng.random_num(-0.2, 0.2)},
  (x, y) => {return y+prng.random_num(-0.2, 0.2)},
  (x, y) => {return 2*(dist(x, y, 0.5, 0.5))+prng.random_num(-0.2, 0.2)},
  (x, y) => {return qf.get_value(x, y)}
]
const picker = (i, s) => {return (x, y) => s?pfuncs[i](x, y):1-pfuncs[i](x, y)}

function setParameters(){
  tokenData = genTokenData(1)
  //tokenData.hash = '0xb6143f093a86eaf7f64ca529b1b466ae1b8d29697c5605f00da755c4b2169c1f'
  print(tokenData.hash)
  prng = new Random()
  params = getByteVariables(tokenData.hash)
  
  // quantization field + noise_value from 1-6
  qs=map(params[0], 0, 255, 4, 12)
  qn=(params[0]>>4)%4+4
  qf=(params[1]>150)?new NoiseField(params[2], qs):null
  // Rotation center
  rot_center=(params[3]>150)?[prng.random_num(0.4, 0.6), prng.random_num(0.4, 0.6)]:null
  // Sat range
  sat_range = 0.7
  // Blob shape
  bs=map(params[6], 0, 255, 0.2, 5)
  print("blob: ", bs)
  // Angle offset
  angle_offset=map(params[4], 0, 255, 0, TWO_PI)
  // r and l
  r_min = 0.001
  r_max = prng.random_num(0.003, 0.005)
  l_min = 0.01
  l_max = prng.random_num(0.2, 0.5)
  rfunc = picker(0, 0)
  lfunc = picker(0, 0)
  sfunc = picker(0, 0)
  ifunc = picker(0, 0)
  // noise scale
  ns = 1
  nfac = 1
  
  // VORTEX CRYSTAL
  if (rot_center && qf){
    print('Vortex Crystal')
    sat_range+=0.3
    l_max /= 2
    r_max = 0.003
    angle_offset=prng.random_choice([0, PI, PI/2, -PI/2])
    let r0 = prng.random_dec()
    let r1 = prng.random_choice([0, 1])
    let r2 = prng.random_choice([0, 1])
    if (r0 > 0.33){
      rfunc=picker(3,0)
      lfunc=picker(3,r2)
    }
    else if(r0 > 0.66){
      rfunc=picker(r1+1,r2)
      lfunc=picker((r1+1)%2+1,r2)
    }
    r0 = prng.random_choice([0, 1])
    r1 = prng.random_choice([0, 1])
    r2 = prng.random_choice([0, 1])
    if (r0){
      ifunc=picker(4,r1)
    }
    else {
      sfunc=picker(4,r2)
      ifunc=picker(r1+1,r2)
    }
    nfac = prng.random_choice([0, 0.25, 1, 2, 5])
    switch(nfac){
      case 0.25: ns=prng.random_choice([10, 20, 40, 80]); break;
      case 1: ns=map(params[20], 0, 255, 0.5, 1); break;
      case 2: ns=map(params[20], 0, 255, 2, 2); break;
      case 5: ns=map(params[20], 0, 255, 1, 3)
    }
    if(!nfac){
      angle_offset=prng.random_choice([PI, PI/2, -PI/2])
    }
  }
  // VORTEX
  else if (rot_center){
    print('Vortex')
    let angles = [0, PI, PI/2, -PI/2]
    let r0 = prng.random_dec()
    let r1 = prng.random_choice([0, 1])
    let r2 = prng.random_choice([0, 1])
    if (r0 > 0.5){
      rfunc=picker(3,r1)
      lfunc=picker(3,r2)
    }
    else {
      rfunc=picker(r1+1,r2)
      lfunc=picker((r1+1)%2+1,r2)
    }
    r0 = prng.random_dec()
    r1 = prng.random_choice([0, 1])
    r2 = prng.random_choice([0, 1])
    if (r0 > 0.33){
      sfunc=picker(r1+1,r2)
      ifunc=picker((r1+1)%2+1,r2)
    }
    else if (r0 > 0.66){
      sfunc = picker(r1+1, r2) 
      ifunc = picker(3, r2)
    }
    else {
      sfunc=picker(3,r2)
    }
    nfac = prng.random_choice([0, 0.25, 0.5, 1, 2])
    switch(nfac){
      case 0: angles=[PI, PI/2, -PI/2]; break;
      case 0.25: ns=prng.random_choice([10, 20, 40, 80]); break;
      case 0.5: ns=map(params[20], 0, 255, 2, 5); break;
      case 1: ns=map(params[20], 0, 255, 1, 2); break;
      case 2: ns=map(params[20], 0, 255, 0.5, 1)}
    angle_offset=prng.random_choice(angles)
    if(angle_offset===0){l_max=0.2}
  }
  // CRYSTAL
  else if (qf){
    print('Crystal')
    sat_range+=0.3
    l_max /= 2
    r_max = 0.003
    let r0 = prng.random_choice([0, 1])
    let r1 = prng.random_choice([0, 1])
    let r2 = prng.random_choice([0, 1])
    rfunc = picker(r0*3, 0)
    lfunc = picker(r1*3, r2)
    r0 = prng.random_choice([0, 1])
    r1 = prng.random_choice([0, 1])
    r2 = prng.random_choice([0, 1])
    if (r0){
      ifunc=picker(4,r1)
    }
    else {
      sfunc=picker(4,r1)
      ifunc=picker(r1+1,r2)
    }
    nfac = prng.random_choice([1, 1, 2, 2, 5, 40])
    switch(nfac){
      case 1: ns=map(params[20], 0, 255, 4, 10); break;
      case 2: ns=map(params[20], 0, 255, 4, 8); break;
      case 5: ns=map(params[20], 0, 255, 1.5, 2); break;
      case 40: ns=map(params[20], 0, 255, 0.5, 2);}
  }
  // NORMAL
  else {
    print('Normal')
    l_max /= 2
    bs/=2
    let ran = prng.random_dec()
    if (ran > 0.5){
      rfunc=picker(3,0)
      lfunc=picker(3,1)
    }
    else {
      lfunc=picker(int(round(prng.random_dec))+1, int(round(prng.random_dec)))
    }
    ran = prng.random_dec()
    let r1 = prng.random_choice([0, 1])
    let r2 = prng.random_choice([0, 1])
    if (ran > 0.5){
      sfunc=picker(r1+1,r2)
      ifunc=picker((r1+1)%2+1,r2)
    }
    else {
      ifunc=picker(3,r2)
    }
    nfac = prng.random_choice([1, 1, 2, 2, 5, 40])
    switch(nfac){
      case 1: ns=map(params[20], 0, 255, 0.5, 3); break;
      case 2: ns=map(params[20], 0, 255, 1, 5); break;
      case 5: ns=map(params[20], 0, 255, 1, 4); break;
      case 40: ns=map(params[20], 0, 255, 0.3, 3); r_max=0.003}
  }

  //print('sat_range', sat_range)
  print('angle_offset', angle_offset/PI)
  print('r_max', r_max)
  print('l_max', l_max)
  print('nfac', nfac)
  print('ns', ns)

  // Seeds
  nseed=params[9]
  bseed=params[5]
}

function setup() {
  // general settings
  createCanvas(W, H);
  noLoop();
    
  // reproducible randomness based on a hash
  //randomSeed(seed);

  setParameters()

  // geom init
  nf = new NoiseField(nseed, ns, 4, 0.5); // worm field
  nf2 = new NoiseField(bseed, bs, 4, 0.3); // blob field
  mask = new MaskBlob(0.5, 0.5, 0.35, nf2); // blob
  
  // color init
  n_pairs = 40
  hue_start = prng.random_num(0, 360)
  while ((hue_start > 30 & hue_start < 155) | (hue_start > 115 & hue_start < 150)){
    hue_start = prng.random_num(0, 360)
  }
  hue_gap = prng.random_num(15, 35)
  hue_range = prng.random_choice([0.2, 0.4, 0.6])
  //print('hue_start', int(hue_start))
  palette = palette_double_linear(n_pairs, hue_start, hue_gap, hue_range, sat_range)
}

function draw() {
  let worms;
  all_circles_grid = Array(n_grid).fill().map(() => Array(n_grid).fill([]))
  worms = worm_layer(n_worms);
  for (j=0;j<worms.length;j++){
    worms[j].paint(0.5)
  }
}
