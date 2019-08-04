import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor(config) {
		super(config);

        this.character = {
            name: 'beta',
            height: 60
        };

        this.levelCt = 1;
        this.botResetTime = 10000;
        this.botSpeed = 100;
        this.botSpawnCount = 2;
        this.botSpawnRate = 5000;
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('wall', 'assets/images/wall.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('zeta', 
            'assets/images/zeta_spritesheet_'+this.character.name+'.png',
            { frameWidth: 40, frameHeight: this.character.height }
        );
        this.load.spritesheet('door', 
            'assets/images/door.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('switch', 
            'assets/images/switch.png',
            { frameWidth: 8, frameHeight: 16 }
        );
        this.load.spritesheet('bot', 
            'assets/images/protector_spritesheet.png',
            { frameWidth: 50, frameHeight: 50 }
        );
    }

    create() {

        this.botKillCount = 0;

        // Add the background image
        this.add.image(400, 300, 'background');

        // Set up sprite animations
        this.initAnimation();

        // Add a game controller with devault arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up all the game objects
        this.door           = this.createDoor();
        this.doorsign       = this.createDoorSign();
        this.platforms      = this.createPlatforms();
        this.walls          = this.createWalls();
        this.switches       = this.createSwitches();
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

        // Let the bots loose
        this.time.addEvent({
            delay: this.botSpawnRate,
            callback: (event)=>{
                this.spawnBot((Math.random()>0.5)?'left':'right');
            },
            callbackScope: this,
            repeat: this.botSpawnCount-1
        });
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

        if( this.botKillCount >= this.botSpawnCount ){
            // All bots destroyed
            this.botKillCount = 0;
            this.door.setActive(true);
            this.door.anims.play('doorOpen');
        }

    }

    createSwitches(){
        let switches = this.physics.add.staticGroup();

        let botSwitch = switches.create(75, 500, 'switch');
        botSwitch.anims.play('switchOn');

        return switches;
    }

    createDoor(){
        let door = this.physics.add.staticSprite(400, 508, 'door', 0);
        // Entry door is inactive
        door.setActive(false);
        return door;
    }

    createDoorSign(){
        this.add.text(380, 410, 'LEVEL', { fontSize: '12px', fill: '#cccc66', align: 'center', fontFamily: 'sans-serif' });
        return this.add.text(385, 420, '0', { fontSize: '48px', fill: '#cccc66', align: 'center', fontFamily: 'sans-serif' });
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
        if(bot.active){
            this.scene.start('EndScene');
        }else{
            let tmpbot = this.physics.add.staticSprite(bot.x, bot.y, 'bot');
            tmpbot.anims.play('botAsplode');
            bot.destroy();
            this.botKillCount++;
        }
    }

    handleOverlapDoor(player, door) {
        if(door.active){
            // Load the next scene
            this.scene.start(this.scene.manager.getAt(this.scene.getIndex()+1));
        }
    }

    handleOverlapSwitch(player, botswitch) {
        if(botswitch.active){
            botswitch.setActive(false);
            botswitch.anims.play('switchOff');
            this.disableBots();
        }
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

    disableBots(){
        for( let bot of this.bots.getChildren() ){
            bot.setVelocity(0,0).setActive(false);
        }
        this.time.addEvent({
            delay: this.botResetTime,
            callback: this.enableBots,
            callbackScope: this
        });
    }

    enableBots(){
        for( let botSwitch of this.switches.getChildren() ){
            botSwitch.anims.play('switchOn');
            botSwitch.setActive(true);
        }
        for( let bot of this.bots.getChildren() ){
            bot.setVelocityX(this.botSpeed).setActive(true);
            bot.anims.play('botRight');
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
            key: 'doorOpen',
            frames: this.anims.generateFrameNumbers('door', { start: 1, end: 3 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'switchOn',
            frames: [ { key: 'switch', frame: 1 } ],
            frameRate: 20,
        });

        this.anims.create({
            key: 'switchOff',
            frames: [ { key: 'switch', frame: 0 } ],
            frameRate: 20,
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