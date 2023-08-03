import * as THREE from "../lib/three/build/three.module.js";

export class MaterialFactory {
    constructor(loadingManager){
        this.lm=loadingManager;
    }

    createSciFiWallMaterial(density, surfaceW, surfaceH) {
        let instance = new SciFiWallMaterial(density, surfaceW, surfaceH, this.lm);
        return instance;
    }

    createSciFiFloorMaterial(density, surfaceW, surfaceH) {
        let instance = new SciFiFloorMaterial(density, surfaceW, surfaceH, this.lm);
        return instance;
    }
}

class SciFiWallMaterial {
    constructor(density, surfaceW, surfaceH, loadingManager) {
        this.repeat = [density * surfaceW / surfaceH, density];
        this.lm = loadingManager;
    }

    async create() {
        const ao_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_ambientOcclusion.jpg');
        const map_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_basecolor.jpg');
        const emissive_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_emissive.jpg');
        const bump_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_height.png');
        const metalness_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_metallic.jpg');
        const normal_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_normal.jpg');
        const roughness_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/wall/Sci-fi_Wall_011_roughness.jpg');

        this.textures = await Promise.all([ao_tex, map_tex, bump_tex, emissive_tex, metalness_tex, normal_tex, roughness_tex]);

        this.textures.forEach(function(obj){
            obj.wrapS = THREE.RepeatWrapping; 
            obj.wrapT = THREE.RepeatWrapping
            obj.repeat.set(...this.repeat);
        }.bind(this));

        return new THREE.MeshStandardMaterial({
            aoMap: this.textures[0],
            map: this.textures[1],
            bumpMap: this.textures[2],
            emissiveMap: this.textures[3],
            metalnessMap: this.textures[4],
            normalMap: this.textures[5],
            roughnessMap: this.textures[6],
        });

    }

    createWithPreload(preloadedTextures){

        preloadedTextures.forEach(function(obj){
            obj.wrapS = THREE.RepeatWrapping; 
            obj.wrapT = THREE.RepeatWrapping
            obj.repeat.set(...this.repeat);
        }.bind(this));

        return new THREE.MeshStandardMaterial({
            aoMap: preloadedTextures[0],
            map: preloadedTextures[1],
            bumpMap: preloadedTextures[2],
            emissiveMap: preloadedTextures[3],
            metalnessMap: preloadedTextures[4],
            normalMap: preloadedTextures[5],
            roughnessMap: preloadedTextures[6],
        });
    }

    getRepeat(){ return this.repeat }
    getTextures(){ return this.textures }
}


class SciFiFloorMaterial {
    constructor(density, surfaceW, surfaceH, loadingManager) {
        this.repeat = [density * surfaceW / surfaceH, density];
        this.lm = loadingManager;
    }

    async create() {
        const ao_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_ambientOcclusion.jpg');
        const map_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_basecolor.jpg');
        const emissive_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_emission.jpg');
        const bump_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_height.png');
        const metalness_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_metallic.jpg');
        const normal_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_normal.jpg');
        const roughness_tex = new THREE.TextureLoader(this.lm).loadAsync('../../assets/textures/floor/Sci-fi_Floor_001_roughness.jpg');

        this.textures = await Promise.all([ao_tex, map_tex, bump_tex, emissive_tex, metalness_tex, normal_tex, roughness_tex]);

        this.textures.forEach(function(obj){
            obj.wrapS = THREE.RepeatWrapping; 
            obj.wrapT = THREE.RepeatWrapping
            obj.repeat.set(...this.repeat);
        }.bind(this));

        return new THREE.MeshStandardMaterial({
            aoMap: this.textures[0],
            map: this.textures[1],
            bumpMap: this.textures[2],
            emissiveMap: this.textures[3],
            metalnessMap: this.textures[4],
            normalMap: this.textures[5],
            roughnessMap: this.textures[6],
        });

    }

    getRepeat(){ return this.repeat }
    getTextures(){ return this.textures }
}

