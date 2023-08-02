import { AnimationUtils } from '../utils/animationUtils.js';

export class Door{
    constructor(idDoor,idWindow){
        this.idDoor=idDoor;
        this.idWindow=idWindow;
    }

    update(){
        AnimationUtils.rotationOneAxis(this.idDoor,-1,48353,"z",500);
        AnimationUtils.rotationOneAxis(this.idWindow,1,48353,"z",500);
        AnimationUtils.translation(this.idWindow,-10,-20,28.667);
    }
}

export class DoorOpen extends Door{
    constructor(door){
        super(door.getObjectByName("A1003"),door.getObjectByName("windows"));
    }
}