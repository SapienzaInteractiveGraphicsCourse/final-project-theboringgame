import { addAudioListenerToCamera } from "../utils/audio.js"
import { config } from "../static/config.js"
export class KeyHandlerUtil{
    static isEnabled = true;
    static isFirstCall = true;

    static setupKeyHandler(mainChar, camera){
    document.onkeydown = function (event) {
        if(KeyHandlerUtil.isEnabled){

            if(KeyHandlerUtil.isFirstCall && !config.debug){
                const url = window.location.search;
                const urlParams = new URLSearchParams(url);
                const startMusic = urlParams.get("v");
                if(startMusic == "true")
                    addAudioListenerToCamera(camera);
                KeyHandlerUtil.isFirstCall = false;
            }

            document.getElementById("dialog-container").style.display="none"; 
            document.getElementById("dialog-container").innerHTML="";
            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW': mainChar.controls.moveForward = true; break;

                case 'ArrowDown':
                case 'KeyS': mainChar.controls.moveBackward = true; break;

                case 'ArrowLeft':
                case 'KeyA': mainChar.controls.moveLeft = true; break;

                case 'ArrowRight':
                case 'KeyD': mainChar.controls.moveRight = true; break;

                case 'KeyL': mainChar.useLight = !mainChar.useLight; break;

                case 'KeyP': mainChar.action = true; break;

                case 'KeyC': mainChar.change = true; break;

                case 'Enter': mainChar.select = true; break;

            }
        }
    }.bind(mainChar);

    document.onkeyup = function (event) {
        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW': mainChar.controls.moveForward = false; break;

            case 'ArrowDown':
            case 'KeyS': mainChar.controls.moveBackward = false; break;

            case 'ArrowLeft':
            case 'KeyA': mainChar.controls.moveLeft = false; break;

            case 'ArrowRight':
            case 'KeyD': mainChar.controls.moveRight = false; break;

        }
    }.bind(mainChar);
    }
}