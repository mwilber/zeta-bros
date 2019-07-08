
import Phaser from 'phaser';

export class DemoScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'DemoScene'
        });

        this.levelCt = 1;
        this.unlockCt = 0;
        this.unlockTotal = 4;

	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('wall', 'assets/images/wall.png');
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

        // Add the background image
        this.add.image(400, 300, 'background');

        // Set up sprite animations
        this.initAnimation();

        // Add a game controller with devault arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up all the game objects
        this.door           = this.createDoor();
        this.doorsign       = this.createDoorSign();
        this.switches       = this.createSwitches();
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
        this.physics.add.overlap(this.player, this.switches, this.handleOverlapSwitch.bind(this));

        // Set the level indicator
        this.doorsign.setText(this.levelCt);
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

    createDoor(){
        let door = this.physics.add.staticGroup();
        door.create(400, 508, 'door');

        return door;
    }

    createDoorSign(){
        this.add.text(380, 410, 'LEVEL', { fontSize: '12px', fill: '#ff0000', align: 'center', fontFamily: 'sans-serif' });
        return this.add.text(385, 420, '0', { fontSize: '48px', fill: '#ff0000', align: 'center', fontFamily: 'sans-serif' });
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
        let player = this.physics.add.sprite(100, 450, 'zeta');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        return player;
    }

    createSwitches() {
        let switches = this.physics.add.staticGroup();
        switches.create(75, 75, 'switch');
        switches.create(75, 345, 'switch');
        switches.create(775, 75, 'switch');
        switches.create(775, 345, 'switch');

        return switches;
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
        this.scene.restart();
    }

    handleOverlapDoor(event, collider) {
        if(this.unlockCt >= 4){
            this.levelCt++;
            this.scene.restart();
        }
    }

    handleOverlapSwitch(event, collider) {
        if(collider.active){
            // Turn off the switch so it can be pressed just once
            collider.setActive(false);
            // Update the sprite
            collider.anims.play('switchOn');
            this.unlockCt++;
            if(this.unlockCt >= this.unlockTotal){
                this.door.getFirst(true).anims.play('doorOpen');
            }
            return;
            if(collider.x > (this.game.canvas.width/2)){
                this.spawnBot('left');
            }else{
                this.spawnBot();
            }
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