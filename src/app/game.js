import * as THREE from "./lib/three/build/three.module.js";
import { GLTFLoader } from "./lib/three/loaders/GLTFLoader.js";
import { MainCharacterWalk } from './animations/walk.js';
import { MainCharacterHoldLight } from './animations/holdLight.js';
import { MainCharacterStand } from './animations/stand.js';
import { config } from "./static/config.js";
import { TWEEN } from './lib/tween/build/tween.module.min.js';
import { AnimationUtils } from "./utils/animationUtils.js";
import { RoomParser } from "./utils/roomParser.js"

let instance;
// TODO: just for testing purposes
const dudeSpeed = 10;
//END testing

/* 
This class designed as a singleton handles the game's main loop and contains fundamental rendering elements.
*/

export class Game {

    constructor() {
        if (instance)
            throw new Error("Class Game is a singleton, a new instance cannot be created");
        instance = this;

        this.container = document.querySelector('#scene-container');
        
        this.renderer = this.#buildRenderer();
        this.camera = this.#buildCamera();
        this.scene = this.#buildScene();
        this.light = this.#buildLight();

        // TODO: just for testing purposes.

        const lm = new THREE.LoadingManager();

        let loadingBar = document.getElementById("progress-bar");

        lm.onProgress = (url, loaded, total) => {
            loadingBar.style.setProperty('--width', (loaded / total) * 100)
        };

        lm.onLoad = function () {
            document.getElementById("loading").style.display = 'none';
        }.bind(this);

        let rp = new RoomParser(this.scene, lm);
        rp.parseRoom("room.json");

        this.light.position.set(-1, 50, 4);
        this.camera.position.set(-100, 70, 50);

        this.holdedLight = new THREE.SpotLight(0xffffff, 0, 100, Math.PI * 0.1);
        this.scene.add(this.holdedLight);
        this.scene.add(this.holdedLight.target);
        this.isHoldingLight = false;
        this.isMoving = false;

        this.camera.lookAt(0, 0, 0);

        this.isLoaded = false

        const loader = new GLTFLoader(lm);
        loader.load(
            '../assets/models/hmo-man/hmo-ng.glb',

            function (gltf) {
                this.link = gltf.scene;
                this.link.name = 'model';
                this.link.scale.set(9, 9, 9);

                this.link.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });
        

                this.link.position.z -= 60;
                this.link.position.y = this.scene.getObjectByName("mazeFloor").position.y;

                this.link.castShadow = true;
                this.link.receiveShadow = false;

                this.scene.add(this.link);

                this.walkc = new MainCharacterWalk(this.link);
                this.holdLight = new MainCharacterHoldLight(this.link, this.holdedLight);
                this.stand = new MainCharacterStand(this.link);

                this.isLoaded = true;

            }.bind(this),
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {

                console.log('An error happened: ' + error);

            }
        );
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
        light.shadow.mapSize.set(1024,1024)
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;

        var side = 30;
        light.shadow.camera.top = side;
        light.shadow.camera.bottom = -side;
        light.shadow.camera.left = side;
        light.shadow.camera.right = -side;

        light.target.position.set(0,0,-50);

        //debug
        let helper = new THREE.CameraHelper( light.shadow.camera );
		this.scene.add( helper );
        let h = new THREE.DirectionalLightHelper( light, 5 );
		this.scene.add( h );


        return light
    }

    setupKeyControls() {
        document.onkeydown = function (e) {
            switch (e.keycode) {
                case 76:
                    console.log('ciao');
            }
        }
    }

    render(t) {
        let dt = t - this.last_t;
        TWEEN.update();

        if (this.isLoaded) {
            if (!this.isMoving) {
                this.stand.update();
            }
            this.isHoldingLight = this.holdLight.update(true);

            this.camera.lookAt(this.link.position.x, this.link.position.y, this.link.position.z);

            this.isMoving = this.walkc.update(this.isHoldingLight, !this.isMoving);

            // TODO change this as to use a physics engine
            //let wall = this.scene.getObjectByName("frontDoorWall");
            //let nextZ = Math.min(this.link.position.z + 1, wall.position.z - 3)
            AnimationUtils.translation(this.link, this.link.position.x, this.link.position.y, this.link.position.z+1, dudeSpeed * dt);
        }


        this.renderer.render(this.scene, this.camera);

        this.last_t = t;
        window.requestAnimationFrame((t) => this.render(t));
    }

}