import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
		super({
            key: 'GameScene'
        });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('wall', 'assets/images/wall.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('zeta', 
            'assets/images/zeta_spritesheet_alpha.png',
            { frameWidth: 40, frameHeight: 66 }
        );
    }

    create() {
        // Add the background image
        this.add.image(400, 300, 'background');

        // Set up sprite animations
        this.initAnimation();

        // Add a game controller with devault arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        this.platforms      = this.createPlatforms();
        this.player         = this.createPlayer();
    }

    update() {

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        }else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-750);
        }

    }

    createPlatforms() {
        let platforms = this.physics.add.staticGroup();

        platforms.create(100, 135, 'platform');
        platforms.create(700, 135, 'platform');
        
        platforms.create(400, 270, 'platform');

        platforms.create(50, 405, 'platform');
        platforms.create(750, 405, 'platform');

        platforms.create(400, 572, 'ground');

        return platforms;
    }

    createPlayer() {
        let player = this.physics.add.sprite(400, 450, 'zeta');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        
        return player;
    }

    initAnimation() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('zeta', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'zeta', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('zeta', { start: 5, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

    }
    
}