import * as THREE from "../lib/three/build/three.module.js";
import { showTextBox, showHint } from "../utils/textBox.js"

export class RoomFactory {
    constructor(roomParser, scene, player, camera) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.camera = camera;
    }

    async createMaze() {
        let instance = new Maze(this.rp, this.scene, this.player, this.camera)
        await instance.create();
        return instance;
    }

}

class Maze {
    constructor(roomParser, scene, player, camera) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.playerRoot = player.getInstance();
        this.playerPhysic = player.getPhysic();
        this.camera = camera;
        this.hintTorch = true;
    }
    async create() {
        await this.rp.parseRoom("maze-easy.json");
        this.light = this.#buildLight();
        this.playerPhysic.position.set(100, this.scene.getObjectByName("maze-easy-floor").position.y + 7, -100);
        this.playerRoot.position.copy(this.playerPhysic);
        this.player.bodyOrientation = Math.PI / 2;

        this.scene.add(this.light);
    }

    #buildLight() {
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 0.01;
        let light = new THREE.AmbientLight(color, intensity);
        return light
    }

    init() {
        showTextBox("Hey, it looks like the light is cut off. I need to find the generator and place it on the platform to restore power.");
    }

    async update() {
        if (this.hintTorch && document.getElementById("dialog-container").innerHTML === "") {
            showHint("Press L to toggle the torchlight");
            this.hintTorch = false;
        }

        const genInstance = this.scene.getObjectByName("generator");
        let closeToGenerator = genInstance == null ? false : this.playerRoot.position.distanceTo(genInstance.position) < 40.0;
        const platInstance = this.scene.getObjectByName("platform");
        let closeToPlatform = platInstance == null ? false : this.playerRoot.position.distanceTo(platInstance.position) < 40.0;

        if (closeToGenerator && !closeToPlatform && document.getElementById("dialog-container").innerHTML === "") {
            showHint("Press P to pick the generator up", 10);
        }

        if (closeToPlatform && document.getElementById("dialog-container").innerHTML === "") {
            if(this.player.items.has("generator"))
                showHint("Press P to place the generator", 10);
            else if(closeToPlatform && !closeToGenerator)
                showHint("I found the platform, but I don't have the generator", 10);
        }

        if (this.player.action) {

            if (closeToGenerator && !closeToPlatform && !this.player.items.has("generator")) {
                this.player.items.set("generator", genInstance)
                this.scene.remove(genInstance);
            }

            if(closeToPlatform && this.player.items.has("generator")) {
                const platformPos = this.scene.getObjectByName("platform").position;
                this.player.items.get("generator").position.set(platformPos.x, 5, platformPos.z);
                this.scene.add(this.player.items.get("generator"))
                this.player.items.delete("generator");
            }

            this.player.action = false;
        }

        this.camera.position.set(this.playerRoot.position.x, this.playerRoot.position.y + 150, this.playerRoot.position.z + 50);
        this.camera.lookAt(...Object.values(this.playerRoot.position));
        this.player.action = false;
    }
}