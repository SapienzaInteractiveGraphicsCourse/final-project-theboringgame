import { BuildingFactory } from '../factories/buldings.js';
import { MaterialFactory } from '../factories/materials.js';
import { ObjectsFactory } from '../factories/objects.js';


//TODO: handle lights

const folder = "./app/static/";

export class RoomParser {
    constructor(scene, loadingManager, modelLoader, worldPhysics) {
        this.bf = new BuildingFactory();
        this.mf = new MaterialFactory(loadingManager);
        this.of = new ObjectsFactory(modelLoader);
        this.scene = scene;
        this.worldPhysics = worldPhysics;
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
            if(obj[1]){

                obj[1].name = element.name;

                await this.#placePhysic(obj[1], element.pose);

                this.worldPhysics.addBody(obj[1]);
            }
        }
    }

    async #createElement(type, params) {
        switch (type) {
            case "floor":
                let dimFloor = Object.values(params).slice(0,2);
                let materialFloor = await this.#createMaterial(params);
                return this.bf.createFloor(dimFloor, materialFloor);

            case "wall":
                let dim = Object.values(params).slice(0, 3);
                let materialWall = await this.#createMaterial(params);
                return this.bf.createBasicWall(dim, materialWall);

            case "doorwall":
                let dimWall = Object.values(params).slice(0, 3);
                let dimDoor = Object.values(params).slice(4, 6);
                let materialDW = await this.#createMaterial(params);
                return this.bf.createDoorWall(dimWall, materialDW, dimDoor);

            case "generator":
                return this.of.createGenerator();

            case "platform":
                return this.of.createPlatform();

            default:
                throw new Error("Invalid element " + type + ". The types currently supported are: floor, wall, doorwall, generator, platform");
        }
    }

    async #createMaterial(params) {
        switch (params.texture.name) {
            case "scifi-wall":
                return await this.mf.createSciFiWallMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1])

            case "scifi-floor":
                return await this.mf.createSciFiFloorMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1])

            default:
                throw new Error("Invalid texture " + type + ". The textures currently supported are: scifi-wall, scifi-floor");
        }
    }

    async #placeElement(obj, pose) {
        obj.position.set(...Object.values(pose.translation))
        obj.rotation.set(...Object.values(pose.rotation))
    }

    async #placePhysic(obj, pose) {
        obj.position.set(...Object.values(pose.translation));
        obj.quaternion.setFromEuler(...Object.values(pose.rotation));
    }
}