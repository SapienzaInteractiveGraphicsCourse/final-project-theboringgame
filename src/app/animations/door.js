import { TWEEN } from '../lib/tween/build/tween.module.min.js';

export class Door{
    constructor(DoorLeft,DoorRight){
        this.DoorLeft=DoorLeft;
        this.DoorRight=DoorRight;
        this.doing = true;
    }

    update(){
        
        new TWEEN.Tween(this.DoorLeft.position)
            .to({
                x: 0,
                y: 0,
                z: 100
            }, 1000)
            .delay(2000)
            .start()
            .onComplete(() => {this.doing=false;})
            
        new TWEEN.Tween(this.DoorRight.position)
            .to({
                x: 0,
                y: 0,
                z: -100
            }, 1000)
            .delay(2000)
            .start()
            .onComplete(() => {this.doing=false;})
        
        //AnimationUtils.translation(this.DoorLeft,0,0,100,2000,this.doing=false);
        //AnimationUtils.translation(this.DoorRight,0,0,-100,2000,this.doing=false);
        return this.doing;
    }
}

export class DoorOpen extends Door{
    constructor(door){
        super(door.getObjectByName("pCube5"),door.getObjectByName("pCube6"));
    }
}