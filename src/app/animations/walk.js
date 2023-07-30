import { AnimationUtils } from '../utils/animationUtils.js';


export class Walk {
    constructor(idLU, idRU, idLL, idRL, idLS, idRS, idRLA) {
        this.state = 0;
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
        this.idRLA = idRLA;
        this.executionSpeed = 500;
    }


    update() {
        switch (this.state) {
            case 0:
                //upper legs
                AnimationUtils.rotation(this.idLU, 0, 0, -2.96706, this.executionSpeed);
                AnimationUtils.rotation(this.idRU, -0.7, 0, 2.96706, this.executionSpeed);
                //lower legs
                AnimationUtils.rotationOneAxis(this.idLL, -0.7, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRL, 0.0, 'x', this.executionSpeed);
                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, -0.26, 'x', this.executionSpeed);
                AnimationUtils.rotation(this.idRLA, 0.5391, -0.1309, -0.157);
                AnimationUtils.rotationOneAxis(this.idRS, 0.36, 'x', this.executionSpeed);

                if (this.idLU.rotation.x > -0.1) {
                    this.state++;
                }
                break;
            case 1:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.05, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, 0.05, 'x', this.executionSpeed);

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
                AnimationUtils.rotationOneAxis(this.idRL, -0.7, 'x', this.executionSpeed);
                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.36, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.26, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.6) {
                    this.state++;
                }
                break;
            case 3:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.05, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, 0.05, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.25) {
                    this.state = 0;
                }
                break;
        }

    }
}

export class MainCharacterWalk extends Walk {
    constructor(character) {
        super(character.getObjectByName("LeftUpperLeg_050"),
            character.getObjectByName("RightUpperLeg_053"),
            character.getObjectByName("LeftLowerLeg_051"),
            character.getObjectByName("RightLowerLeg_054"),
            character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("RightLowerArm_034"));
    }
}

export class WalkWithLight{
    constructor(idLU, idRU, idLL, idRL, idLS, idRS, idRLA) {
        this.state = 0;
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
        this.idRLA = idRLA;
        this.executionSpeed = 500;
    }

    update() {
        switch (this.state) {
            case 0:
                //upper legs
                AnimationUtils.rotation(this.idLU, 0, 0, -2.96706, this.executionSpeed);
                AnimationUtils.rotation(this.idRU, -0.7, 0, 2.96706, this.executionSpeed);
                //lower legs
                AnimationUtils.rotationOneAxis(this.idLL, -0.7, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRL, 0.0, 'x', this.executionSpeed);
                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, -0.26, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.2, 'x', this.executionSpeed);

                if (this.idLU.rotation.x > -0.1) {
                    this.state++;
                }
                break;
            case 1:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.05, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.1, 'x', this.executionSpeed);

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
                AnimationUtils.rotationOneAxis(this.idRL, -0.7, 'x', this.executionSpeed);
                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.36, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.0, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.6) {
                    this.state++;
                }
                break;
            case 3:
                //upper legs
                AnimationUtils.rotationOneAxis(this.idLU, -0.35, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRU, -0.35, 'x', this.executionSpeed);

                //shoulders
                AnimationUtils.rotationOneAxis(this.idLS, 0.05, 'x', this.executionSpeed);
                AnimationUtils.rotationOneAxis(this.idRS, -0.1, 'x', this.executionSpeed);

                if (this.idLU.rotation.x < -0.25) {
                    this.state = 0;
                }
                break;
        }

    }
}

export class MainCharacterWalkWithLight extends WalkWithLight {
    constructor(character) {
        super(character.getObjectByName("LeftUpperLeg_050"),
            character.getObjectByName("RightUpperLeg_053"),
            character.getObjectByName("LeftLowerLeg_051"),
            character.getObjectByName("RightLowerLeg_054"),
            character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("RightLowerArm_034"));
    }
}