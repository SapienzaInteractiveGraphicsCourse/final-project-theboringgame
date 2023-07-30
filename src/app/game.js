import * as THREE from "./lib/three/build/three.module.js";
import { config } from "./static/config.js";
import { TWEEN } from './lib/tween/build/tween.module.min.js';
import { RoomParser } from "./utils/roomParser.js"
import { CharacterFactory } from "./factories/characters.js"

let instance;
// TODO: just for testing purposes
const dudeSpeed = 10;
let useLight = false;
//END testing

/* 
This class designed as a singleton handles the game's main loop and contains fundamental rendering elements.
*/

export class Game {

    constructor() {
        if (instance)
            throw new Error("Class Game is a singleton, a new instance cannot be created");
        instance = this;

        this.isLoaded = false
        this.container = document.querySelector('#scene-container');

        this.renderer = this.#buildRenderer();
        this.camera = this.#buildCamera();
        this.scene = this.#buildScene();
        this.light = this.#buildLight();
        this.lm = this.#buildLoader();


        // TODO: just for testing purposes.

        let cf = new CharacterFactory()

        this.mainChar = cf.createMainRobot(this.lm);

        let rp = new RoomParser(this.scene, this.lm);

        rp.parseRoom("room.json");

        this.light.position.set(-1, 50, 4);
        this.camera.position.set(-100, 70, 50);

        this.holdedLight = new THREE.SpotLight(0xffffff, 0, 100, Math.PI * 0.1);
        this.scene.add(this.holdedLight);
        this.scene.add(this.holdedLight.target);


        this.camera.lookAt(0, 0, 0);

        document.onkeydown = function(event){
            switch ( event.code ) {

                case 'ArrowUp':
                case 'KeyW': this.mainChar.controls.moveForward = true; break;

                case 'ArrowDown':
                case 'KeyS': this.mainChar.controls.moveBackward = true; break;

                case 'ArrowLeft':
                case 'KeyA': this.mainChar.controls.moveLeft = true; break;

                case 'ArrowRight':
                case 'KeyD': this.mainChar.controls.moveRight = true; break;

                case 'KeyL': useLight = !useLight; break; // TODO: move it in the player class

            }
        }.bind(this);

		document.onkeyup = function(event){
            switch ( event.code ) {

                case 'ArrowUp':
                case 'KeyW': this.mainChar.controls.moveForward = false; break;

                case 'ArrowDown':
                case 'KeyS': this.mainChar.controls.moveBackward = false; break;

                case 'ArrowLeft':
                case 'KeyA': this.mainChar.controls.moveLeft = false; break;

                case 'ArrowRight':
                case 'KeyD': this.mainChar.controls.moveRight = false; break;

            }
        }.bind(this);

        // END testing
        this.scene.add(this.light);
        this.container.appendChild(this.renderer.domElement);
    }

    #buildScene() {
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(config["game"]["scene"]["background"]);
        return scene;
    }

    #buildCamera() {
        return new THREE.PerspectiveCamera(...Object.values(config["game"]["camera"]));
    }

    #buildRenderer() {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        return renderer;
    }

    #buildLight() {
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 1;
        let light = new THREE.DirectionalLight(color, intensity);

        // shadows
        light.castShadow = true;
        light.shadow.mapSize.set(1024, 1024)
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;

        var side = 30;
        light.shadow.camera.top = side;
        light.shadow.camera.bottom = -side;
        light.shadow.camera.left = side;
        light.shadow.camera.right = -side;

        light.target.position.set(0, 0, -50);

        // IMPORTANT: move this in update function if either light position or light target changes dinamically
        light.updateWorldMatrix(true, false);
        light.target.updateWorldMatrix(true, false);

        return light
    }

    #buildLoader(){
        const lm = new THREE.LoadingManager();

        lm.onProgress = (url, loaded, total) => {
            document.getElementById("progress-bar").style.setProperty('--width', (loaded / total) * 100)
        };

        lm.onLoad = function () {
            document.getElementById("loading").style.display = 'none';
            this.isLoaded = true;
            this.#init();
        }.bind(this);

        return lm;
    }

    #init(){
        this.mainCharInstance = this.mainChar.getInstance();

        this.mainCharInstance.position.z -= 60;
        this.mainCharInstance.position.y = this.scene.getObjectByName("mazeFloor").position.y;

        this.scene.add(this.mainCharInstance);

        this.render();
    }
    


    render(t) {
        
        if (this.isLoaded) {
            let dt = t - this.last_t;
            if(isNaN(dt))
                dt = 0;

            TWEEN.update();
            
            this.camera.lookAt(this.mainCharInstance.position.x, this.mainCharInstance.position.y, this.mainCharInstance.position.z);

            /*

            // TODO change this as to use a physics engine
            let wall = this.scene.getObjectByName("frontDoorWall");
            this.isMoving = this.link.position.z + 1 < wall.position.z - 5
            let nextZ = Math.min(this.link.position.z + 1, wall.position.z - 3)
            if (this.isMoving) {
                this.walkc.update(this.isHoldingLight);
                AnimationUtils.translation(this.link, this.link.position.x, this.link.position.y, nextZ, dudeSpeed * dt);
            }
            else {
                this.stand.update();
            }*/
            /*
            if(t <= 5000){
                this.mainChar.stand();
            }
            if(t > 5000 && t <= 9000){
                this.mainChar.walk();
                this.mainChar.holdLight(this.holdedLight);
            }
            if(t>9000 && t<=15000){
                this.mainChar.dropLight();
                this.mainChar.stand();
            }*/

            this.mainChar.update(dt);
            if(useLight)
                this.mainChar.holdLight(this.holdedLight);
            else
                this.mainChar.dropLight();

            this.renderer.render(this.scene, this.camera);
        }
        
        this.last_t = t;
        window.requestAnimationFrame((t) => this.render(t));
    }

}