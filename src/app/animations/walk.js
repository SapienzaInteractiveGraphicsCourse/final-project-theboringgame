import {AnimationUtils} from '../utils/animationUtils.js';


export class Walk{
    constructor(idLU,idRU,idLL,idRL,idLS,idRS){
        this.state=0;
        this.idLU=idLU;
        this.idLL=idLL;
        this.idRU=idRU;
        this.idRL=idRL;
        this.idLS=idLS;
        this.idRS=idRS;

    }

    update(isHoldingLight,isMoving){
        if(isMoving){
            switch(this.state){
                case 0:
                    //upper legs
                    AnimationUtils.rotation(this.idLU,0,0,-2.96706,800);
                    AnimationUtils.rotation(this.idRU,-0.7,0,2.96706,800);
                    //lower legs
                    AnimationUtils.rotationOneAxis(this.idLL,-0.7,'x',800);
                    AnimationUtils.rotationOneAxis(this.idRL,0.0,'x',800);
                    //shoulders
                    AnimationUtils.rotationOneAxis(this.idLS,-0.26,'x',800);
                    if(isHoldingLight){
                        AnimationUtils.rotationOneAxis(this.idRS,-0.2,'x',800);
                    }else{
                        AnimationUtils.rotationOneAxis(this.idRS,0.36,'x',800);
                    }

                    if(this.idLU.rotation.x>-0.1){
                        this.state++;
                    }
                    break;
                case 1:
                    //upper legs
                    AnimationUtils.rotationOneAxis(this.idLU,-0.35,'x',800);
                    AnimationUtils.rotationOneAxis(this.idRU,-0.35,'x',800);
                    
                    //shoulders
                    AnimationUtils.rotationOneAxis(this.idLS,0.05,'x',800);
                    if(isHoldingLight){
                        AnimationUtils.rotationOneAxis(this.idRS,-0.1,'x',800);
                    }else{
                        AnimationUtils.rotationOneAxis(this.idRS,0.05,'x',800);
                    }

                    if(this.idLU.rotation.x>-0.25){
                        this.state++;
                    }
                    break;
                case 2:
                    //upper legs
                    AnimationUtils.rotationOneAxis(this.idLU,-0.7,'x',800);
                    AnimationUtils.rotationOneAxis(this.idRU,0,'x',800);
                    //lower legs
                    AnimationUtils.rotationOneAxis(this.idLL,0,'x',800);
                    AnimationUtils.rotationOneAxis(this.idRL,-0.7,'x',800);
                    //shoulders
                    AnimationUtils.rotationOneAxis(this.idLS,0.36,'x',800);
                    if(isHoldingLight){
                        AnimationUtils.rotationOneAxis(this.idRS,-0.0,'x',800);
                    }else{
                        AnimationUtils.rotationOneAxis(this.idRS,-0.26,'x',800);
                    }

                    if(this.idLU.rotation.x<-0.6){
                        this.state++;
                    }
                    break;
                case 3:
                    //upper legs
                    AnimationUtils.rotationOneAxis(this.idLU,-0.35,'x',800);
                    AnimationUtils.rotationOneAxis(this.idRU,-0.35,'x',800);

                    //shoulders
                    AnimationUtils.rotationOneAxis(this.idLS,0.05,'x',800);
                    if(isHoldingLight){
                        AnimationUtils.rotationOneAxis(this.idRS,-0.1,'x',800);
                    }else{
                        AnimationUtils.rotationOneAxis(this.idRS,0.05,'x',800);
                    }
                    if(this.idLU.rotation.x<-0.25){
                        this.state=0;
                    }
                    break;
            }
        }
    }
}

export class MainCharacterWalk extends Walk{
    constructor(character){
        super(character.getObjectByName("LeftUpperLeg_050"),
                character.getObjectByName("RightUpperLeg_053"),
                    character.getObjectByName("LeftLowerLeg_051"),
                        character.getObjectByName("RightLowerLeg_054"),
                            character.getObjectByName("LeftShoulder_013"),
                                character.getObjectByName("RightShoulder_032"));
    }
}