import { AnimationUtils } from '../utils/animationUtils.js';

export class Door{
    constructor(idDoor,idWindow){
        this.idDoor=idDoor;
        this.idWindow=idWindow;
    }

    update(){
        AnimationUtils.translation(this.idWindow,-10,20,28.667,500);
        AnimationUtils.rotation(this.idDoor,0,0,1.48353,500);
        AnimationUtils.rotation(this.idWindow,0,0,1.48353,'z',500);
    }
}

export class DoorOpen extends Door{
    constructor(door){
        super(door.getObjectByName("A1003"),door.getObjectByName("windows"));
    }
}