import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'IntroScene'
        });

	}

	preload() {
        this.load.image('splash', 'assets/images/intro_splash.png');
        this.load.audio('aud_start_game', 'assets/audio/start_game.wav');
    }

    create() {
        // Add the background image
        this.splash = this.add.image(400, 300, 'splash');
        this.audStartGame = this.sound.add('aud_start_game');

        
        
        this.splash.setInteractive().on('pointerdown', () => { 
            console.log('start game'); 
            this.audStartGame.play();
            this.scene.start('Level1');
            
        });
    }
}