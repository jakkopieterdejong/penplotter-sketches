class CircleCollider {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    inside_canvas() {
        return ((this.x - this.r) > 0) & ((this.x + this.r) < width) & ((this.y - this.r) > 0) & ((this.y + this.r) < height)
    }
}

class CollisionManager {
    constructor(n) {
        this.n = n;
        this.init_empty_grid(n)
    }

    init_empty_grid(n) {
        this.grid = Array(n).fill().map(() => Array(n).fill([]))
        this.counter = 0;
    }

    get_grid_indices(x, y){
        return [int(floor((x/width)*this.n)), int(floor((y/height)*this.n))]
    }

    add_collider_to_grid(c) {
        let [i, j] = this.get_grid_indices(c.x, c.y);
        this.grid[i][j].push(c);
        this.counter++;
    }

    check_collision_two_circles(c1, c2) {
        return sq(c1.x-c2.x) + sq(c1.y-c2.y) < sq(c1.r + c2.r);
    }

    check_collision_many_circles(c, c_list) {
        let overlap = false;
        for (let i=0; i<c_list.length; i++) {
            if (this.check_collision_two_circles(c, c_list[i])) {
            overlap = true;
            break;
            }
        }
        return overlap;
    }

    check_collision(c) {
        let [i, j] = this.get_grid_indices(c.x, c.y)
        let colliding = false;
        
        loop:
        for (let m=max(0, i-1); m<min(i+1, this.n); m++) {
            for (let n=max(0, j-1); n<min(j+1, this.n); n++) {
                if (this.check_collision_many_circles(c, this.grid[m][n])) {
                    colliding=true;
                    break loop;
                }
            }
        }
        return colliding
    }
}