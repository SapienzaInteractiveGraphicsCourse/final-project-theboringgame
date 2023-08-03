import * as THREE from "../lib/three/build/three.module.js";

const audioLoader = new THREE.AudioLoader();

export const addAudioListenerToCamera = (camera) => {
  camera.add(createAudioListener());
};

export const createAudioListener = () => {
  const listener = new THREE.AudioListener();

  const sound = new THREE.Audio(listener);

  audioLoader.load("../../assets/sounds/infiltration.ogg", (buffer) => {
    console.log("loaded");
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });

  return listener;
};
