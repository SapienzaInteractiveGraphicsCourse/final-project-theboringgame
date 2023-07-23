import * as THREE from "../lib/three/build/three.module.js";
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
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.rotation.x += Math.PI/4;
        this.cube.rotation.y += Math.PI/8;
        this.scene.add( this.cube );
        this.light.position.set(-1, 2, 4);
        this.camera.position.set(0, 0, 4);
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
        return new THREE.DirectionalLight(color, intensity);;
    }

    render(){
        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(() => this.render());
    }

}