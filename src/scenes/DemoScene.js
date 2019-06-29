
import Phaser from 'phaser';

export class DemoScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'DemoScene'
        });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('zeta', 
            'assets/images/zeta_spritesheet.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(400, 300, 'background');

        let platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
    }

    update() {

    }

}