// Sourcing from https://stackblitz.com/edit/phaser3-typescript
// to verify status of https://github.com/phaserjs/phaser/issues/4529

[30, 60].map((fps) => {
    new Phaser.Game({
        type: Phaser.WEBGL,
        width: 640,
        height: 480,
            physics: {
            default: 'arcade',
            arcade: {
                fps: fps,
                gravity: {
                    x: 0,
                    y: 500
                }
            }
        },
        scene: [ new Test(fps) ]
    });
});
