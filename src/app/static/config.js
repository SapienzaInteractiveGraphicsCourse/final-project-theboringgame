import { Door, Generator, Platform, Pillar } from "../factories/objects.js"
import { MainRobot } from "../factories/characters.js"


export const config = {
    debug: false,
    game: {
        camera: {
            fov: 60,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 10,
            far: 500
        },
        scene: {
            background: "rgb(6,5,41)"
        }
    }
};

export const modelMapping = new Map([
[Generator, ['../../assets/models/generator/sci-fi_cargo_crate.glb',1]],
[MainRobot, ['../../assets/models/hmo-man/hmo-ng.glb',1]],
[Platform ,['../../assets/models/platform/scifi_platform.glb',1]],
[Door , ['../../assets/models/door/space_door.glb',1]],
[Pillar, ['../../assets/models/pillar/pillar.glb',2]],
]);