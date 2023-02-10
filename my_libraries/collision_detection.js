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