import * as THREE from "../lib/three/build/three.module.js";
import * as CANNON from "../lib/cannon/cannon-es.js"
import { MainCharacterWalk, MainCharacterWalkWithLight } from '../animations/walk.js';
import { MainCharacterStand, MainCharacterStandWithLight } from "../animations/stand.js";


export class CharacterFactory {
    constructor(modelLoader) {
        this.ml = modelLoader;
    }

    createMainRobot() {
        let instance = new MainRobot(this.ml);
        return instance;
    }
}

export class MainRobot {
    constructor(modelLoader) {

        this.activeAnimations = new Array();
        this.items = new Map();

        this.useLight = false;

        this.instance = modelLoader.models.get(this.constructor);
        this.instance.name = 'mainRobot';
        this.instance.scale.set(9, 9, 9);

        this.instance.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

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

        this.charPhysic = new CANNON.Body({
            mass: 5,
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Box(new CANNON.Vec3(9,6,9)),
            angularDamping: 1,
            collisionFilterGroup: 1,
            collisionFilterMask: 1
        });
    }

    bindTorch(torch){
        this.holdedLight = torch;
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
        if (!this.activeAnimations.some((elem) => elem instanceof MainCharacterStand || elem instanceof MainCharacterStandWithLight))
            this.activeAnimations.push(this.items.has("torch") ? new MainCharacterStandWithLight(this.instance, this.items.get("torch")) : new MainCharacterStand(this.instance));
    }

    stopStand() {
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterStand) && !(element instanceof MainCharacterStandWithLight));
    }

    freeAnimations() {
        this.activeAnimations = new Array();
    }

    update(delta) {
        if (this.speed != 0) {
            this.stopStand();
            this.walk();
        }
        else {
            this.stopWalk();
            this.stand();
        }

        if (this.useLight)
            this.holdLight();
        else
            this.dropLight();
 
            this.updateMovement(delta);
            
            this.activeAnimations.forEach(element => { element.update() });
    }

    holdLight() {

        if (!this.items.has("torch"))
            this.items.set("torch", this.holdedLight);

        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterWalk) && !(element instanceof MainCharacterStand));
    }

    dropLight() {

        this.items.delete("torch");

        this.holdedLight.intensity = 0;
        this.activeAnimations = this.activeAnimations.filter(element => !(element instanceof MainCharacterStandWithLight) && !(element instanceof MainCharacterWalkWithLight));
    }

    getInstance() {
        return this.instance;
    }

    getPhysic(){
        return this.charPhysic;
    }

    #exponentialDecrease(k) { return k === 1 ? 1 : - Math.pow(2, - 10 * k) + 1; }

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
        if (controls.moveLeft) this.bodyOrientation += delta * this.angularSpeed;
        
        if (controls.moveRight)this.bodyOrientation -= delta * this.angularSpeed;
        

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

        this.charPhysic.position.x += Math.sin(this.bodyOrientation) * forwardDelta;
        this.charPhysic.position.z += Math.cos(this.bodyOrientation) * forwardDelta;
        // steering
        this.instance.position.copy(this.charPhysic.position);
        this.instance.rotation.y = this.bodyOrientation;
    }
}