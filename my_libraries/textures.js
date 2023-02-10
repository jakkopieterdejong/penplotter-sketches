function lineTexture(w, h, N, c) {
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