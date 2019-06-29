
import Phaser from 'phaser';

export class DemoScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'DemoScene'
        });

        this.player = null;
        this.platforms = null;
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

        this.createPlatforms();
        this.createPlayer();
        this.createAnimation();

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }

    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(100, 135, 'platform');
        this.platforms.create(700, 135, 'platform');
        
        this.platforms.create(400, 270, 'platform');

        this.platforms.create(50, 405, 'platform');
        this.platforms.create(750, 405, 'platform');

        this.platforms.create(400, 572, 'platform').setScale(2).refreshBody();
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'zeta');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    }

    createAnimation() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('zeta', { start: 0, end: 3 }),
            frameRate: 10,
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
            frameRate: 10,
            repeat: -1
        });
    }

    
}