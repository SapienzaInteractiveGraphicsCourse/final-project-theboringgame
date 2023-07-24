import * as THREE from "../lib/three/build/three.module.js";

class WALL {
    constructor(size,segment){
        this.w=size[0];
        this.h=size[1];
        this.d=size[2];
        this.s=segment;
    }
}

export class basicWall extends WALL{
    constructor(size,segment,texture){
        super(size,segment);
        this.t=texture;
    }
    create_wall(){
        var geometry = new THREE.BoxGeometry(this.w,this.h,this.d); 
        var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); 
        return new THREE.Mesh( geometry, material );
    }
}

export class doorWall extends WALL{
    constructor(size,segment,texture,doorSize){
        super(size,segment);
        this.t=texture;
        this.doorW=doorSize.weigth;
        this.doorH=doorSize.height;
    }
}