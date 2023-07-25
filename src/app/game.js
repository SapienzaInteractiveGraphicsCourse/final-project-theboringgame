import * as THREE from "../lib/three/build/three.module.js";
import {GLTFLoader} from "../lib/three/loaders/GLTFLoader.js";
import {WallFactory} from '../factories/wall.js';

import {config} from "./static/config.js";

let instance;
const wallWidth=100;
const wallHeigth=20;
const wallDepth=3;
const vector = new THREE.Vector3()
var phi=0;
var theta=0;
const doorWidth=12;
const doorHeigth=15;
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

        this.wallFac = new WallFactory();

        // TODO: just for testing purposes.

        let wall = this.wallFac.createDoorWall([wallWidth,wallHeigth,wallDepth], null,[doorWidth,doorHeigth]);
        let wall2 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);
        let wall3 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);
        let wall4 = this.wallFac.createBasicWall([wallWidth,wallHeigth,wallDepth], null);

        wall2.position.set(wallWidth/2-wallDepth/2,0,-wallWidth/2);
        wall2.rotation.y = Math.PI/2;
        wall3.position.set(-wallWidth/2+wallDepth/2,0,-wallWidth/2);
        wall3.rotation.y = Math.PI/2;
        wall4.position.set(0,0,-wallWidth);
        this.scene.add(wall,wall2,wall3,wall4);
        //this.scene.add(wall2);
        this.light.position.set(-1, 2, 4);
        this.camera.position.set(0, 70, 100);

        vector.x=5*Math.sin(theta)*Math.cos(phi);
        vector.y=5*Math.sin(theta)*Math.sin(phi);
        vector.z=5*Math.cos(theta);
        
        this.camera.lookAt(0,0,0);

        this.isLoaded = false
        
        const loader = new GLTFLoader();
        loader.load(
            '../assets/models/link/Link.glb',

            function ( gltf ) {
                this.link = gltf.scene;  
                this.link.scale.set(20, 20, 20);
                this.link.rotation.x += Math.PI/2;
                this.link.position.z -= 80;
                this.link.position.y -= 20;
                this.scene.add( this.link );
        
                this.linkAnimation = gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

                this.isLoaded = true;
        
            }.bind(this),
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            function ( error ) {
        
                console.log( 'An error happened' );
        
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
        return renderer;
    }

    #buildLight(){
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 1;
        return new THREE.DirectionalLight(color, intensity);
    }

    render(){
        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(() => this.render());
        if(this.isLoaded)
            this.link.rotation.z += 0.01;
    }

}