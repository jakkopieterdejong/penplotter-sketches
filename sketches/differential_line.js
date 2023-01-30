function pol2cart(r, th) {return [r * cos(th), r * sin(th)]}


class Node {
  constructor(pos) {
    this.pos = pos;
    this.force = createVector(0, 0);
  }

  add_force(force) {
    this.force.add(force);
  }

  update() {
    this.force.limit(1)
    this.pos.add(this.force);
    this.force = createVector(0, 0);
  }

  paint() {
    ellipse(this.pos.x, this.pos.y, 10);
  }
}


class Path {
  constructor(radius, numNodes) {
    this.nodes = [];

    let th = 360/numNodes;
    let x, y;
    for (let i=0; i<numNodes; i++){
      [x, y] = pol2cart(radius, th*i);
      this.nodes.push(new Node(createVector(x, y)));
    }
  }

  attract_neighbours(aForce) {
    let L = this.nodes.length;

    for (let i=0; i<L; i++){
      let diff = p5.Vector.sub(this.nodes[(i+1)%L].pos,this.nodes[i].pos);
      this.nodes[i].add_force(p5.Vector.mult(diff, aForce));
      this.nodes[(i+1)%L].add_force(p5.Vector.mult(diff, -aForce));
    }
  }

  repulse_all(rForce, rRadius) {
    let L = this.nodes.length;
    
    for (let i=0; i<L; i++){
      for (let j=i+1; j<L; j++){
        let diff = p5.Vector.sub(this.nodes[j].pos, this.nodes[i].pos);
        if (diff.mag() < rRadius) {
          this.nodes[i].add_force(p5.Vector.mult(diff, rForce));
          this.nodes[j].add_force(p5.Vector.mult(diff, -rForce));
        }
        
      }
    }
  }

  splitEdges(sRadius) {
    let L = this.nodes.length;

    for (let i=0; i<L; i++){
      let diff = p5.Vector.sub(this.nodes[(i+1)%L].pos,this.nodes[i].pos);
      if (diff.mag() > sRadius) {
        let newNode = new Node(p5.Vector.lerp(this.nodes[(i+1)%L].pos, this.nodes[i].pos, 0.5))
        this.nodes.splice((i+1)%L, 0, newNode)
      }
    }
  }

  update() {
    this.nodes.forEach((node) => {node.update()})
    this.nodes.forEach((node) => {node.paint()})
  }
}

let path;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  //noLoop();
  stroke(0);
  noFill();
  path = new Path(50, 20);
  frameRate(10)
}

function draw() {
  background(220);
  scale(1, -1);
  translate(width/2, -height/2);
  path.attract_neighbours(0.1);
  path.repulse_all(-0.1, 50);
  path.splitEdges(20);
  path.update();
}
