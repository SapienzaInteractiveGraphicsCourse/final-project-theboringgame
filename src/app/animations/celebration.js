import { AnimationUtils } from '../utils/animationUtils.js';

export class Celebration {
    constructor(idLS, idRS, idLUA, idRUA, idLLA, idRLA, idSpine) {
        this.idLS = idLS;
        this.idRS = idRS;
        this.idLUA = idLUA;
        this.idRUA = idRUA;
        this.idLLA = idLLA;
        this.idRLA = idRLA;
        this.idSpine = idSpine;
        this.state = 0;
        this.executionSpeed = 400;
    }

    update() {
        switch (this.state) {
            case 0:
                //shoulders
                AnimationUtils.rotation(this.idLS, -0.564, -0.067, -1.76, this.executionSpeed, () => { this.state = 1; });
                AnimationUtils.rotation(this.idRS, -0.52, -0.1, 1.745, this.executionSpeed);
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -2.036, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.187, 0.526, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, -0.104, this.executionSpeed);
                //lower arms
                AnimationUtils.rotation(this.idLLA, 0, 0, 0, this.executionSpeed);
                AnimationUtils.rotation(this.idRLA, 0, 0, 0, this.executionSpeed);

                break;
            case 1:
                //shoulders
                AnimationUtils.rotation(this.idLS, -0.264, -0.067, -1.76, this.executionSpeed, () => { this.state = 2 });
                AnimationUtils.rotation(this.idRS, 0.71, -0.1, 1.745, this.executionSpeed);
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -0.826, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.187, 1.745, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, 0.1745, this.executionSpeed);
                break;
            case 2:
                //shoulders
                AnimationUtils.rotation(this.idLS, -0.564, -0.067, -1.76, this.executionSpeed, () => { this.state = 3 });
                AnimationUtils.rotation(this.idRS, -0.52, -0.1, 1.745, this.executionSpeed);
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -2.036, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.187, 0.526, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, -0.104, this.executionSpeed);

                break;
            case 3:
                //shoulders
                AnimationUtils.rotation(this.idLS, -0.364, -0.067, -1.76, this.executionSpeed);
                AnimationUtils.rotation(this.idRS, -1.05, -0.1, 1.745, this.executionSpeed, () => { this.state = 4 });
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -0.526, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.09, 2.136, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, 0.1745, this.executionSpeed);

                break;
            case 4:
                //shoulders
                AnimationUtils.rotation(this.idLS, 0.832, -0.067, -1.76, this.executionSpeed);
                AnimationUtils.rotation(this.idRS, -0.52, -0.1, 1.745, this.executionSpeed, () => { this.state = 5 });
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -1.726, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.187, 1.036, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, -0.104, this.executionSpeed);

                break;
            case 5:
                //shoulders
                AnimationUtils.rotation(this.idLS, -0.564, -0.067, -1.76, this.executionSpeed);
                AnimationUtils.rotation(this.idRS, -1.05, -0.1, 1.745, this.executionSpeed, () => { this.state = 0 });
                //upper arms
                AnimationUtils.rotation(this.idLUA, -0.175, -0.37, -0.526, this.executionSpeed);
                AnimationUtils.rotation(this.idRUA, 0.123, 0.09, 2.036, this.executionSpeed);
                //spine
                AnimationUtils.rotation(this.idSpine, -0.006, 0.0143, 0.1745, this.executionSpeed);

                break;
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
            character.getObjectByName("RightLowerArm_034"),
            character.getObjectByName("Spine_04"));
    }
}