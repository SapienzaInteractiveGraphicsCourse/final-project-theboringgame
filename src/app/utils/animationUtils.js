import { TWEEN } from '../lib/tween/build/tween.module.min.js';

export class AnimationUtils {
    static rotationOneAxis(id, value, axis, time, callback = null) {
        switch (axis) {
            case 'x':
                new TWEEN.Tween(id.rotation)
                    .to({
                        x: value
                    }, time)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(callback)
                break;
            case 'y':
                new TWEEN.Tween(this.id.rotation)
                    .to({
                        y: this.value
                    }, time)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(callback)
                break;
            case 'z':
                new TWEEN.Tween(this.id.rotation)
                    .to({
                        z: this.value
                    }, time)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start()
                    .onComplete(callback)
                break;
            default:
                throw new Error("No valid rotation axis. Expected [x/y/z], given [" + axis + "]");
        }
    }

    static rotation(id, _x, _y, _z, time, callback = null) {
        new TWEEN.Tween(id.rotation)
            .to({
                x: _x,
                y: _y,
                z: _z
            }, time)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
            .onComplete(callback)
    }

    static translation(id, _x, _y, _z, time, callback = null) {
        new TWEEN.Tween(id.position)
            .to({
                x: _x,
                y: _y,
                z: _z
            }, time)
            .start()
            .onComplete(callback)
    }
}