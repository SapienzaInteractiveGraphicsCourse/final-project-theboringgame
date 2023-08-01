
export class ObjectsFactory {
    constructor(modelLoader) {
        this.ml = modelLoader;
    }

    createGenerator() {
        let instance = new Generator(this.ml);
        return instance.getInstance();
    }

    createPlatform() {
        let instance = new Platform(this.ml);
        return instance.getInstance();
    }

}

export class Generator {
    constructor(modelLoader) {
        this.instance = modelLoader.models.get(this.constructor);
        this.instance.scale.set(10, 10, 10);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
    }

    getInstance() {
        return this.instance;
    }
}

export class Platform {
    constructor(modelLoader) {
        this.instance = modelLoader.models.get(this.constructor);
        this.instance.scale.set(10, 10, 10);
        
        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
    }

    getInstance() {
        return this.instance;
    }
}