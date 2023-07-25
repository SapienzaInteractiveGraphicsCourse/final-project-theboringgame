import * as THREE from "../lib/three/build/three.module.js";

export class BuildingFactory{
    constructor(){
        this.instances = new Array()
    }

    createBasicWall(size,texture,segment = 1){
        let instance = new BasicWall(size,texture,segment);
        this.instances.push(instance);
        return instance.create();
    }
    
    createDoorWall(size,texture,doorSize,segment = 1){
        let instance = new DoorWall(size,texture,doorSize,segment);
        this.instances.push(instance);
        return instance.create();
    }

    getInstances(){
        return this.instances;
    }

}

class AbstractWall {
    constructor(size,segment = 1){

        if (this.constructor == AbstractWall) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.w=size[0];
        this.h=size[1];
        this.d=size[2];

        this.s=segment;
    }

    create(){
        throw new Error("Method 'create()' must be implemented.");
    }
}

class BasicWall extends AbstractWall{

    constructor(size,texture,segment = 1){
        super(size,segment);
        this.t=texture;
    }

    create(){
        var geometry = new THREE.BoxGeometry(this.w,this.h,this.d); 
        var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );  // TODO: change with texture
        return new THREE.Mesh( geometry, material );
    }
}

class DoorWall extends BasicWall{
    constructor(size,texture,doorSize,segment = 1){
        super(size,texture,segment);

        this.doorW=doorSize[0];
        this.doorH=doorSize[1];
        this.doorD=doorSize[2];
    }
    create(){
        const wallMesh = super.create();
        const wall_bsp = new THREECSG.ThreeBSP(wallMesh);
        const doorGeometry= new THREE.BoxGeometry(this.doorW,this.doorH,this.doorD,this.segment,this.segment,this.segment);
        const doorMesh = new THREE.Mesh(doorGeometry, new THREE.MeshPhongMaterial( { color: 0x00ff00 } )); // TODO: change with texture
        const door_bsp = new THREECSG.ThreeBSP(doorMesh);
        var subtract_bsp = wall_bsp.subtract(door_bsp);
    }
}