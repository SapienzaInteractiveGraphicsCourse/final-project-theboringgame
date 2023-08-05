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

}

export class Generator {
    constructor(modelLoader) {
        this.instance = modelLoader.get(this);
        this.instance.scale.set(10, 10, 10);

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
            type:CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x/2,dim.y/2,dim.z/2))
        });
        this.generator.position.y=dim.y/2;

    }

    getInstance() {
        return [this.instance,this.generator];
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
        return [this.instance,0];
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
            type:CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x/2,dim.y/2,dim.z/2))
        });
        this.door.position.y=dim.y/2;
    }

    getInstance() {
        return [this.instance,this.door];
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
            type:CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(dim.x/2,dim.y/2,dim.z/2))
        });
        this.pillar.position.y=dim.y/2;
    }

    getInstance() {
        return [this.instance,this.pillar];
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
            type:CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(6,15,6))
        });
        this.button.position.y=7.5;
    }

    getInstance() {
        return [this.instance,this.button];
    }
}