import { Generator, Platform } from "../factories/objects.js"
import { MainRobot } from "../factories/characters.js"


export const config = {
    game: {
        camera: {
            fov: 60,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 10,
            far: 10000
        },
        scene: {
            background: "rgb(6,5,41)"
        }
    }
};

export const modelMapping = new Map([
[Generator, '../../assets/models/generator/sci-fi_cargo_crate.glb'],
[MainRobot, '../../assets/models/hmo-man/hmo-ng.glb'],
[Platform ,'../../assets/models/platform/scifi_platform_end.glb']
]);