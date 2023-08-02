import { Vector3 } from '../lib/three/build/three.module.js';
import { AnimationUtils } from '../utils/animationUtils.js';


export class Stand {
    constructor(idLU, idRU, idLL, idRL, idLS, idRS, idLLA, idRLA, idLF, idRF) {
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
        this.idLLA = idLLA;
        this.idRLA = idRLA;
        this.idLF = idLF;
        this.idRF = idRF;
    }
    update() {
        AnimationUtils.rotation(this.idLU, -0.35, 0, -2.97);
        AnimationUtils.rotation(this.idRU, -0.35, 0, 2.97);
        AnimationUtils.rotation(this.idLL, -0.35, 0, 0);
        AnimationUtils.rotation(this.idRL, -0.35, 0, 0);
        AnimationUtils.rotation(this.idLS, -0.226, 0.087, -2.00);
        AnimationUtils.rotation(this.idRS, 0.226, 0.087, 2.00);
        AnimationUtils.rotation(this.idLLA, 0.6269, -0.1309, -0.157);
        AnimationUtils.rotation(this.idRLA, 0.5391, -0.1309, 0.157);
        AnimationUtils.rotation(this.idLF, 1.5708, -0.07, -0.033);
        AnimationUtils.rotation(this.idRF, 1.5708, -0.07, -0.033);
    }
}

export class MainCharacterStand extends Stand {
    constructor(character) {
        super(character.getObjectByName("LeftUpperLeg_050"),
            character.getObjectByName("RightUpperLeg_053"),
            character.getObjectByName("LeftLowerLeg_051"),
            character.getObjectByName("RightLowerLeg_054"),
            character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("LeftLowerArm_015"),
            character.getObjectByName("RightLowerArm_034"),
            character.getObjectByName("LeftFoot_052"),
            character.getObjectByName("RightFoot_055"));
    }
}

export class StandWithLight{
    constructor(idLU, idRU, idLL, idRL, idLS, idRS, idLLA, idRLA, idLF, idRF, idRH, light, character) {
        this.idLU = idLU;
        this.idLL = idLL;
        this.idRU = idRU;
        this.idRL = idRL;
        this.idLS = idLS;
        this.idRS = idRS;
        this.idLLA = idLLA;
        this.idRLA = idRLA;
        this.idLF = idLF;
        this.idRF = idRF;
        this.idRH = idRH;
        this.light = light;
        this.isOn = false;
        this.character = character;
        this.executionSpeed = 500;
    }
    update() {
        let lightPos = new Vector3(this.idRH.position.x-0.65,this.idRH.position.y,this.idRH.position.z+1).applyMatrix4(this.character.matrixWorld);
        
        this.light.position.set(...Object.values(lightPos));
        let point = new Vector3(this.idRH.position.x, 0.0, 50.0).applyMatrix4(this.character.matrixWorld);

        this.light.target.position.x = point.x;
        this.light.target.position.y = this.character.position.y + this.idRH.position.y;
        this.light.target.position.z = point.z;

        AnimationUtils.rotation(this.idLU, -0.35, 0, -2.97, this.executionSpeed);
        AnimationUtils.rotation(this.idRU, -0.35, 0, 2.97, this.executionSpeed);
        AnimationUtils.rotation(this.idLL, -0.35, 0, 0, this.executionSpeed);
        AnimationUtils.rotation(this.idRL, -0.35, 0, 0, this.executionSpeed);
        AnimationUtils.rotation(this.idLS, -0.226, 0.087, -2.00, this.executionSpeed);
        AnimationUtils.rotation(this.idLLA, 0.6269, -0.1309, -0.157, this.executionSpeed);
        AnimationUtils.rotation(this.idLF, 1.5708, -0.07, -0.033, this.executionSpeed);
        AnimationUtils.rotation(this.idRF, 1.5708, -0.07, -0.033, this.executionSpeed);

        AnimationUtils.rotationOneAxis(this.idRLA, 1.26, 'x', this.executionSpeed, function(){if(!this.isOn){this.light.intensity = 5; this.isOn = true}}.bind(this));
    }
}

export class MainCharacterStandWithLight extends StandWithLight {
    constructor(character, light) {
        super(character.getObjectByName("LeftUpperLeg_050"),
            character.getObjectByName("RightUpperLeg_053"),
            character.getObjectByName("LeftLowerLeg_051"),
            character.getObjectByName("RightLowerLeg_054"),
            character.getObjectByName("LeftShoulder_013"),
            character.getObjectByName("RightShoulder_032"),
            character.getObjectByName("LeftLowerArm_015"),
            character.getObjectByName("RightLowerArm_034"),
            character.getObjectByName("LeftFoot_052"),
            character.getObjectByName("RightFoot_055"),
            character.getObjectByName("RightHand_035"),
            light,
            character);
    }
}