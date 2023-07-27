import {BuildingFactory} from '../factories/buldings.js';

//TODO: handle lights

const folder = "./app/static/";

export class RoomParser{
    constructor(scene){
        this.bf = new BuildingFactory();
        this.scene = scene;
    }

    parseRoom(name){
        const path = folder+name;
        fetch(path)
        .then(response => response.json())
        .then(function(data){
          this.#parse(data);
        }.bind(this))
        .catch(error => {
          console.error('Error parsing JSON:', error);
        });
    }

    #parse(data){
        data.forEach(element => {
            let obj = this.#createElement(element.type, element.params);
            if(obj && obj.isObject3D){
                obj.name = element.name;
                this.#placeElement(obj, element.pose);

                this.scene.add(obj);
            }
        });
    }

    #createElement(type, params){
        switch (type) {
            case "floor":
                return this.bf.createFloor(Object.values(params));
            
            case "wall":
                let dim = Object.values(params).slice(0, 3);
                return this.bf.createBasicWall(dim, params.texture);

            case "doorwall":
                let dimWall = Object.values(params).slice(0, 3);
                let dimDoor = Object.values(params).slice(4, 6);
                return this.bf.createDoorWall(dimWall, params.texture, dimDoor);

            default:
                throw new Error("Invalid element "+type+". The types currently supported are: floor, wall, doorwall");
                break;
        }
    }

    #placeElement(obj, pose){
        obj.position.set(...Object.values(pose.translation))
        obj.rotation.set(...Object.values(pose.rotation))
    }
}