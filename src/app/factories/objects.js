import { GLTFLoader } from "../lib/three/loaders/GLTFLoader.js";

export class ObjectsFactory{
    createGenerator(loadingManager){
        let instance = new Generator(loadingManager);
        return instance;
    }

    createPlatform(loadingManager){
        let instance = new Platform(loadingManager);
        return instance;
    }

}

class Generator{
    constructor(loadingManager){
        this.isLoaded = false;

        const loader = new GLTFLoader(loadingManager);

        loader.load(
            '../../assets/models/generator/sci-fi_cargo_crate.glb',

            function (gltf) {
                this.instance = gltf.scene;
                this.instance.name = 'generator';
                this.instance.scale.set(20, 20, 20);

                this.instance.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });
                this.isLoaded = true;
            }.bind(this),
            function () { },
            function (error) {
                console.log('An error happened: ' + error);

            }
        );
    }

    create(){
        
    }
    getInstance() {
        if (this.isLoaded)
            return this.instance;
        else
            throw new Error("Requested a Generator instance but it isn't loaded yet.");
    }
}

class Platform{
    constructor(loadingManager){
        this.isLoaded = false;

        const loader = new GLTFLoader(loadingManager);

        loader.load(
            '../../assets/models/platform/scifi_platform_end.glb',

            function (gltf) {
                this.instance = gltf.scene;
                this.instance.name = 'platform';
                this.instance.scale.set(0.15, 0.15, 0.15);

                this.instance.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });
                this.isLoaded = true;
            }.bind(this),
            function () { },
            function (error) {
                console.log('An error happened: ' + error);

            }
        );
    }

    getInstance() {
        if (this.isLoaded)
            return this.instance;
        else
            throw new Error("Requested a Platform instance but it isn't loaded yet.");
    }
}