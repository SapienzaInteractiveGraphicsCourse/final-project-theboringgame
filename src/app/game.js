import * as THREE from "../lib/three/build/three.module.js";
import {GLTFLoader} from "../lib/three/loaders/GLTFLoader.js";
import {BasicWall} from '../factories/wall.js';

import {config} from "./static/config.js";

let instance;

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

        // TODO: just for testing purposes.

        /*
        let wall= new BasicWall([1,1,1],1,0);
        let wallInstance = wall.create_wall();
        this.scene.add(wallInstance);
        this.light.position.set(-1, 2, 4);
        this.camera.position.set(0, 0, 4);
        */

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