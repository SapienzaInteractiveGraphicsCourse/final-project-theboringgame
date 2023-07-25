export const config = {
    game:{
        camera:{
            fov: 60,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 0.1,
            far: 300
        },
        scene:{
            background: "skyblue"
        }
    }
};
