import * as THREE from "../lib/three/build/three.module.js";
import { GLTFLoader } from "../lib/three/loaders/GLTFLoader.js";
import { MainCharacterWalk, MainCharacterWalkWithLight } from '../animations/walk.js';
import { MainCharacterHoldLight } from '../animations/holdLight.js';
import { MainCharacterStand, MainCharacterStandWithLight } from "../animations/stand.js";


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
        this.items = new Map();

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
            function () { },
            function (error) {
                console.log('An error happened: ' + error);

            }
        );

        this.controls = {

            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
        
        };

        //TODO move these in config file
        this.walkSpeed = 0.05;
        this.acceleration = 0.01;
        this.angularSpeed = 0.002;
        
        this.speed = 0;
        this.bodyOrientation = 0;
    }

    walk() {
        this.stopStand();
        if (!this.activeAnimations.some((elem) => elem instanceof MainCharacterWalk || elem instanceof MainCharacterWalkWithLight))
            this.activeAnimations.push(this.items.has("torch") ? new MainCharacterWalkWithLight(this.instance, this.items.get("torch")) : new MainCharacterWalk(this.instance));
    }

    stopWalk() {
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterWalk) && !(element instanceof MainCharacterWalkWithLight));
    }

    stand() {
        this.stopWalk();
        if (!this.activeAnimations.some((elem) => elem instanceof MainCharacterStand || elem instanceof MainCharacterStandWithLight ))
            this.activeAnimations.push(this.items.has("torch") ? new MainCharacterStandWithLight(this.instance, this.items.get("torch")) : new MainCharacterStand(this.instance));
    }

    stopStand() {
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterStand) && !(element instanceof MainCharacterStandWithLight));
    }

    freeAnimations() {
        this.activeAnimations = new Array();
    }

    update(delta) {
        if(this.speed != 0){
            this.stopStand();
            this.walk();
        }
        else{
            this.stopWalk();
            this.stand();
        }

        this.activeAnimations.forEach(element => { element.update() });
        this.updateMovement(delta);
    }

    holdLight(light) {

        if(!this.items.has("torch"))
            this.items.set("torch", light);

        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterWalk) && !(element instanceof MainCharacterStand));
    }

    dropLight() {

        this.items.delete("torch");

        this.activeAnimations.forEach((element) => {
            if (element instanceof MainCharacterWalkWithLight || element instanceof MainCharacterStandWithLight)
                element.light.intensity = 0;
        });

        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterStandWithLight) && !(element instanceof MainCharacterWalkWithLight));
    }

    getInstance() {
        if (this.isLoaded)
            return this.instance;
        else
            throw new Error("Requested a MainRobot instance but it isn't loaded yet.");
    }

    #exponentialDecrease(k) { return k === 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1; }

    updateMovement(delta) {
        
        var controls = this.controls;
        // translation speed update 
        let maxSpeed = this.walkSpeed;
        let maxReverseSpeed = -this.walkSpeed;
        let frontAcceleration = this.acceleration;
        let frontDeceleration = this.acceleration;
        let backAcceleration = this.acceleration;
        let backDeceleration = this.acceleration;

        if (controls.moveForward) this.speed = THREE.MathUtils.clamp(this.speed + delta * frontAcceleration, maxReverseSpeed, maxSpeed);
        if (controls.moveBackward) this.speed = THREE.MathUtils.clamp(this.speed - delta * backAcceleration, maxReverseSpeed, maxSpeed);

        // orientation speed update
        if (controls.moveLeft) {
            this.bodyOrientation += delta * this.angularSpeed;
            if(this.speed > 0)
                this.speed = THREE.MathUtils.clamp(this.speed + delta * frontAcceleration, maxReverseSpeed, maxSpeed);
            else
                this.speed = THREE.MathUtils.clamp(this.speed - delta * backAcceleration, maxReverseSpeed, maxSpeed);
        }
        if (controls.moveRight) {
            this.bodyOrientation -= delta * this.angularSpeed;
            if(this.speed > 0)
                this.speed = THREE.MathUtils.clamp(this.speed + delta * frontAcceleration, maxReverseSpeed, maxSpeed);
            else
                this.speed = THREE.MathUtils.clamp(this.speed - delta * backAcceleration, maxReverseSpeed, maxSpeed);
        }

        // speed decreasing
        if (!(controls.moveForward || controls.moveBackward)) {
            if (this.speed > 0) {
                var k = this.#exponentialDecrease(this.speed / maxSpeed);
                this.speed = THREE.MathUtils.clamp(this.speed - k * delta * frontDeceleration, 0, maxSpeed);
            } else {
                var k = this.#exponentialDecrease(this.speed / maxReverseSpeed);
                this.speed = THREE.MathUtils.clamp(this.speed + k * delta * backDeceleration, maxReverseSpeed, 0);
            }
        }

        // displacement
        var forwardDelta = this.speed * delta;

        this.instance.position.x += Math.sin(this.bodyOrientation) * forwardDelta;
        this.instance.position.z += Math.cos(this.bodyOrientation) * forwardDelta;
        // steering
        this.instance.rotation.y = this.bodyOrientation;
    }
}