export const config = {
    game: {
        camera: {
            fov: 60,
            aspect: document.querySelector('#scene-container').clientWidth / document.querySelector('#scene-container').clientHeight,
            near: 10,
            far: 10000
        },
        scene: {
            background: "rgb(6,5,41)"
        }
    }
};
