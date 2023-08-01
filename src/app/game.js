import * as THREE from "./lib/three/build/three.module.js";
import { config } from "./static/config.js";
import { TWEEN } from './lib/tween/build/tween.module.min.js';
import { RoomParser } from "./utils/roomParser.js"
import { CharacterFactory } from "./factories/characters.js"
import { ModelsLoader } from "./utils/loader.js"
import { setupKeyHandler } from "./utils/keyhandler.js";
let instance;

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
        this.lm = this.#buildLoader();

    }

    async load() {

        // TODO: just for testing purposes. Hard refactoring is needed (create a class for each world)
        this.ml = new ModelsLoader(this.lm);
        await this.ml.loadModels();

        let cf = new CharacterFactory(this.ml);

        this.mainChar = cf.createMainRobot(this.lm);

        this.light.position.set(-1, 50, 4);
        this.camera.position.set(-100, 70, 250);

        this.holdedLight = new THREE.SpotLight(0xffffff, 0, 300, Math.PI * 0.1);
        this.scene.add(this.holdedLight);
        this.scene.add(this.holdedLight.target);

        let rp = new RoomParser(this.scene, this.lm, this.ml);
        await rp.parseRoom("maze-easy.json");
        // END testing

        this.scene.add(this.light);
        this.container.appendChild(this.renderer.domElement);

        this.#init();
    }

    #buildScene() {
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(config.game.scene.background);
        return scene;
    }

    #buildCamera() {
        return new THREE.PerspectiveCamera(...Object.values(config.game.camera));
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
        const intensity = 0.01;
        //let light = new THREE.DirectionalLight(color, intensity);
        let light = new THREE.AmbientLight(color, intensity);

        // shadows
        /*
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
        */
        return light
    }

    #buildLoader() {
        const lm = new THREE.LoadingManager();

        lm.onProgress = async (url, loaded, total) => {
            document.getElementById("progress-bar").style.setProperty('--width', (loaded / total) * 90)
        };

        return lm;
    }

    #init() {
        this.mainCharInstance = this.mainChar.getInstance();

        setupKeyHandler(this.mainChar);

        this.mainCharInstance.position.z = -100;
        this.mainCharInstance.position.x = 100;
        this.mainCharInstance.position.y = this.scene.getObjectByName("maze-easy-floor").position.y;
        this.mainChar.bodyOrientation = Math.PI / 2;
        this.mainChar.bindTorch(this.holdedLight);
        this.scene.add(this.mainCharInstance);

        document.getElementById("progress-bar").style.setProperty('--width', 100);
        document.getElementById("loading").style.display = 'none';

        this.render();
    }



    render(t) {
        let dt = t - this.last_t;
        if (isNaN(dt))
            dt = 0;

        TWEEN.update();

        this.camera.lookAt(this.mainCharInstance.position.x, this.mainCharInstance.position.y, this.mainCharInstance.position.z);


        this.camera.position.set(this.mainChar.getInstance().position.x, this.mainChar.getInstance().position.y + 150, this.mainChar.getInstance().position.z + 50);
        this.camera.lookAt(...Object.values(this.mainChar.getInstance().position));

        this.mainChar.update(dt);

        this.renderer.render(this.scene, this.camera);


        this.last_t = t;
        window.requestAnimationFrame((t) => this.render(t));
    }

}