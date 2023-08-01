
export function setupKeyHandler(mainChar){
    document.onkeydown = function (event) {
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