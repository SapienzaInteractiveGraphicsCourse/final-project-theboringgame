import {AnimationUtils} from '../utils/animationUtils.js';

class holdLight{
    constructor(character,idRS,idRLA,idRH,light){
        this.character=character;
        this.idRS=idRS;
        this.idRLA=idRLA;
        this.idRH=idRH;
        this.light= light;
    }

    startHoldLight(){
        AnimationUtils.rotation(this.idRS,-0.233,-0.046,2.00);
        AnimationUtils.rotationOneAxis(this.idRLA,1.26,'x');
        this.light.position.set(this.character.position.x+this.idRH.position.x,this.character.position.y+this.idRH.position.y,this.character.position.z+this.idRH.position.z+10);
        this.light.intensity=5;
        this.light.target.position.x=this.character.position.x+this.idRH.position.x;
        this.light.target.position.y=this.character.position.y+this.idRH.position.y;
        console.log(this.light.target.position);
        //this.light.target.position.z=this.character.position.z;
    }
}

export class MainCharacterHoldLight extends holdLight{
    constructor(character,light){
        super(character,
                character.getObjectByName("RightShoulder_032"),
                    character.getObjectByName("RightLowerArm_034"),
                        character.getObjectByName("RightHand_035"), 
                            light)
    }
}