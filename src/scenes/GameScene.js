import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
		super({
            key: 'GameScene'
        });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.spritesheet('zeta', 
            'assets/images/zeta_spritesheet_alpha.png',
            { frameWidth: 40, frameHeight: 66 }
        );
    }

    create() {
        // Add the background image
        this.add.image(400, 300, 'background');

        this.player         = this.createPlayer();
    }

    update() {

    }

    createPlayer() {
        let player = this.physics.add.sprite(400, 450, 'zeta');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        
        return player;
    }
    
}