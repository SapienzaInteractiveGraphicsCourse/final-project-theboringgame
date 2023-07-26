import {TWEEN} from '../lib/tween/build/tween.module.min.js';

export function doAnimation(mesh,px,py,pz){
    new TWEEN.Tween(mesh.position)
        .to({
            x: px,
            y: py,
            z: pz
        },1000)
        .start()
}
