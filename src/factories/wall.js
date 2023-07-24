import * as THREE from "../lib/three/build/three.module.js";

class WallFactory{
    constructor(){

    }

    createBasicWall(){

    }

    createDoorWall(){
        
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

export class BasicWall extends AbstractWall{

    constructor(size,texture,segment = 1){
        super(size,segment);
        this.t=texture;
    }

    create(){
        var geometry = new THREE.BoxGeometry(this.w,this.h,this.d); 
        var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); 
        return new THREE.Mesh( geometry, material );
    }
}

export class DoorWall extends AbstractWall{
    constructor(size,texture,doorSize,segment = 1){
        super(size,segment);
        this.t=texture;
        this.doorW=doorSize.weigth;
        this.doorH=doorSize.height;
    }
}