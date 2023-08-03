import { AnimationUtils } from '../utils/animationUtils.js';

export class Door{
    constructor(DoorLeft,DoorRight){
        this.DoorLeft=DoorLeft;
        this.DoorRight=DoorRight;
    }

    update(){
        AnimationUtils.translation(this.DoorLeft,-3.8,1,0,500);
        AnimationUtils.translation(this.DoorRight,8.2,4.843,0,500);
    }
}

export class DoorOpen extends Door{
    constructor(door){
        super(door.getObjectByName("DoorLeft"),door.getObjectByName("DoorRight"));
    }
}