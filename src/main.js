import {Game} from "./app/game.js";
import {config} from "./app/static/config.js";

main();

function main(){
    let game = new Game();
    game.render();
}