import * as THREE from "../lib/three/build/three.module.js";

import {config} from "./static/config.js";

// Just a junk class used for testing. Remove this when the project is in release
export class Test {

    constructor(){
        this.build();
    }
    
    build () {
        const container = document.querySelector('#scene-container');

        // create a Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('skyblue');

        // Create a camera
        const fov = 35; // AKA Field of View
        const aspect = container.clientWidth / container.clientHeight;
        const near = 0.1; // the near clipping plane
        const far = 100; // the far clipping plane
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


        // every object is initially created at ( 0, 0, 0 )
        // move the camera back so we can view the scene
        this.camera.position.set(0, 0, 4);

        // create a geometry
        /* 
        DANIELE: the method BoxBufferGeometry suggested from the official documentation has been removed from the THREE core and has been replaced by BufferGeometry.
        We have to figure out what is the purpose of buffering a geometry element rather than just render it (and if it is actually needed). 
        */
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // DANIELE: basic material not affected by light while phong material yes
        const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );

        // Light
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);


        // create the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        container.appendChild( this.renderer.domElement );

        this.render();
    }

    render() {
        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(() => this.render());
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

    }
}