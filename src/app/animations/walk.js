import { AnimationUtils } from '../utils/animationUtils.js';
import { Vector3 } from '../lib/three/build/three.module.js';

export class Walk {
    constructor(idLU, idRU, idLL, idRL, idLS, idRS) {
        this.state = 0;
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
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
            character.getObjectByName("RightShoulder_032"));
    }
}

export class WalkWithLight{
    constructor(idLU, idRU, idLL, idRL, idLS, idRS, idRLA, idRH, light, character) {
        this.state = 0;
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
        this.idRLA = idRLA;
        this.idRH = idRH;
        this.light = light;
        this.isOn = false;
        this.character = character;
        this.executionSpeed = 500;
    }

    update() {
        let lightPos = new Vector3(this.idRH.position.x-0.65,this.idRH.position.y,this.idRH.position.z+0.8).applyMatrix4(this.character.matrixWorld);
        
        this.light.position.set(...Object.values(lightPos));
        let point = new Vector3(this.idRH.position.x, 0.0, 50.0).applyMatrix4(this.character.matrixWorld);

        this.light.target.position.x = point.x;
        this.light.target.position.y = this.character.position.y + this.idRH.position.y;
        this.light.target.position.z = point.z;
        
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
                AnimationUtils.rotation(this.idRS, -0.233, -0.046, 2.00, this.executionSpeed);

                AnimationUtils.rotationOneAxis(this.idRLA, 1.26, 'x', this.executionSpeed, function(){if(!this.isOn){this.light.intensity = 5; this.isOn = true}}.bind(this));

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
    constructor(character, light) {
        super(character.getObjectByName("LeftUpperLeg_050"),
            character.getObjectByName("RightUpperLeg_053"),
            character.getObjectByName("LeftLowerLeg_051"),
            character.getObjectByName("RightLowerLeg_054"),
            character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("RightLowerArm_034"),
            character.getObjectByName("RightHand_035"),
            light,
            character);
    }
}