// Sourcing from https://stackblitz.com/edit/phaser3-typescript
// to verify status of https://github.com/phaserjs/phaser/issues/4529

class TestScene extends Phaser.Scene {
    constructor(fps) {
        super(`testScene${fps}`);

        this.fps = fps;

        this.tracers = [];

        this.circlesCreated = 0.0;
    }

    create() {
        this.textObj = this.add.text(50, 0, `FPS: ${this.fps}`);

        this.physics.world.enable(this.textObj);

        this.textObj.body.setCollideWorldBounds(true, 1, 1);
    }

    update(_, deltaMillis) {
        if (this.tracers.length > 100) {
            const left = this.tracers.shift();
            left.destroy();
        }

        const deltaSeconds = deltaMillis * 0.001;

        this.tracers.forEach((o) => {
            o.x += 280 * deltaSeconds;
        });

        const newCircle = this.add.circle(this.textObj.x + this.textObj.width + 10, this.textObj.y + this.textObj.height * 0.5, 10, HSVtoRGB(this.circlesCreated / 8.5));
        this.children.sendToBack(newCircle);

        this.tracers.push(newCircle);
        this.circlesCreated++;
    }
}

// Yoinked and simplified from https://stackoverflow.com/a/17243070
function HSVtoRGB(h) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const q = 1 - f;

    var red, green, blue;
    switch (i % 6) {
        case 0: red = 1, green = f, blue = 0; break;
        case 1: red = q, green = 1, blue = 0; break;
        case 2: red = 0, green = 1, blue = f; break;
        case 3: red = 0, green = q, blue = 1; break;
        case 4: red = f, green = 0, blue = 1; break;
        case 5: red = 1, green = 0, blue = q; break;
    }

    return (Math.round(red * 255) << 16) | (Math.round(green * 255) << 8) | (Math.round(blue * 255));
}

[30, 60, 90, 120].map((fps) => {
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
        scene: [ new TestScene(fps) ]
    });
});
