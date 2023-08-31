import { Door, Generator, Platform, Pillar, Button, Desk, Book, Trophy, Redcarpet, Rope } from "../factories/objects.js"
import { MainRobot } from "../factories/characters.js"


export const config = {
    debug: false,
    game: {
        camera: {
            fov: 60,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 10,
            far: 1000
        },
        scene: {
            background: "rgb(6,5,41)"
        }
    }
};

export const modelMapping = new Map([
[Generator, ['assets/models/generator/sci-fi_cargo_crate.glb',1,[1]]],
[MainRobot, ['assets/models/hmo-man/hmo-ng.glb',1,[1,2]]],
[Platform ,['assets/models/platform/scifi_platform.glb',1,[1]]],
[Door , ['assets/models/door/space_door.glb',1,[1]]],
[Pillar, ['assets/models/pillar/pillar.glb',6,[2]]],
[Button, ['assets/models/button/scifi_button.glb',3,[2]]],
[Desk, ['assets/models/desk/scifi_desk.glb',1,[2]]],
[Book, ['assets/models/book/book_open.glb',1,[2]]],
[Trophy, ['assets/models/trophy/world_cup_trophy.glb',1,[2]]],
[Redcarpet, ['assets/models/redcarpet/red_carpet.glb',1,[2]]],
[Rope, ['assets/models/rope/red_velvet_rope.glb',16,[2]]]
]);