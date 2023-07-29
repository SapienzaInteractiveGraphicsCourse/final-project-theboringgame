import * as THREE from "../lib/three/build/three.module.js";
import { GLTFLoader } from "../lib/three/loaders/GLTFLoader.js";
import { MainCharacterWalk } from '../animations/walk.js';
import { MainCharacterHoldLight } from '../animations/holdLight.js';
import { MainCharacterStand } from "../animations/stand.js";


export class CharacterFactory {
    createMainRobot(loadingManager) {
        let instance = new MainRobot(loadingManager);
        return instance;
    }
}

class MainRobot {
    constructor(loadingManager) {
        this.isLoaded = false;
        this.activeAnimations = new Array();

        const loader = new GLTFLoader(loadingManager);
        
        loader.load(
            '../../assets/models/hmo-man/hmo-ng.glb',

            function (gltf) {
                this.instance = gltf.scene;
                this.instance.name = 'mainRobot';
                this.instance.scale.set(9, 9, 9);

                this.instance.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });
                this.isLoaded = true;
            }.bind(this),
            function () {},
            function (error) {
                console.log('An error happened: ' + error);

            }
        );
    }

    walk(){
        this.stopStand();
        if(!this.activeAnimations.some((elem) => elem instanceof MainCharacterWalk))
            this.activeAnimations.push(new MainCharacterWalk(this.instance));
    }
    
    stopWalk(){
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterWalk));
    }

    stand(){
        this.stopWalk();
        if(!this.activeAnimations.some((elem) => elem instanceof MainCharacterStand))
            this.activeAnimations.push(new MainCharacterStand(this.instance));
    }

    stopStand(){
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterStand));
    }

    freeAnimations(){
        this.activeAnimations = new Array();
    }

    update(){
        this.activeAnimations.forEach(element => { element.update() });
    }

    holdLight(light){
        this.activeAnimations.forEach(element => { 
            if(element instanceof MainCharacterWalk)
                element.holdLight();
        });
        if(!this.activeAnimations.some((elem) => elem instanceof MainCharacterHoldLight))
            this.activeAnimations.push(new MainCharacterHoldLight(this.instance, light));
        
    }

    dropLight(){
        this.activeAnimations.forEach(element => { 
            if(element instanceof MainCharacterWalk)
                element.dropLight();
        });

        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterHoldLight));
    }

    getInstance() {
        if(this.isLoaded)
            return this.instance;
        else
            throw new Error("Requested a MainRobot instance but it isn't loaded yet.");
    }
}