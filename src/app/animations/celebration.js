import { AnimationUtils } from '../utils/animationUtils.js';

export class Celebration{
    constructor(idLS, idRS, idLUA, idRUA, idLLA, idRLA){
        this.idLS = idLS;
        this.idRS = idRS;
        this.idLUA = idLUA;
        this.idRUA = idRUA;
        this.idLLA = idLLA;
        this.idRLA = idRLA;
        this.state = 0;
        this.executionSpeed = 500;
    }

    update(){
        switch (this.state) {
            case 0:
                //shoulders
                AnimationUtils.rotation(this.idLS, -1.064, -0.067, -1.76, this.executionSpeed);
                AnimationUtils.rotation(this.idRS, -0.52, -0.1, 1.745, this.executionSpeed);
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, 0.37, -2.036, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.187, 0.526, this.executionSpeed);
                //lower arms
                AnimationUtils.rotation(this.idLUA, 0, 0, 0, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0, 0, 0, this.executionSpeed);
                break; 
                /*if (this.idLU.rotation.x > -0.1) {
                    this.state++;
                }
                break;
            case 1:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, -0.226, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, 0.226, 'x', this.executionSpeed);

                if (this.idLU.rotation.x > -0.25) {
                    this.state++;
                }
                break;
            case 2:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.7, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, 0, 'x', this.executionSpeed);
                //lower legs
                AnimationUtils.rotationOneAxis(this.idLL, 0, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRL, -0.6, 'x', this.executionSpeed);
                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.084, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.084, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.6) {
                    this.state++;
                }
                break;
            case 3:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, -0.226, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, 0.226, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.25) {
                    this.state = 0;
                }
                break;*/
        }
    }

}

export class MainCharacterCelebration extends Celebration {
    constructor(character) {
        super(character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("LeftUpperArm_014"),
            character.getObjectByName("RightUpperArm_033"),
            character.getObjectByName("LeftLowerArm_015"),
            character.getObjectByName("RightLowerArm_034"),);
    }
}