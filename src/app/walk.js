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
                this.animFac.doRotation(this.idLU,0,0,-2.96706);
                this.animFac.doRotation(this.idRU,-0.7,0,2.96706);
                //lower legs
                this.animFac.doRotationOneAxis(this.idLL,-0.7,'x');
                this.animFac.doRotationOneAxis(this.idRL,0.0,'x');
                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,-0.26,'x');
                this.animFac.doRotationOneAxis(this.idRS,0.36,'x');
                if(this.idLU.rotation.x>-0.1){
                    this.state++;
                }
                break;
            case 1:
                //upper legs
                this.animFac.doRotationOneAxis(this.idLU,-0.35,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.35,'x');
                
                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,0.05,'x');
                this.animFac.doRotationOneAxis(this.idRS,0.05,'x');
                if(this.idLU.rotation.x>-0.25){
                    this.state++;
                }
                break;
            case 2:
                //upper legs
                this.animFac.doRotationOneAxis(this.idLU,-0.7,'x');
                this.animFac.doRotationOneAxis(this.idRU,0,'x');
                //lower legs
                this.animFac.doRotationOneAxis(this.idLL,0,'x');
                this.animFac.doRotationOneAxis(this.idRL,-0.7,'x');
                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,0.36,'x');
                this.animFac.doRotationOneAxis(this.idRS,-0.26,'x');
                if(this.idLU.rotation.x<-0.6){
                    this.state++;
                }
                break;
            case 3:
                //upper legs
                this.animFac.doRotationOneAxis(this.idLU,-0.35,'x');
                this.animFac.doRotationOneAxis(this.idRU,-0.35,'x');

                //shoulders
                this.animFac.doRotationOneAxis(this.idLS,0.05,'x');
                this.animFac.doRotationOneAxis(this.idRS,0.05,'x');
                if(this.idLU.rotation.x<-0.25){
                    this.state=0;
                }
                break;
        }
    }
}