class LayerManager {
    constructor(num_layers) {
        this.N = num_layers;
        this.layers = this.create();
    }

    create(num_layers = this.N) {
        let layers = [];
        for (let l=0; l<num_layers; l++){
            layers.push(createGraphics(width, height, SVG));
        }
        return layers;
    }

    nofill(layers = this.layers) {
        for (let l=0; l<layers.length; l++) {
            layers[l].noFill();
        }
    }

    paint(layers = this.layers) {
        for (let l=0; l<layers.length; l++) {
            image(layers[l], 0, 0);
        }
    }

    clear(layers = this.layers) {
        for (let l=0; l<layers.length; l++) {
            layers[l].clear();
        }
    }

    save(fname, layers = this.layers) {
        for (let l=0; l<layers.length; l++) {
            clear();
            image(layers[l], 0, 0);
            let filename = fname + '_' + str(l) + '.svg'
            //print(filename)
            save(filename);
        }
    }
}
