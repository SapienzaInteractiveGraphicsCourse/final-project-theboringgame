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

}

export class Generator {
    constructor(modelLoader) {
        this.instance = modelLoader.models.get(this.constructor);
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
        this.instance = modelLoader.models.get(this.constructor);
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
        this.instance = modelLoader.models.get(this.constructor);
        this.instance.scale.set(900, 1250, 1000);
        
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