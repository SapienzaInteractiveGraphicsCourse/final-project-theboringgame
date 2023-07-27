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

    createFloor(size){
        let instance = new Floor(size);
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

        if(size.length != 3){
            throw new Error("3D size expected, "+size.length+"D given.");
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

        // TODO: create a material factory
        let density = 0.5;
        var repeat = [density*this.w/this.h,density];
        
        const ao_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_ambientOcclusion.jpg');
        ao_tex.wrapS = THREE.RepeatWrapping;
        ao_tex.wrapT = THREE.RepeatWrapping;
        ao_tex.repeat.set(...repeat);
        const map_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_basecolor.jpg');
        map_tex.wrapS = THREE.RepeatWrapping;
        map_tex.wrapT = THREE.RepeatWrapping;
        map_tex.repeat.set(...repeat);
        const emissive_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_emissive.jpg');
        emissive_tex.wrapS = THREE.RepeatWrapping;
        emissive_tex.wrapT = THREE.RepeatWrapping;
        emissive_tex.repeat.set(...repeat);
        const displacement_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_height.png');
        displacement_tex.wrapS = THREE.RepeatWrapping;
        displacement_tex.wrapT = THREE.RepeatWrapping;
        displacement_tex.repeat.set(...repeat);
        const metalness_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_metallic.jpg');
        metalness_tex.wrapS = THREE.RepeatWrapping;
        metalness_tex.wrapT = THREE.RepeatWrapping;
        metalness_tex.repeat.set(...repeat);
        const normal_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_normal.jpg');
        normal_tex.wrapS = THREE.RepeatWrapping;
        normal_tex.wrapT = THREE.RepeatWrapping;
        normal_tex.repeat.set(...repeat);
        const roughness_tex = new THREE.TextureLoader().load('../../assets/textures/wall/Sci-fi_Wall_011_roughness.jpg');
        roughness_tex.wrapS = THREE.RepeatWrapping;
        roughness_tex.wrapT = THREE.RepeatWrapping;
        roughness_tex.repeat.set(...repeat);

        var material = new THREE.MeshStandardMaterial({
            aoMap:ao_tex,
            map:map_tex,
            emissiveMap:emissive_tex,
            displacementMap:displacement_tex,
            metalnessMap:metalness_tex,
            normalMap:normal_tex,
            roughnessMap:roughness_tex,
        });
        return new THREE.Mesh( geometry, material );
    }
}

class DoorWall extends BasicWall{
    constructor(size,texture,doorSize,segment = 1){
        super(size,texture,segment);

        if(doorSize.length != 2){
            throw new Error("2D doorSize expected, "+doorSize.length+"D given.");
        }

        this.doorW=doorSize[0];
        this.doorH=doorSize[1];
    }
    
    create(){
        const wallPoints={
            A: {x: -this.w/2, y:-this.h/2},
            B: {x: this.w/2, y:-this.h/2},
            C: {x: this.w/2, y: this.h/2},
            D: {x: -this.w/2, y: this.h/2}
        };
        const doorPoints={
            A: {x: -this.doorW/2, y: -this.h/2},
            B: {x: this.doorW/2, y: -this.h/2},
            C: {x: this.doorW/2, y: -this.h/2+this.doorH},
            D: {x: -this.doorW/2, y: -this.h/2+this.doorH}
        };

        //We use a Shape type because it has the option to remove a Path from an object throught the call holes(line 94)
        const wallShape= new THREE.Shape();
        wallShape.moveTo(wallPoints.A.x, wallPoints.A.y);
        wallShape.lineTo(wallPoints.B.x,wallPoints.B.y);
        wallShape.lineTo(wallPoints.C.x,wallPoints.C.y);
        wallShape.lineTo(wallPoints.D.x,wallPoints.D.y);

        const doorPath= new THREE.Path();
        doorPath.moveTo(doorPoints.A.x,doorPoints.A.y);
        doorPath.lineTo(doorPoints.B.x,doorPoints.B.y);
        doorPath.lineTo(doorPoints.C.x,doorPoints.C.y);
        doorPath.lineTo(doorPoints.D.x,doorPoints.D.y);
        
        wallShape.holes.push(doorPath);

        //ExtrudeGeometry works like BoxGeometry but takes a Shape type to input
        const geometry = new THREE.ExtrudeGeometry(wallShape, {depth: this.d, bevelEnabled: false});

        var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );  // TODO: change with texture

        return new THREE.Mesh( geometry, material );
   }
}

class Floor{
    constructor(size){
        if(size.length != 2){
            throw new Error("2D size expected, "+doorSize.length+"D given.");
        }

        this.w=size[0];
        this.h=size[1];
    }

    create(){
        const plane = new THREE.PlaneGeometry(this.w, this.h);
        var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); // TODO: change with texture
        return new THREE.Mesh(plane, material);
    }
}