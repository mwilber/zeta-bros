
import Phaser from 'phaser';

export class DemoScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'DemoScene'
        });

        this.player = null;
        this.platforms = null;
        this.unlockCt = 0;
        this.bots = null;
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('zeta', 
            'assets/images/zeta_spritesheet.png',
            { frameWidth: 40, frameHeight: 60 }
        );
        this.load.spritesheet('door', 
            'assets/images/door.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('switch', 
            'assets/images/switch.png',
            { frameWidth: 8, frameHeight: 16 }
        );

        this.load.image('bot', 'assets/images/security_bot.png');
    }

    create() {
        this.unlockCt = 0;

        this.add.image(400, 300, 'background');

        // Add the door
        this.door = this.physics.add.staticGroup();
        this.door.create(400, 508, 'door');

        // Add the switches
        this.switches = this.physics.add.staticGroup();
        this.switches.create(75, 75, 'switch');
        this.switches.create(75, 345, 'switch');
        this.switches.create(775, 75, 'switch');
        this.switches.create(775, 345, 'switch');

        //Create an empty group for the security bots
        this.bots = this.physics.add.group();

        this.createPlatforms();
        this.createPlayer();
        this.createAnimation();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bots, this.platforms);
        this.physics.add.collider(this.player, this.bots, (event)=>{
            this.scene.restart();
        });
        this.physics.add.overlap(this.player, this.door, (event)=>{
            if(this.unlockCt >= 4){
                this.scene.restart();
            }
        });

        this.physics.add.overlap(this.player, this.switches, (event, collider)=>{
            //console.log('switch collision', event, collider);
            if(collider.active){
                collider.setActive(false);
                collider.anims.play('switchOn');
                this.unlockCt++;
                if(this.unlockCt >= 4){
                this.door.getFirst(true).anims.play('doorOpen');
                }
                this.createBot();
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
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

    createBot(){
        this.bots.create(775, 345, 'bot');
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(100, 135, 'platform');
        this.platforms.create(700, 135, 'platform');
        
        this.platforms.create(400, 270, 'platform');

        this.platforms.create(50, 405, 'platform');
        this.platforms.create(750, 405, 'platform');

        this.platforms.create(400, 572, 'ground');
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

        this.anims.create({
            key: 'switchOn',
            frames: [ { key: 'switch', frame: 1 } ],
            frameRate: 20,
        });

        this.anims.create({
            key: 'switchOff',
            frames: [ { key: 'switch', frame: 1 } ],
            frameRate: 20,
        });

        this.anims.create({
            key: 'doorOpen',
            frames: this.anims.generateFrameNumbers('door', { start: 1, end: 3 }),
            frameRate: 10
        });
    }

    
}