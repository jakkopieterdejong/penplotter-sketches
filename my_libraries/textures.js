function chaoticLineTexture(w, h, N, c) {
    let txr = createGraphics(w, h);
    for (let l=0; l<N; l++){
        let x1 = random(0, w);
        let y1 = random(0, h);
        let x2 = random(x1-20, x1+20);
        let y2 = random(y1-20, y1+20);
        txr.stroke(c);
        txr.line(x1, y1, x2, y2);
    }

    return txr;
}

function regularLineTexture(w, h, d) {
    let txr = createGraphics(w, h);
    txr.stroke(0);
    let x, step;
    for (let y=0; y<h; y+=d) {
        line(0, y, width, y)
        //x = 0;
        //while (x < w) {
        //    step = constrain(randomGaussian(10*d, 5*d), d, 50*d);
        //    line(x, y, x+step, y);
        //    x += step + random(d, 3*d);
        //}
    }

    return txr;
}