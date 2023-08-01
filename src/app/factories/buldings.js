import * as THREE from "../lib/three/build/three.module.js";
import * as CANNON from "../lib/cannon/cannon-es.js"

export class BuildingFactory {
    createBasicWall(size, material, segment = 1) {
        let instance = new BasicWall(size, material, segment);
        return instance.create();
    }

    createDoorWall(size, material, doorSize, segment = 1) {
        let instance = new DoorWall(size, material, doorSize, segment);
        return instance.create();
    }

    createFloor(size, material) {
        let instance = new Floor(size, material);
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
        let mesh = new THREE.Mesh(geometry, this.m);
        mesh.receiveShadow = true;

        let wall = new CANNON.Body({
            type:CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(this.w/2,this.h/2,this.d/2))
        });

        return [mesh,wall];
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

        const geometry = new THREE.ExtrudeGeometry(wallShape, { depth: this.d, bevelEnabled: false });

        // recomputing uv coordinates
        geometry.computeBoundingBox();
        
        let {min, _} = geometry.boundingBox;

        let offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        let range = new THREE.Vector2(this.w, this.h);
        
        const position = geometry.attributes.position;
        
        const uvs = [];
        
        for ( let i = 0; i < position.count; i ++ ) {
            const v3 = new THREE.Vector3().fromBufferAttribute( position, i );
            uvs.push( (v3.x + offset.x) / range.x);
            uvs.push( (v3.y + offset.y) / range.y);
        }

        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
        geometry.setAttribute( 'uv2', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );

        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes.uv2.needsUpdate = true;

        //ExtrudeGeometry works like BoxGeometry but takes a Shape type to input
        let mesh = new THREE.Mesh(geometry, this.m);
        mesh.receiveShadow = true;
        return [mesh,0];
    }
}

class Floor {
    constructor(size, material) {
        if (size.length != 2) {
            throw new Error("2D size expected, " + doorSize.length + "D given.");
        }

        this.w = size[0];
        this.h = size[1];
        this.m = material;
    }

    create() {
        const plane = new THREE.PlaneGeometry(this.w, this.h);
        let mesh = new THREE.Mesh(plane, this.m);
        mesh.receiveShadow = true;

        const ground = new CANNON.Body({
            mass: 0,
            type: CANNON.Body.STATIC,
            shape:new CANNON.Plane()
            //shape: new CANNON.Box(new CANNON.Vec3(this.w/2,this.h/2,0))
        });
        
        return [mesh,ground];
    }
}