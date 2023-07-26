import {TWEEN} from '../lib/tween/build/tween.module.min.js';

export class AnimationFactory{
    constructor(){
        this.instances = new Array()
    }

    doRotationOneAxis(id,value,axis){
        let instance = new rotationOneAxis(id,value,axis);
        this.instances.push(instance);
        instance.doAnimation();
    }

    doRotation(id,x,y,z){
        let instance = new rotation(id,x,y,z);
        this.instances.push(instance);
        instance.doAnimation();
    }

    doTranslation(id,x,y,z){
        let instance = new translation(id,x,y,z);
        this.instances.push(instance);
        instance.doAnimation();
    }
}

class AbstractAnimation{
    constructor(id){
        if (this.constructor == AbstractAnimation) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.id=id;
    }

    doAnimation(){
        throw new Error("Method 'doAnimation()' must be implemented.");
    }
}

class rotationOneAxis extends AbstractAnimation{
    constructor(id,value,axis){
        super(id);

        this.value=value;
        this.axis=axis;
    }

    doAnimation(){
        switch(this.axis){
            case 'x':
                new TWEEN.Tween(this.id.rotation)
                .to({
                    x : this.value
                },750)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                break;
            case 'y':
                new TWEEN.Tween(this.id.rotation)
                .to({
                    y : this.value
                },750)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                break;
            case 'z':
                new TWEEN.Tween(this.id.rotation)
                .to({
                    z : this.value
                },750)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                break;
            default:
                throw new Error("No x,y or z inserted in doRotation");
                
    
        }
    }
}

class rotation extends AbstractAnimation{
    constructor(id,x,y,z){
        super(id);

        this.x=x;
        this.y=y;
        this.z=z;
    }

    doAnimation(){
        new TWEEN.Tween(this.id.rotation)
        .to({
            x: this.x,
            y: this.y,
            z: this.z
        },1000)
        .start()
    }
}

class translation extends AbstractAnimation{
    constructor(id,x,y,z){
        super(id);

        this.x=x;
        this.y=y;
        this.z=z;
    }

    doAnimation(){
        new TWEEN.Tween(this.id.position)
        .to({
            x: this.x,
            y: this.y,
            z: this.z
        },1000)
        .start()
    }
}
