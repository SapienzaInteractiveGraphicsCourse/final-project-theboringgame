import * as THREE from "../lib/three/build/three.module.js";
import * as CANNON from "../lib/cannon/cannon-es.js"

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

    createDoor() {
        let instance = new Door(this.ml);
        return instance.getInstance();
    }

    createPillar() {
        let instance = new Pillar(this.ml);
        return instance.getInstance();
    }

    createButton() {
        let instance = new Button(this.ml);
        return instance.getInstance();
    }

    createDesk() {
        let instance = new Desk(this.ml);
        return instance.getInstance();
    }

    createBook() {
        let instance = new Book(this.ml);
        return instance.getInstance();
    }

    createTrophy() {
        let instance = new Trophy(this.ml);
        return instance.getInstance();
    }

    createRedcarpet() {
        let instance = new Redcarpet(this.ml);
        return instance.getInstance();
    }

    createRope() {
        let instance = new Rope(this.ml);
        return instance.getInstance();
    }


}

export class Generator {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(20, 20, 20);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.generator = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.generator.position.y = dim.y / 2;

    }

    getInstance() {
        return [this.instance, this.generator];
    }
}

export class Platform {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(10, 10, 10);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

    }

    getInstance() {
        return [this.instance, 0];
    }
}

export class Door {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(0.25, 0.25, 0.25);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.door = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.door.position.y = dim.y / 2;
    }

    getInstance() {
        return [this.instance, this.door];
    }
}

export class Pillar {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(12, 7, 12);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.pillar = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.pillar.position.y = dim.y / 2;
    }

    getInstance() {
        return [this.instance, this.pillar];
    }
}

export class Button {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(10, 10, 10);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });


        this.button = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(2, 15, 2))
        });
        this.button.position.y = 7.5;
    }

    getInstance() {
        return [this.instance, this.button];
    }
}

export class Desk {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(20, 20, 20);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.desk = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.desk.position.y = dim.y / 2;
    }

    getInstance() {
        return [this.instance, this.desk];
    }
}

export class Book {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(0.5, 0.5, 0.5);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

    }

    getInstance() {
        return [this.instance, 0];
    }
}

export class Trophy {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(2, 2, 2);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.trophy = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.trophy.position.y = dim.y / 2;
    }

    getInstance() {
        return [this.instance, this.trophy];
    }
}

export class Redcarpet {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(15, 10, 50);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

    }

    getInstance() {
        return [this.instance, 0];
    }
}

export class Rope {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(25, 25, 25);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        let dim = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(this.instance);
        box.getSize(dim);

        this.rope = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x / 2, dim.y / 2, dim.z / 2))
        });
        this.rope.position.y = dim.y / 2;
    }

    getInstance() {
        return [this.instance, this.rope];
    }
}