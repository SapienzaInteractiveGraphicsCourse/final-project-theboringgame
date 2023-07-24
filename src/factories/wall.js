import * as THREE from "../lib/three/build/three.module.js";
import * as THREECSG from '../lib/three/build/threeCSG.js'
class WALL {
    constructor(size,segment){
        this.w=size[0];
        this.h=size[1];
        this.d=size[2];
        this.s=segment;
    }
    create_wall(){
        const geometry = new THREE.BoxGeometry(this.w,this.h,this.d,this.segment,this.segment,this.segment); 
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); 
        return new THREE.Mesh( geometry, material );
    }
}

export class basicWall extends WALL{
    constructor(size,segment,texture){
        super(size,segment);
        this.t=texture;
    }
}

export class doorWall extends WALL{
    constructor(size,segment,texture,doorSize){
        super(size,segment);
        this.t=texture;
        this.doorW=doorSize[0];
        this.doorH=doorSize[1];
        this.doorD=doorSize[2];
    }
    create_door_wall(){
        const wallMesh=this.create_wall();
        const wall_bsp = new THREECSG.ThreeBSP(wallMesh);
        const doorGeometry= new THREE.BoxGeometry(this.doorW,this.doorH,this.doorD,this.segment,this.segment,this.segment);
        const doorMesh = new THREE.Mesh(doorGeometry, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ));
        const door_bsp = new THREECSG.ThreeBSP(doorMesh);
        var subtract_bsp = wall_bsp.subtract(door_bsp);
    }
}