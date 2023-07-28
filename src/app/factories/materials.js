import * as THREE from "../lib/three/build/three.module.js";

export class MaterialFactory {
    constructor(loadingManager){
        this.lm=loadingManager;
    }

    createSciFiWallMaterial(density, surfaceW, surfaceH) {
        let instance = new SciFiWallMaterial(density, surfaceW, surfaceH, this.lm);
        return instance.create();
    }

    createSciFiFloorMaterial(density, surfaceW, surfaceH) {
        let instance = new SciFiFloorMaterial(density, surfaceW, surfaceH, this.lm);
        return instance.create();
    }
}

class SciFiWallMaterial {
    constructor(density, surfaceW, surfaceH, loadingManager) {
        this.repeat = [density * surfaceW / surfaceH, density];
        this.lm = loadingManager;
    }

    create() {
        const ao_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_ambientOcclusion.jpg');
        const map_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_basecolor.jpg');
        const emissive_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_emissive.jpg');
        const bump_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_height.png');
        const metalness_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_metallic.jpg');
        const normal_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_normal.jpg');
        const roughness_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/wall/Sci-fi_Wall_011_roughness.jpg');

        ao_tex.wrapS = THREE.RepeatWrapping;
        ao_tex.wrapT = THREE.RepeatWrapping;
        map_tex.wrapS = THREE.RepeatWrapping;
        map_tex.wrapT = THREE.RepeatWrapping;
        emissive_tex.wrapS = THREE.RepeatWrapping;
        emissive_tex.wrapT = THREE.RepeatWrapping;
        bump_tex.wrapS = THREE.RepeatWrapping;
        bump_tex.wrapT = THREE.RepeatWrapping;
        metalness_tex.wrapS = THREE.RepeatWrapping;
        metalness_tex.wrapT = THREE.RepeatWrapping;
        normal_tex.wrapS = THREE.RepeatWrapping;
        normal_tex.wrapT = THREE.RepeatWrapping;
        roughness_tex.wrapS = THREE.RepeatWrapping;
        roughness_tex.wrapT = THREE.RepeatWrapping;

        ao_tex.repeat.set(...this.repeat);
        map_tex.repeat.set(...this.repeat);
        emissive_tex.repeat.set(...this.repeat);
        bump_tex.repeat.set(...this.repeat);
        metalness_tex.repeat.set(...this.repeat);
        normal_tex.repeat.set(...this.repeat);
        roughness_tex.repeat.set(...this.repeat);

        return new THREE.MeshStandardMaterial({
            aoMap: ao_tex,
            map: map_tex,
            bumpMap: bump_tex,
            emissiveMap: emissive_tex,
            metalnessMap: metalness_tex,
            normalMap: normal_tex,
            roughnessMap: roughness_tex,
        });

    }
}


class SciFiFloorMaterial {
    constructor(density, surfaceW, surfaceH, loadingManager) {
        this.repeat = [density * surfaceW / surfaceH, density];
        this.lm = loadingManager;
    }

    create() {
        const ao_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_ambientOcclusion.jpg');
        const map_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_basecolor.jpg');
        const emissive_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_emission.jpg');
        const bump_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_height.png');
        const metalness_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_metallic.jpg');
        const normal_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_normal.jpg');
        const roughness_tex = new THREE.TextureLoader(this.lm).load('../../assets/textures/floor/Sci-fi_Floor_001_roughness.jpg');

        ao_tex.wrapS = THREE.RepeatWrapping;
        ao_tex.wrapT = THREE.RepeatWrapping;
        map_tex.wrapS = THREE.RepeatWrapping;
        map_tex.wrapT = THREE.RepeatWrapping;
        emissive_tex.wrapS = THREE.RepeatWrapping;
        emissive_tex.wrapT = THREE.RepeatWrapping;
        bump_tex.wrapS = THREE.RepeatWrapping;
        bump_tex.wrapT = THREE.RepeatWrapping;
        metalness_tex.wrapS = THREE.RepeatWrapping;
        metalness_tex.wrapT = THREE.RepeatWrapping;
        normal_tex.wrapS = THREE.RepeatWrapping;
        normal_tex.wrapT = THREE.RepeatWrapping;
        roughness_tex.wrapS = THREE.RepeatWrapping;
        roughness_tex.wrapT = THREE.RepeatWrapping;

        ao_tex.repeat.set(...this.repeat);
        map_tex.repeat.set(...this.repeat);
        emissive_tex.repeat.set(...this.repeat);
        bump_tex.repeat.set(...this.repeat);
        metalness_tex.repeat.set(...this.repeat);
        normal_tex.repeat.set(...this.repeat);
        roughness_tex.repeat.set(...this.repeat);

        return new THREE.MeshStandardMaterial({
            aoMap: ao_tex,
            map: map_tex,
            bumpMap: bump_tex,
            emissiveMap: emissive_tex,
            metalnessMap: metalness_tex,
            normalMap: normal_tex,
            roughnessMap: roughness_tex,
        });

    }
}

