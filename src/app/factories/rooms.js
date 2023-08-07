import * as THREE from "../lib/three/build/three.module.js";
import { showTextBox, showHint } from "../utils/textBox.js"
import { config } from "../static/config.js";
import { AnimationUtils } from '../utils/animationUtils.js';
import { TWEEN } from '../lib/tween/build/tween.module.min.js';
import { Cube } from "../utils/cube.js";
import { FontLoader } from "../lib/three/loaders/FontLoader.js"

export class RoomFactory {
    constructor(roomParser, scene, player, camera, physic, difficulty) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.camera = camera;
        this.physic = physic;
        this.difficulty = difficulty;
    }

    async createMaze() {
        let instance = new Maze(this.rp, this.scene, this.player, this.camera, this.physic, this.difficulty)
        await instance.create();
        return instance;
    }

    async createLightRoom() {
        let instance = new LightRoom(this.rp, this.scene, this.player, this.camera, this.physic, this.difficulty)
        await instance.create();
        return instance;
    }

}

class Maze {
    constructor(roomParser, scene, player, camera, physic, difficulty) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.physic = physic;
        this.playerRoot = player.getInstance();
        this.playerPhysic = player.getPhysic();
        this.camera = camera;
        this.hintTorch = true;
        this.cameraCloseUp = false;
        this.cleared = false;
        this.difficulty = difficulty;
    }
    async create() {
        switch (this.difficulty) {
            case 1:
                await this.rp.parseRoom("maze-easy.json");
                this.playerPhysic.position.set(100, this.scene.getObjectByName("maze-floor").position.y + 7, -100);
                this.playerRoot.position.copy(this.playerPhysic);
                this.player.bodyOrientation = Math.PI / 2;
                break;
            case 2:
                await this.rp.parseRoom("maze-medium.json");
                this.playerPhysic.position.set(250, this.scene.getObjectByName("maze-floor").position.y + 7, -250);
                this.playerRoot.position.copy(this.playerPhysic);
                this.player.bodyOrientation = 0;
                break
            case 3:
                await this.rp.parseRoom("maze-difficult.json");
                this.playerPhysic.position.set(300, this.scene.getObjectByName("maze-floor").position.y + 7, -300);
                this.playerRoot.position.copy(this.playerPhysic);
                this.player.bodyOrientation = 0;
                break
            default:
                throw new Error("difficulty not recognized");
        }
        this.light = this.#buildLight();
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

        if(this.#isWinPosition()){
            this.player.spin();
            new TWEEN.Tween(this.playerPhysic.position)
                .to({
                    x:this.scene.getObjectByName("maze-win").position.x,
                    y:130,
                    z:this.scene.getObjectByName("maze-win").position.z 
                },2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onComplete(() =>{
                    this.cleared = true;
                })
            return;
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

    #isWinPosition(){
        const winBox = new THREE.Box3().setFromObject(this.scene.getObjectByName("maze-win"));
        const playerclipped = new THREE.Vector3(this.playerRoot.position.x, (winBox.max.y + winBox.min.y) / 2, this.playerRoot.position.z);

        return winBox.containsPoint(playerclipped);
    }

    isCleared() {
        return this.cleared;
    }
}


class LightRoom {
    constructor(roomParser, scene, player, camera, physic, difficulty) {
        this.rp = roomParser;
        this.scene = scene;
        this.player = player;
        this.physic = physic;
        this.playerRoot = player.getInstance();
        this.playerPhysic = player.getPhysic();
        this.camera = camera;
        this.difficulty = difficulty;
    }

    async create() {
        await this.rp.parseRoom("lightRoom.json");
        this.light = this.#buildLight();

        this.playerPhysic.position.set(0, 120, 250);
        this.playerRoot.position.copy(this.playerPhysic);
        this.light.color = new THREE.Color(0xFFFFFF);
        this.scene.add(this.light);

    }

    #buildLight() {
        // TODO: move parameters to config file 
        const color = 0xFFFFFF;
        const intensity = 1;
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 100, 200);
        return light
    }

    initCube(d, c, x, y, z) {
        let cube = new Cube(d, { color: c }, x, y, z);
        let cubeInst = cube.create();
        cubeInst.name = c;
        this.scene.add(cubeInst);
        return cubeInst;
    }

    init() {
        this.cubeRed = this.initCube(14, "red", 100, 54, 0);
        this.cubeLightBlue = this.initCube(14, "lightblue", -100, 54, 0);
        this.cubeGreen = this.initCube(14, "lightgreen", 100, 54, -100);
        this.cubeYellow = this.initCube(14, "yellow", -100, 54, -100);
        this.cubePink = this.initCube(14, "pink", 100, 54, 100);
        this.cubeOrange = this.initCube(14, "orange", -100, 54, 100);
        this.factorRed = 0.05;
        this.factorLightBlue = 0.05;
        this.factorGreen = 0.05;
        this.factorYellow = 0.05;
        this.factorPink = 0.05;
        this.factorOrange = 0.05;

        this.solution = ["red", "lightgreen"];

        if(this.difficulty > 1)
            this.solution.push("pink");
        if(this.difficulty > 2)
            this.solution.push("orange");

        this.isSpawned = true;
        this.writeOnBook(this.solution)
        this.pick = 0;
        this.win = false;
        this.life = 3;

        this.invWall = this.rp.physicsItems.get('invisiblewall');
    }

    writeOnBook(solutionArray) {
        let modArray1 = new Array();
        let modArray2 = new Array();
        solutionArray.slice(0, 2).forEach((word, index) => {
            const firstLetter = word.charAt(0).toUpperCase();
            const rest = word.slice(1).toLowerCase();

            modArray1.push(firstLetter + rest);
        });
        solutionArray.slice(2).forEach((word, index) => {
            const firstLetter = word.charAt(0).toUpperCase();
            const rest = word.slice(1).toLowerCase();

            modArray2.push(firstLetter + rest);
        });

        const password = modArray1.toString().replace(",", " - ") + "\n" + modArray2.toString().replace(",", " - ")

        const loader = new FontLoader();
        loader.load('../../assets/font/Great-Vibes/Great_Vibes_Regular.json', function (font) {

            const color = 0x000000;

            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide
            });

            const message = ' The password is \n' + password;

            const shapes = font.generateShapes(message, 1);

            const geometry = new THREE.ShapeGeometry(shapes);

            geometry.computeBoundingBox();

            const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

            geometry.translate(xMid, 0, 0);

            const text = new THREE.Mesh(geometry, matLite);
            const book = this.scene.getObjectByName("book");
            text.position.z = book.position.z - 6;
            text.position.x = book.position.x - 5;
            text.position.y = book.position.y + 2.7;
            text.rotation.x = - Math.PI / 2;
            text.rotation.y = 0;

            this.scene.add(text);

        }.bind(this));
    }

    animate(cube, factor) {
        if (cube.position.y > 60) {
            factor *= -1;
        } else if (cube.position.y < 54) {
            factor = 0.05;
        }
        cube.position.y += factor;
        cube.rotateY(0.005);
        cube.rotateX(0.005);
        return factor;
    }

    checkButton(name, color) {
        const Inst = this.scene.getObjectByName(name);
        let closeTo = Inst == null ? false : this.playerRoot.position.distanceTo(Inst.position) < 25.0;

        if (closeTo && this.playerRoot.position.z > Inst.position.z)
            showHint("Press C to change light", 10);

        if (this.player.change && closeTo)
            this.light.color = new THREE.Color(color);

    }

    checkCube(objName) {
        const Inst = this.scene.getObjectByName(objName);
        let closeTo = Inst == null ? false : this.playerRoot.position.distanceTo(Inst.position) < 65.0;

        if (closeTo)
            showHint("Press Enter to select this option", 10);

        if (this.player.select && closeTo) {
            if (this.solution[this.pick] == objName) {
                if (this.pick == this.solution.length - 1) {
                    this.win = true;
                } else {
                    showTextBox("Correct pick!");
                    this.pick += 1;
                }
            } else {
                this.pick = 0;
                this.life -= 1;
                if (this.life)
                    showTextBox("Wrong pick. You lost a life, " + this.life + " life remaining");
            }
        }
    }

    async update() {

        this.factorRed = this.animate(this.cubeRed, this.factorRed);
        this.factorLightBlue = this.animate(this.cubeLightBlue, this.factorLightBlue);
        this.factorGreen = this.animate(this.cubeGreen, this.factorGreen);
        this.factorYellow = this.animate(this.cubeYellow, this.factorYellow);
        this.factorPink = this.animate(this.cubePink, this.factorPink);
        this.factorOrange = this.animate(this.cubeOrange, this.factorOrange);

        if (this.life && !this.win) {
            const bookInstance = this.scene.getObjectByName("book");
            let closeTobook = bookInstance == null ? false : this.playerRoot.position.distanceTo(bookInstance.position) < 40.0;
            if (!closeTobook) {
                this.camera.position.set(this.playerRoot.position.x, this.playerRoot.position.y + 50, this.playerRoot.position.z + 120);
                this.camera.lookAt(...Object.values(this.playerRoot.position));
            }
            else {
                this.camera.position.set(bookInstance.position.x, bookInstance.position.y + 30, bookInstance.position.z);
                this.camera.lookAt(...Object.values(bookInstance.position));
            }

            if(this.playerRoot.position.y>2.1){
                this.player.spin();
            }else{
                this.player.stopSpin();
            }

            this.checkButton("button1", 0xFF7000);
            this.checkButton("button2", 0x70FF00);
            this.checkButton("button3", 0x7000FF);

            this.checkCube("red");
            this.checkCube("lightblue");
            this.checkCube("lightgreen");
            this.checkCube("yellow");
            this.checkCube("pink");
            this.checkCube("orange");

            if (this.win)
                showTextBox("CORRECT PICK! YOU WON!!!");

            if (this.life == 0)
                showTextBox("YOU LOSE, GAME OVER");
        }

        if (this.win) {
            AnimationUtils.translation(this.camera, this.playerRoot.position.x, this.playerRoot.position.y + 150, this.playerRoot.position.z - 150);
            AnimationUtils.rotation(this.camera, 0, 0, Math.PI);
            this.camera.lookAt(...Object.values(this.playerRoot.position));
            this.light.position.set(0, 100, -100);
            this.light.color = new THREE.Color(0xFFFFFF);
            this.physic.removeBody(this.invWall);

        }

        this.player.select = false;
        this.player.read = false;
        this.player.change = false;
    }

    isCleared() {
        return false;
    }
}