import { BuildingFactory } from '../factories/buldings.js';
import { MaterialFactory } from '../factories/materials.js';


//TODO: handle lights

const folder = "./app/static/";

export class RoomParser {
    constructor(scene, loadingManager) {
        this.bf = new BuildingFactory();
        this.mf = new MaterialFactory(loadingManager);
        this.scene = scene;
    }

    parseRoom(name) {
        const path = folder + name;
        fetch(path)
            .then(response => response.json())
            .then(function (data) {
                this.#parse(data);
            }.bind(this))
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
    }

    #parse(data) {
        data.forEach(element => {
            let obj = this.#createElement(element.type, element.params);
            if (obj && obj.isObject3D) {
                obj.name = element.name;
                this.#placeElement(obj, element.pose);

                this.scene.add(obj);
            }
        });
    }

    #createElement(type, params) {
        switch (type) {
            case "floor":
                let materialFloor = this.#createMaterial(params);
                let dimFloor = Object.values(params).slice(0,2);
                return this.bf.createFloor(dimFloor, materialFloor);

            case "wall":
                let dim = Object.values(params).slice(0, 3);
                let materialWall = this.#createMaterial(params);
                return this.bf.createBasicWall(dim, materialWall);

            case "doorwall":
                let dimWall = Object.values(params).slice(0, 3);
                let dimDoor = Object.values(params).slice(4, 6);
                let materialDW = this.#createMaterial(params);
                return this.bf.createDoorWall(dimWall, materialDW, dimDoor);

            default:
                throw new Error("Invalid element " + type + ". The types currently supported are: floor, wall, doorwall");
                break;
        }
    }

    #createMaterial(params) {
        switch (params.texture.name) {
            case "scifi-wall":
                return this.mf.createSciFiWallMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1])

            case "scifi-floor":
                return this.mf.createSciFiFloorMaterial(params.texture.density, Object.values(params)[0], Object.values(params)[1])

            default:
                throw new Error("Invalid texture " + type + ". The textures currently supported are: scifi-wall, scifi-floor");
                break;
        }
    }

    #placeElement(obj, pose) {
        obj.position.set(...Object.values(pose.translation))
        obj.rotation.set(...Object.values(pose.rotation))
    }
}