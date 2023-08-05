import { BuildingFactory } from '../factories/buldings.js';
import { MaterialFactory } from '../factories/materials.js';
import { ObjectsFactory } from '../factories/objects.js';
import { config } from '../static/config.js';


//TODO: handle lights ?? 

const folder = "./app/static/";

export class RoomParser {
    constructor(scene, loadingManager, modelLoader, worldPhysics) {
        this.bf = new BuildingFactory();
        this.mf = new MaterialFactory(loadingManager);
        this.of = new ObjectsFactory(modelLoader);
        this.physicsItems = new Map();
        this.scene = scene;
        this.worldPhysics = worldPhysics;
        this.LUT = {};
    }

    async parseRoom(name) {
        const path = folder + name;
        let response = await fetch(path);
        response = await response.json()
        await this.#parse(response);
    }

    async #parse(data) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj = await this.#createElement(element.type, element.params);
            if (obj[0] && obj[0].isObject3D) {

                obj[0].name = element.name;

                await this.#placeElement(obj[0], element.pose);

                this.scene.add(obj[0]);
            }
            if (obj[1] && !(config.debug && element.type == "wall")) {
                for (let index = 1; index < obj.length; index++) {
                    obj[index].name = element.name;
                    await this.#placePhysic(obj[index], element.pose, element.type);
                    this.worldPhysics.addBody(obj[index]);
                    this.physicsItems.set(obj[index].name,obj[index]);
                }
            }
        }
        this.LUT = {};
    }

    async #createElement(type, params) {
        switch (type) {
            case "floor":
                let dimFloor = Object.values(params).slice(0, 2);
                let materialFloor = await this.#createMaterial(params);
                return this.bf.createFloor(dimFloor, materialFloor);

            case "wall":
                let dim = Object.values(params).slice(0, 3);
                let materialWall = await this.#createMaterial(params);
                return this.bf.createBasicWall(dim, materialWall);

            case "doorwall":
                let dimWall = Object.values(params).slice(0, 3);
                let dimDoor = Object.values(params).slice(3, 5);
                let materialDW = await this.#createMaterial(params);
                return this.bf.createDoorWall(dimWall, materialDW, dimDoor);

            case "generator":
                return this.of.createGenerator();

            case "platform":
                return this.of.createPlatform();

            case "door":
                return this.of.createDoor();
                
            case "pillar":
                return this.of.createPillar();

            default:
                throw new Error("Invalid element " + type + ". The types currently supported are: floor, wall, doorwall, generator, platform");
        }
    }

    async #createMaterial(params) {
        let mat;
        switch (params.texture.name) {
            case "scifi-wall":
                mat = this.mf.createSciFiWallMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1]);
                break;
            case "scifi-floor":
                mat = this.mf.createSciFiFloorMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1]);
                break;

            default:
                throw new Error("Invalid texture " + type + ". The textures currently supported are: scifi-wall, scifi-floor");
        }

        const key = params.texture.name + mat.getRepeat();
        let res = null;
        if (this.LUT[key]) {
            // using cached textures
            res = mat.createWithPreload(this.LUT[key]);
        }
        else {
            res = await mat.create();
            // caching textures
            this.LUT[key] = mat.getTextures();
        }

        return res;
    }

    async #placeElement(obj, pose) {
        obj.position.set(...Object.values(pose.translation))
        obj.rotation.set(...Object.values(pose.rotation))
    }

    async #placePhysic(obj, pose, type) {
        switch (type) {
            case "wall":
                obj.position.set(...Object.values(pose.translation));
                break;
            case "doorwall":
                obj.position.y = pose.translation.y;
                obj.position.z = pose.translation.z;
                break;
            case "door":
                obj.position.x = pose.translation.x-65;
                obj.position.z = pose.translation.z;
                break;
            default:
                obj.position.x = pose.translation.x;
                obj.position.z = pose.translation.z;
                break;
        }

        obj.quaternion.setFromEuler(...Object.values(pose.rotation));
    }
}