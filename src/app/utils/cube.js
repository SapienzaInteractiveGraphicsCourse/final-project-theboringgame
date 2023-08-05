import * as THREE from "../lib/three/build/three.module.js";

export class Cube{
    constructor(dim,color,posX,posY,posZ){
        this.dim = dim;
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
    }

    create(){
        const geometry = new THREE.BoxGeometry(this.dim, this.dim, this.dim);
        const material = new THREE.MeshStandardMaterial(this.color);
        let cube = new THREE.Mesh(geometry, material);
        cube.receiveShadow = true;
        cube.castShadow = true;

        cube.position.set(this.posX,this.posY,this.posZ);
        cube.rotation.x=Math.PI/4;
        cube.rotation.y=Math.PI/4;

        return cube;
    }
}