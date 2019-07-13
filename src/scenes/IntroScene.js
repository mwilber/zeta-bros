import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'IntroScene'
        });

	}

	preload() {
        this.load.image('splash', 'assets/images/intro_splash.png');
    }

    create() {
        // Add the background image
        this.splash = this.add.image(400, 300, 'splash');
        
        this.splash.setInteractive().on('pointerdown', () => { 
            console.log('start game'); 
            this.scene.start('Level1');
        });
    }
}