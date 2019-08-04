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

        // Add a game controller with devault arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player         = this.createPlayer();
    }

    update() {

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);
        }else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);
        }else{
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-750);
        }

    }

    createPlayer() {
        let player = this.physics.add.sprite(400, 450, 'zeta');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        
        return player;
    }
    
}