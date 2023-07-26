import {AnimationFactory} from '../factories/animations.js';


export class walk{
    constructor(idLU,idRU,idLL,idRL,idLS,idRS){
        this.animFac= new AnimationFactory();
        this.state=0;
        this.idLU=idLU;
        this.idLL=idLL;
        this.idRU=idRU;
        this.idRL=idRL;
        this.idLS=idLS;
        this.idRS=idRS;

    }

    doWalk(){
        switch(this.state){
            case 0:
                //upper legs
                this.animFac.doRotationOneAxis(this.idLU,-0.45,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.85,'x');
                //lower legs
                this.animFac.doRotationOneAxis(this.idLL,-0.85,'x');
                this.animFac.doRotationOneAxis(this.idRL,-0.6,'x');
                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,-0.26,'x');
                this.animFac.doRotationOneAxis(this.idRS,0.35,'x');
                if(this.idLU.rotation.x>-0.5){
                    this.state++;
                }
                break;
            case 1:
                //upper legs
                this.animFac.doRotationOneAxis(this.idLU,-0.85,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.45,'x');
                //lower legs
                this.animFac.doRotationOneAxis(this.idLL,-0.6,'x');
                this.animFac.doRotationOneAxis(this.idRL,-0.85,'x');
                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,0.35,'x');
                this.animFac.doRotationOneAxis(this.idRS,-0.26,'x');
                if(this.idLU.rotation.x<-0.8){
                    this.state=0;
                }
                break;
        }
    }
}