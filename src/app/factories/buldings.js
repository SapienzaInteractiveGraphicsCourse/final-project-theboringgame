import * as THREE from "../lib/three/build/three.module.js";
import { MaterialFactory } from "./materials.js"

export class BuildingFactory {
    createBasicWall(size, material, segment = 1) {
        let instance = new BasicWall(size, material, segment);
        return instance.create();
    }

    createDoorWall(size, material, doorSize, segment = 1) {
        let instance = new DoorWall(size, material, doorSize, segment);
        return instance.create();
    }

    createFloor(size) {
        let instance = new Floor(size);
        return instance.create();
    }
}

class AbstractWall {
    constructor(size, segment = 1) {

        if (this.constructor == AbstractWall) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        if (size.length != 3) {
            throw new Error("3D size expected, " + size.length + "D given.");
        }

        this.w = size[0];
        this.h = size[1];
        this.d = size[2];

        this.s = segment;
    }

    create() {
        throw new Error("Method 'create()' must be implemented.");
    }
}

class BasicWall extends AbstractWall {

    constructor(size, material, segment = 1) {
        super(size, segment);
        this.m = material;
    }

    create() {
        var geometry = new THREE.BoxGeometry(this.w, this.h, this.d);
        return new THREE.Mesh(geometry, this.m);
    }
}

class DoorWall extends BasicWall {
    constructor(size, material, doorSize, segment = 1) {
        super(size, material, segment);

        if (doorSize.length != 2) {
            throw new Error("2D doorSize expected, " + doorSize.length + "D given.");
        }

        this.doorW = doorSize[0];
        this.doorH = doorSize[1];
    }

    create() {
        const wallPoints = {
            A: { x: -this.w / 2, y: -this.h / 2 },
            B: { x: this.w / 2, y: -this.h / 2 },
            C: { x: this.w / 2, y: this.h / 2 },
            D: { x: -this.w / 2, y: this.h / 2 }
        };
        const doorPoints = {
            A: { x: -this.doorW / 2, y: -this.h / 2 },
            B: { x: this.doorW / 2, y: -this.h / 2 },
            C: { x: this.doorW / 2, y: -this.h / 2 + this.doorH },
            D: { x: -this.doorW / 2, y: -this.h / 2 + this.doorH }
        };

        //We use a Shape type because it has the option to remove a Path from an object throught the call holes(line 94)
        const wallShape = new THREE.Shape();
        wallShape.moveTo(wallPoints.A.x, wallPoints.A.y);
        wallShape.lineTo(wallPoints.B.x, wallPoints.B.y);
        wallShape.lineTo(wallPoints.C.x, wallPoints.C.y);
        wallShape.lineTo(wallPoints.D.x, wallPoints.D.y);

        const doorPath = new THREE.Path();
        doorPath.moveTo(doorPoints.A.x, doorPoints.A.y);
        doorPath.lineTo(doorPoints.B.x, doorPoints.B.y);
        doorPath.lineTo(doorPoints.C.x, doorPoints.C.y);
        doorPath.lineTo(doorPoints.D.x, doorPoints.D.y);

        wallShape.holes.push(doorPath);

        //ExtrudeGeometry works like BoxGeometry but takes a Shape type to input
        const geometry = new THREE.ExtrudeGeometry(wallShape, { depth: this.d, bevelEnabled: false });

        return new THREE.Mesh(geometry, this.m);
    }
}

class Floor {
    constructor(size) {
        if (size.length != 2) {
            throw new Error("2D size expected, " + doorSize.length + "D given.");
        }

        this.w = size[0];
        this.h = size[1];
    }

    create() {
        const plane = new THREE.PlaneGeometry(this.w, this.h);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // TODO: change with texture
        return new THREE.Mesh(plane, material);
    }
}