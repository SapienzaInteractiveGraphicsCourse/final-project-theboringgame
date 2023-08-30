import { GLTFLoader } from "../lib/three/loaders/GLTFLoader.js";
import { modelMapping } from "../static/config.js"

export class ModelsLoader {

    constructor(loadingManager, renderer, camera) {
        this.models = new Map();
        this.loader = new GLTFLoader(loadingManager);
        this.renderer = renderer;
        this.camera = camera;
    }

    async loadModels() {
        this.models.clear();
        let prom = new Array();

        let valueArray = Array.from(modelMapping.values());
        let keyArray = Array.from(modelMapping.keys());

        for (let index = 0; index < valueArray.length; index++) {
            const element = valueArray[index];
            const path = element[0];
            const rep = element[1];
            for (let j = 0; j < rep; j++) {
                prom.push(this.loader.loadAsync(path))
            }
        }

        let models = await Promise.all(prom);

        let sum = 0;

        for (let index = 0; index < valueArray.length; index++) {
            const element = valueArray[index];
            const rep = element[1];
            let entry = new Array(rep);

            for (let j = 0; j < rep; j++) {
                entry[j] = models[sum + j].scene;
                this.renderer.compile(entry[j], this.camera)
            }
            sum += rep;

            this.models.set(keyArray[index], entry);
        }

    }

    get(classIdx) {
        const modelList = this.models.get(classIdx.constructor);
        if (modelList.length == 0)
            throw new Error("Detected an access to an empty model list.")

        const model = modelList.pop()
        this.models.set(classIdx.constructor, modelList)
        return model;
    }
}