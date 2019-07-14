
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
		super({
            key: 'GameScene'
        });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
    }

    create() {
        // Add the background image
        this.add.image(400, 300, 'background');
    }

    update() {

    }
    
}