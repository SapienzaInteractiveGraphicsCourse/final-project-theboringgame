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
                this.animFac.doRotationOneAxis(this.idLU,-0.45,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.85,'x');
                this.animFac.doRotationOneAxis(this.idLL,-0.783,'x');
                this.animFac.doRotationOneAxis(this.idRL,-0.826,'x');
                this.animFac.doRotationOneAxis(this.idLS,-0.26,'x');
                this.animFac.doRotationOneAxis(this.idRS,0.35,'x');
                if(this.idLU.rotation.x>-0.5 && this.idRU.rotation.x<-0.7){
                    this.state++;
                }
                break;
            case 1:
                this.animFac.doRotationOneAxis(this.idLU,-0.85,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.45,'x');
                this.animFac.doRotationOneAxis(this.idLL,-0.826,'x');
                this.animFac.doRotationOneAxis(this.idRL,-0.783,'x');
                this.animFac.doRotationOneAxis(this.idRS,-0.26,'x');
                this.animFac.doRotationOneAxis(this.idLS,0.35,'x');
                if(this.idLU.rotation.x<-0.7 && this.idRU.rotation.x>-0.5){
                    this.state=0;
                }
                break;
        }
    }
}