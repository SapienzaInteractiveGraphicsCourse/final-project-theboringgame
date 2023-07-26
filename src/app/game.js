import * as THREE from "./lib/three/build/three.module.js";
import {GLTFLoader} from "./lib/three/loaders/GLTFLoader.js";
import {BuildingFactory} from './factories/buldings.js';
import {Walk} from './animations/walk.js';
import {config} from "./static/config.js";
import {TWEEN} from './lib/tween/build/tween.module.min.js';

// TODO: just for testing purposes
let instance;
const wallWidth=100;
const wallHeigth=20;
const wallDepth=3;
var phi=0;
var theta=0;
const doorWidth=12;
const doorHeigth=15;
let built=false;
//END testing

/* 
This class designed as a singleton handles the game's main loop and contains fundamental rendering elements.
*/

export class Game{

    constructor(){
        if(instance)
            throw new Error("Class Game is a singleton, a new instance cannot be created");
        instance = this;

        this.container = document.querySelector('#scene-container');

        this.renderer = this.#buildRenderer();
        this.camera = this.#buildCamera();
        this.scene = this.#buildScene();
        this.light = this.#buildLight();

        this.wallFac = new BuildingFactory();

        // TODO: just for testing purposes.

        let wall = this.wallFac.createDoorWall([wallWidth,wallHeigth,wallDepth],null,[doorWidth,doorHeigth]);
        let wall2 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);
        let wall3 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);
        let wall4 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);

        let floor = this.wallFac.createFloor([wallWidth,wallWidth]);

        floor.rotation.x = -Math.PI/2;
        floor.position.set(0,-wallHeigth/2,-wallWidth/2);
        floor.receiveShadow = true;

        wall2.position.set(wallWidth/2-wallDepth/2,0,-wallWidth/2);
        wall2.rotation.y = Math.PI/2;
        wall3.position.set(-wallWidth/2+wallDepth/2,0,-wallWidth/2);
        wall3.rotation.y = Math.PI/2;
        wall4.position.set(0,0,-wallWidth);
        this.scene.add(wall,wall2,wall3,wall4,floor);

        this.light.position.set(-1, 2, 4);
        this.camera.position.set(-100, 50, 10);
        
        this.camera.lookAt(0,0,0);

        this.isLoaded = false
        
        const loader = new GLTFLoader();
        loader.load(
            '../assets/models/hmo-man/hmo-ng.glb',

            function ( gltf ) {
                this.link = gltf.scene;  
                this.link.name='model';
                this.link.scale.set(9, 9, 9);

                this.link.position.z -= 60;
                this.link.position.y = floor.position.y;

                this.link.castShadow = true;
                this.link.receiveShadow = false;

                this.scene.add( this.link );

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

                this.walkc = new Walk(this.link.getObjectByName("LeftUpperLeg_050"),
                                        this.link.getObjectByName("RightUpperLeg_053"),
                                            this.link.getObjectByName("LeftLowerLeg_051"),
                                                this.link.getObjectByName("RightLowerLeg_054"),
                                                    this.link.getObjectByName("LeftShoulder_013"),
                                                        this.link.getObjectByName("RightShoulder_032"));

                this.isLoaded = true;
        
            }.bind(this),
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
        
                console.log( 'An error happened: '+error );
        
            }
        );
        // END testing
        this.scene.add(this.light);

        this.container.appendChild( this.renderer.domElement );
    }

    #buildScene(){
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(config["game"]["scene"]["background"]);
        return scene;
    }

    #buildCamera(){
        return new THREE.PerspectiveCamera(...Object.values(config["game"]["camera"]));
    }

    #buildRenderer(){
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        return renderer;
    }

    #buildLight(){
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 1;
        let light = new THREE.DirectionalLight(color, intensity);

        // shadows
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;

        return light
    }

    render(){
        this.renderer.render( this.scene, this.camera );
        TWEEN.update();
        window.requestAnimationFrame(() => this.render());
        if(this.isLoaded){

            this.walkc.update();

        }
    }

}