import * as THREE from "./lib/three/build/three.module.js";
import * as CANNON from "./lib/cannon/cannon-es.js"
import { config } from "./static/config.js";
import { TWEEN } from './lib/tween/build/tween.module.min.js';
import { RoomParser } from "./utils/roomParser.js"
import { CharacterFactory } from "./factories/characters.js"
import { RoomFactory } from "./factories/rooms.js"
import { ModelsLoader } from "./utils/loader.js"
import { KeyHandlerUtil } from "./utils/keyhandler.js";
import CannonDebugger from "./lib/cannon/cannon-es-debugger.js"
import Stats from './lib/stats/stats.module.js';

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
        this.physics = this.#buildPhysics();
        this.ml = new ModelsLoader(this.lm);
        this.rp = new RoomParser(this.scene, this.lm, this.ml,this.physics);
        this.debugger = CannonDebugger(this.scene,this.physics);

        this.stats = new Stats()
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
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
        const canvas = document.querySelector('#scene-canvas');
        let renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

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

    #buildPhysics(){
        const physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -30, 0)
        });
        return physicsWorld;
    }

    #init() {
        this.container.appendChild(this.renderer.domElement);

        KeyHandlerUtil.setupKeyHandler(this.mainChar);

        // Idk if this is the right place to generate the torch. Consider to move it somewhere else
        this.holdedLight = new THREE.SpotLight(0xffffff, 0, 300, Math.PI * 0.1);
        this.holdedLight.castShadow = true;
        this.holdedLight.shadow.mapSize.set(1024, 1024)
        this.holdedLight.shadow.camera.near = 1;
        this.holdedLight.shadow.camera.far = 100;
        var side = 10;
        this.holdedLight.shadow.camera.top = side;
        this.holdedLight.shadow.camera.bottom = -side;
        this.holdedLight.shadow.camera.left = side;
        this.holdedLight.shadow.camera.right = -side;

        this.scene.add(this.holdedLight);
        this.scene.add(this.holdedLight.target);

        this.mainChar.bindTorch(this.holdedLight);
        this.scene.add(this.mainChar.getInstance());
        this.physics.addBody(this.mainChar.getPhysic());

        document.getElementById("progress-bar").style.setProperty('--width', 100);
        document.getElementById("loading").style.display = 'none';

        this.currentRoom.init();

        this.render();
    }

    #resizeRendererAndCamera() {
        const canvas = this.renderer.domElement;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, false);
        }
    }

    render(t) {
        this.stats.begin();
        let dt = t - this.last_t;
        if (isNaN(dt))
            dt = 0;

        this.#resizeRendererAndCamera();
        this.physics.fixedStep();
        //this.debugger.update(); //uncomment to test physics
        TWEEN.update();
        this.mainChar.update(dt);
        this.currentRoom.update();

        this.renderer.render(this.scene, this.camera);

        this.last_t = t;
        window.requestAnimationFrame((t) => this.render(t));
        this.stats.end();
    }

}