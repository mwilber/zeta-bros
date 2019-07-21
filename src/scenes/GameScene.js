
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor(config) {
		super(config);

        this.levelCt = 1;
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('wall', 'assets/images/wall.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('zeta_alpha', 
            'assets/images/zeta_spritesheet_alpha.png',
            { frameWidth: 40, frameHeight: 66 }
        );
        this.load.spritesheet('zeta_beta', 
            'assets/images/zeta_spritesheet_beta.png',
            { frameWidth: 40, frameHeight: 60 }
        );
        this.load.spritesheet('door', 
            'assets/images/door.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.image('bot', 'assets/images/security_bot.png');
    }

    create() {

        this.charactername = 'zeta_'+localStorage.getItem("character");
        console.log('creating character', this.charactername);
        
        this.unlockCt = 0;

        // Add the background image
        this.add.image(400, 300, 'background');

        // Set up sprite animations
        this.initAnimation();

        // Add a game controller with devault arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up all the game objects
        this.door           = this.createDoors();
        this.doorsign       = this.createDoorSign();
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
        this.physics.add.overlap(this.player, this.door, this.handleOverlapDoor.bind(this));

        // Set the level indicator
        this.doorsign.setText(this.levelCt);
    }

    update(scenetime) {

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

    createDoors(){
        let door = this.physics.add.staticGroup();

        // Entry door is inactive
        door.create(400, 508, 'door', 0, true, false);

        return door;
    }

    createDoorSign(){
        this.add.text(380, 410, 'LEVEL', { fontSize: '12px', fill: '#ff0000', align: 'center', fontFamily: 'sans-serif' });
        return this.add.text(385, 420, '0', { fontSize: '48px', fill: '#ff0000', align: 'center', fontFamily: 'sans-serif' });
    }

    createPlatforms() {
        let platforms = this.physics.add.staticGroup();

        // platforms.create(100, 135, 'platform');
        // platforms.create(700, 135, 'platform');
        
        // platforms.create(400, 270, 'platform');

        // platforms.create(50, 405, 'platform');
        // platforms.create(750, 405, 'platform');

        platforms.create(400, 572, 'ground');

        return platforms;
    }

    createPlayer() {
        console.log('creating player', this.charactername);
        let player = this.physics.add.sprite(100, 450, this.charactername);

        player.setMass(1700);
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

    handleCollisionWall(event, collider){
        if(collider.body.touching.left){
            event.setVelocityX(-100);
        }else if(collider.body.touching.right){
            event.setVelocityX(100);
        }

        return true;
    }

    handleCollisionEnemy(event, collider) {
        this.scene.start('EndScene');
    }

    handleOverlapDoor(event, collider) {
        if(collider.active){
            // Load the next scene
            this.scene.start(this.scene.manager.getAt(this.scene.getIndex()+1));
        }
    }

    initAnimation() {

        // Clear out the zeta anims to allow for character change
        this.anims.remove('left');
        this.anims.remove('turn');
        this.anims.remove('right');

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(this.charactername, { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: this.charactername, frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.charactername, { start: 5, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'doorOpen',
            frames: this.anims.generateFrameNumbers('door', { start: 1, end: 3 }),
            frameRate: 10
        });
    }

    spawnBot(side){
        // Default to right side
        let position = 700;
        let velocity = -100;
        if(side === 'left'){
            position = 100;
            velocity = 100;
        }
        this.bots.create(position, 75, 'bot').setVelocityX(velocity);
    }
    
}