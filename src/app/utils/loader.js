import { GLTFLoader } from "../lib/three/loaders/GLTFLoader.js";
import { modelMapping } from "../static/config.js"

export class ModelsLoader {

    constructor(loadingManager) {
        this.models = new Map();
        this.loader = new GLTFLoader(loadingManager);
    }

    async loadModels() {
        let prom = new Array();

        let pathArray = Array.from(modelMapping.values());
        let keyArray = Array.from(modelMapping.keys());

        for (let index = 0; index < pathArray.length; index++) {
            const element = pathArray[index];
            prom.push(this.loader.loadAsync(element))
        }

        let models = await Promise.all(prom);

        for (let index = 0; index < pathArray.length; index++)
            this.models.set(keyArray[index], models[index].scene);

    }

    get(classIdx){
        const model = this.models.get(classIdx.constructor);
        this.models.delete(classIdx.constructor);
        return model;
    }
}