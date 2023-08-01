import * as THREE from "./lib/three/build/three.module.js";
import { config } from "./static/config.js";
import { TWEEN } from './lib/tween/build/tween.module.min.js';
import { RoomParser } from "./utils/roomParser.js"
import { CharacterFactory } from "./factories/characters.js"
import { RoomFactory } from "./factories/rooms.js"
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
        this.lm = this.#buildLoader();
        this.ml = new ModelsLoader(this.lm);
        this.rp = new RoomParser(this.scene, this.lm, this.ml);
    }

    async load() {

        await this.ml.loadModels();

        let cf = new CharacterFactory(this.ml);
        this.mainChar = cf.createMainRobot(this.lm);
        
        this.rf = new RoomFactory(this.rp, this.scene, this.mainChar, this.camera);
        this.currentRoom = await this.rf.createMaze();

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

    #buildLoader() {
        const lm = new THREE.LoadingManager();

        lm.onProgress = async (url, loaded, total) => {
            document.getElementById("progress-bar").style.setProperty('--width', (loaded / total) * 90)
        };

        return lm;
    }

    #init() {

        this.container.appendChild(this.renderer.domElement);

        setupKeyHandler(this.mainChar);

        // Idk if this is the right place to generate the torch. Consider to move it somewhere else
        this.holdedLight = new THREE.SpotLight(0xffffff, 0, 300, Math.PI * 0.1);
        this.scene.add(this.holdedLight);
        this.scene.add(this.holdedLight.target);

        this.mainChar.bindTorch(this.holdedLight);
        this.scene.add(this.mainChar.getInstance());

        document.getElementById("progress-bar").style.setProperty('--width', 100);
        document.getElementById("loading").style.display = 'none';

        this.render();
    }



    render(t) {
        let dt = t - this.last_t;
        if (isNaN(dt))
            dt = 0;

        TWEEN.update();
        this.mainChar.update(dt);
        this.currentRoom.update();

        this.renderer.render(this.scene, this.camera);

        this.last_t = t;
        window.requestAnimationFrame((t) => this.render(t));
    }

}