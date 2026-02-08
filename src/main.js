// Sourcing from https://stackblitz.com/edit/phaser3-typescript
// to verify status of https://github.com/phaserjs/phaser/issues/4529
//
// Matter JS alteration of Arcade-based test outlined above

class TestScene extends Phaser.Scene {
    constructor(fps) {
        super(`testScene${fps}`);

        this.fps = fps;

        this.tracers = [];

        this.circlesCreated = 0.0;
    }

    create() {
        this.bouncingText = this.add.text(85, 0, `Physics UPS: ${this.fps}`);
        this.bouncingTextObj = this.matter.add.gameObject(this.bouncingText, {
            inertia: Infinity
        });
        this.bouncingTextObj.setFrictionAir(0.0).setBounce(1.025);
        // this.matter.world.enable(this.bouncingText);
        // this.bouncingText.body.setCollideWorldBounds(true, 1, 1);
        this.matter.world.setBounds(0, 0, 640, 480);

        this.fpsCounter = this.add.text(0, 5);
    }

    update(_, deltaMillis) {
        if (this.tracers.length > 80) {
            const left = this.tracers.shift();
            left.destroy();
        }

        const deltaSeconds = deltaMillis * 0.001;

        this.tracers.forEach((o) => {
            o.x += 280 * deltaSeconds;
        });

        const newCircle = this.add.circle(this.bouncingText.x + this.bouncingText.width + 10, this.bouncingText.y + this.bouncingText.height * 0.5, 10, HSVtoRGB(this.circlesCreated / 8.5));
        this.children.sendToBack(newCircle);

        this.tracers.push(newCircle);
        this.circlesCreated++;

        this.fpsCounter.text = `game.loop.actualFps = ${this.game.loop.actualFps}`;
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
        fps: {
            target: fps // Seems to have no effect, renderer still targets 60
        },
        physics: {
            default: 'matter',
            matter: {
                fps: fps,
                gravity: {
                    x: 0,
                    y: 5
                }
            }
        },
        scene: [ new TestScene(fps) ]
    });
});
