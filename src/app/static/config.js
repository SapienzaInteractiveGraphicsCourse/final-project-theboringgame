export const config = {
    game:{
        camera:{
            fov: 35,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 0.1,
            far: 100
        },
        scene:{
            background: "skyblue"
        }
    }
};
