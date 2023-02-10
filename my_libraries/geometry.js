class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    paint() {
        circle(this.x, this.y, 10);
    }
}

class Polygon {
    constructor(points) {
        this.points = points;
        this.N = points.length;
    }

    selfIntersection() {
        let indices = [];
        for (let p=0; p< this.N-1; p++) {
            for (let q=p+2; q<this.N-1; q++) {
                if (linesIntersect(this.points[p], this.points[p+1], this.points[q], this.points[q+1])) {
                    indices.push([p+1, q]);
                }
            }
        }
        return indices;
    }

    swapPoints(i, j) {
        let temp = this.points[i];
        this.points[i] = this.points[j];
        this.points[j] = temp;
    }

    paint(debugging=false) {
        for (let i=0; i<this.N-1; i++){
            this.points[i].paint();
            if (debugging) {
                text(str(i), this.points[i].x, this.points[i].y);
            }
            line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
        }
    }
    
    paintCurveShape(pg=null) {
        if (pg==null) {
            beginShape();
            curveVertex(this.points[0].x, this.points[0].y);
            for (let p=0; p<this.N; p++) {
                curveVertex(this.points[p].x, this.points[p].y);
            }
            curveVertex(this.points[0].x, this.points[0].y);
            endShape();
        }
        else {
            pg.beginShape();
            pg.curveVertex(this.points[0].x, this.points[0].y);
            for (let p=0; p<this.N; p++) {
                pg.curveVertex(this.points[p].x, this.points[p].y);
            }
            pg.curveVertex(this.points[0].x, this.points[0].y);
            pg.endShape();
        }
    }
}

function ccw(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
}

function linesIntersect(a, b, c, d) {
    if (ccw(a, b, c) * ccw(a, b, d) >= 0) return false;
    if (ccw(c, d, a) * ccw(c, d, b) >= 0) return false;
    return true;
 }

function linesIntersectionPoint(a, b, c, d) {
    let denom = ((b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x));
    let r = ((a.y-c.y)*(d.x-c.x)-(a.x-c.x)*(d.y-c.y))/denom;
    //let s = ((a.y-c.y)*(b.x-a.x)-(a.x-c.x)*(b.y-a.y))/denom;
    let intersectionPoint = new Point(a.x + r*(b.x-a.x), a.y+r*(b.y-a.y))
    return intersectionPoint;
}

function pointInsidePolygon(point, polygon) {
    // find point definitely outside of polygon
    let xmax = 0
    let ymax = 0
    let points = polygon.points;
    for (let p=0; p<points.length; p++) {
        xmax = max(xmax, points[p].x);
        ymax = max(ymax, points[p].y);
    }
    outsidePoint = new Point(xmax + 1, ymax + 1);
    
    // find number of intersections
    let n = 0;
    for (let p=0; p<polygon.length-1; p++) {
        if (linesIntersect(point, outsidePoint, points[p], points[p+1])) {n++}
    }
    return n % 2;
}