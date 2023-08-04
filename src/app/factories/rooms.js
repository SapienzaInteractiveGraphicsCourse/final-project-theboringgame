import * as THREE from "../lib/three/build/three.module.js";
import { showTextBox, showHint } from "../utils/textBox.js"
import { config } from "../static/config.js";
import { AnimationUtils } from '../utils/animationUtils.js';
import { TWEEN } from '../lib/tween/build/tween.module.min.js';



export class RoomFactory {
    constructor(roomParser, scene, player, camera, physic) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.camera = camera;
        this.physic = physic;
    }

    async createMaze() {
        let instance = new Maze(this.rp, this.scene, this.player, this.camera, this.physic)
        await instance.create();
        return instance;
    }

    async createLightRoom() {
        let instance = new LightRoom(this.rp, this.scene, this.player, this.camera, this.physic)
        await instance.create();
        return instance;
    }

}

class Maze {
    constructor(roomParser, scene, player, camera, physic) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.physic = physic;
        this.playerRoot = player.getInstance();
        this.playerPhysic = player.getPhysic();
        this.camera = camera;
        this.hintTorch = true;
        this.cameraCloseUp = false;

    }
    async create() {
        await this.rp.parseRoom("maze-easy.json");
        this.light = this.#buildLight();
        this.playerPhysic.position.set(100, this.scene.getObjectByName("maze-floor").position.y + 7, -100);
        this.playerRoot.position.copy(this.playerPhysic);
        this.player.bodyOrientation = Math.PI / 2;
        this.scene.add(this.light);

        let holdedLight = new THREE.SpotLight(0xffffff, 0, 300, Math.PI * 0.1);
        holdedLight.castShadow = true;
        holdedLight.shadow.mapSize.set(1024, 1024)
        holdedLight.shadow.camera.near = 1;
        holdedLight.shadow.camera.far = 100;
        const side = 10;
        holdedLight.shadow.camera.top = side;
        holdedLight.shadow.camera.bottom = -side;
        holdedLight.shadow.camera.left = side;
        holdedLight.shadow.camera.right = -side;

        this.scene.add(holdedLight);
        this.scene.add(holdedLight.target);

        this.player.bindTorch(holdedLight);
    }

    #buildLight() {
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 0.01;
        let light = new THREE.AmbientLight(color, intensity);
        return light
    }

    init() {
        if (!config.debug)
            showTextBox("Hey, it looks like the light is cut off. I need to find the generator and place it on the platform to restore power.");
    }

    async update() {
        if (this.hintTorch && document.getElementById("dialog-container").innerHTML === "") {
            showHint("Press L to toggle the torchlight");
            this.hintTorch = false;
        }

        const genPhysic = this.rp.physicsItems.get('generator');
        const genInstance = this.scene.getObjectByName("generator");
        let closeToGenerator = genInstance == null ? false : this.playerRoot.position.distanceTo(genInstance.position) < 40.0;
        const platInstance = this.scene.getObjectByName("platform");
        let closeToPlatform = platInstance == null ? false : this.playerRoot.position.distanceTo(platInstance.position) < 40.0;

        let genOverPlat = genInstance == null ? false : genInstance.position.distanceTo(platInstance.position) < 40;

        if (closeToGenerator && !genOverPlat && document.getElementById("dialog-container").innerHTML === "") {
            showHint("Press P to pick the generator up", 10);
        }

        if (closeToPlatform && document.getElementById("dialog-container").innerHTML === "") {
            if (this.player.items.has("generator"))
                showHint("Press P to place the generator", 10);
            else if (!genOverPlat)
                showHint("I found the platform, but I don't have the generator", 10);
        }

        if (this.player.action) {

            if (closeToGenerator && !genOverPlat && !this.player.items.has("generator")) {
                this.player.items.set("generator", genInstance);
                this.scene.remove(genInstance);
                const platformPos = this.scene.getObjectByName("platform").position;
                genPhysic.position.set(platformPos.x, 5, platformPos.z);
            }

            if (closeToPlatform && this.player.items.has("generator")) {
                const platformPos = this.scene.getObjectByName("platform").position;

                this.player.items.get("generator").position.set(platformPos.x, 5, platformPos.z);

                this.scene.add(this.player.items.get("generator"));

                this.player.items.delete("generator");

                this.light.intensity = 0.8;

                this.physic.removeBody(this.rp.physicsItems.get('door'));
                this.cameraCloseUp = true;
                const doorpos = this.scene.getObjectByName("door").position;

                this.camera.lookAt(doorpos.x - 65, doorpos.y + 50, doorpos.z + 1000);

                AnimationUtils.translation(this.camera, doorpos.x - 65, doorpos.y + 50, doorpos.z - 80, 2000);
                AnimationUtils.rotation(this.camera, -Math.PI, 2 * Math.PI, Math.PI, 2000);

                new TWEEN.Tween(this.scene.getObjectByName('door').getObjectByName("pCube5").position)
                    .to({
                        x: 0,
                        y: 0,
                        z: 100
                    }, 2000)
                    .delay(2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(() => { this.cameraCloseUp = false; })

                new TWEEN.Tween(this.scene.getObjectByName('door').getObjectByName("pCube6").position)
                    .to({
                        x: 0,
                        y: 0,
                        z: -100
                    }, 2000)
                    .delay(2000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(() => {
                        this.cameraCloseUp = false;
                        if (!config.debug)
                            showTextBox('I can finally see this place clearly, now I have to get out of here');
                    })
            }

            this.player.action = false;
        }

        if (!this.cameraCloseUp) {
            this.camera.position.set(this.playerRoot.position.x, this.playerRoot.position.y + 150, this.playerRoot.position.z + 50);
            this.camera.lookAt(...Object.values(this.playerRoot.position));
        }
        this.player.action = false;
    }

    isCleared() {
        const winBox = new THREE.Box3().setFromObject(this.scene.getObjectByName("maze-win"));
        const playerclipped = new THREE.Vector3(this.playerRoot.position.x, (winBox.max.y+winBox.min.y)/2, this.playerRoot.position.z);

        return winBox.containsPoint(playerclipped);
    }
}


class LightRoom {
    constructor(roomParser, scene, player, camera, physic) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.physic = physic;
        this.playerRoot = player.getInstance();
        this.playerPhysic = player.getPhysic();
        this.camera = camera;
    }
    async create() {
        await this.rp.parseRoom("lightRoom.json");
        this.light = this.#buildLight();

        this.playerPhysic.position.set(0,  20, 0);
        this.playerRoot.position.copy(this.playerPhysic);
        this.player.bodyOrientation = Math.PI / 2;
        this.scene.add(this.light);
        
    }

    #buildLight() {
        // TODO: move parameters to config file 
        //const color = 0xFF8822;
        const color = 0xFFFFFF;
        const intensity = 1;
        let light = new THREE.DirectionalLight(color, intensity);
        return light
    }

    init() {
        const geometry = new THREE.BoxGeometry( 30, 30, 30 ); 
        const material = new THREE.MeshStandardMaterial({color:"#11aaff"});
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.set(0,15,0); 
        this.scene.add( this.cube );
        this.factor = 0.1;
    }

    async update() {
        this.camera.position.set(this.playerRoot.position.x, this.playerRoot.position.y + 100, this.playerRoot.position.z + 100);
        this.camera.lookAt(...Object.values(this.playerRoot.position));
        if(this.playerRoot.position.z > 0){
            this.light.color = new THREE.Color(0xFFFFFF);
        }
        else{
            this.light.color = new THREE.Color(0xFF8822);
        }

        if(Math.abs(this.cube.position.y-30) > 15)
            this.factor *= -1;
        this.cube.position.y += this.factor;
    }

    isCleared() {
        return false;
    }
}