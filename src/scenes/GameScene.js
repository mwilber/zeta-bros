import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
		super({
            key: 'GameScene'
        });

        this.botSpeed = 100;
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
        this.load.spritesheet('bot', 
            'assets/images/protector_spritesheet.png',
            { frameWidth: 50, frameHeight: 50 }
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
        this.walls          = this.createWalls();
        this.player         = this.createPlayer();
        //Create an empty group for the security bots
        this.bots = this.physics.add.group();

        // Set up physics colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bots, this.platforms);
        this.physics.add.collider(this.bots, this.walls, this.handleCollisionWall.bind(this));
        this.physics.add.collider(this.player, this.bots, this.handleCollisionEnemy.bind(this));

        this.spawnBot();
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

    createWalls() {
        let walls = this.physics.add.staticGroup();

        walls.create(0, 300, 'wall').setActive(true);
        walls.create(800, 300, 'wall').setActive(true);

        return walls;
    }

    handleCollisionWall(bot, wall){
        if(wall.body.touching.left){
            bot.setVelocityX(-100);
            bot.anims.play('botLeft');
        }else if(wall.body.touching.right){
            bot.setVelocityX(100);
            bot.anims.play('botRight');
        }

        return true;
    }

    handleCollisionEnemy(player, bot) {
        this.scene.restart();
    }

    spawnBot(side){
        // Default to right side
        let position = 700;
        let velocity = -this.botSpeed;
        if(side === 'left'){
            position = 100;
            velocity = this.botSpeed;
        }
        let tmpbot = this.bots.create(position, 75, 'bot').setVelocityX(velocity);
        if(velocity < 0){
            tmpbot.anims.play('botLeft');
        }else{
            tmpbot.anims.play('botRight');
        }
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
        this.anims.create({
            key: 'botLeft',
            frames: this.anims.generateFrameNumbers('bot', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'botRight',
            frames: this.anims.generateFrameNumbers('bot', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'botAsplode',
            frames: this.anims.generateFrameNumbers('bot', { start: 4, end: 9 }),
            frameRate: 15
        });
    }
    
}