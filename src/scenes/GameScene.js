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
        this.load.spritesheet('switch', 
            'assets/images/switch.png',
            { frameWidth: 8, frameHeight: 16 }
        );
        this.load.spritesheet('bot', 
            'assets/images/protector_spritesheet.png',
            { frameWidth: 50, frameHeight: 50 }
        );

        this.load.audio('aud_end_game', 'assets/audio/end_game.wav');
        this.load.audio('aud_jump', 'assets/audio/jump.wav');
        this.load.audio('aud_walk', 'assets/audio/walk.wav');
        this.load.audio('aud_power_down', 'assets/audio/power_down.wav');
        this.load.audio('aud_power_up', 'assets/audio/power_up.wav');
        this.load.audio('aud_success', 'assets/audio/success.mp3');
        this.load.audio('aud_bot_kill', 'assets/audio/bot_kill.mp3');
    }

    create() {

        this.charactername = 'zeta_'+localStorage.getItem("character");

        this.botKillCount = 0;

        // Add the background image
        this.add.image(400, 300, 'background');

        // Set up sprite animations
        this.initAnimation();

        // Set up the sound fx
        this.createAudio();

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
            if(!this.audWalk.isPlaying && this.player.body.touching.down) this.audWalk.play();
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        }else if (this.cursors.right.isDown){
            if(!this.audWalk.isPlaying && this.player.body.touching.down) this.audWalk.play();
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        }else{
            this.audWalk.stop();
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.audJump.play();
            this.player.setVelocityY(-750);
        }

        if( this.botKillCount >= this.botSpawnCount ){
            // All bots destroyed
            this.audSuccess.play();
            this.botKillCount = 0;
            this.door.setActive(true);
            this.door.anims.play('doorOpen');
        }

    }

    createAudio(){
        this.audEndGame = this.sound.add('aud_end_game');
        this.audJump = this.sound.add('aud_jump');
        this.audWalk = this.sound.add('aud_walk');
        this.audPowerDown = this.sound.add('aud_power_down');
        this.audPowerUp = this.sound.add('aud_power_up');
        this.audSuccess = this.sound.add('aud_success');
        this.audBotKill = this.sound.add('aud_bot_kill');
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
        let player = this.physics.add.sprite(400, 450, this.charactername);

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
            this.audEndGame.play();
            this.scene.start('EndScene');
        }else{
            this.audBotKill.play();
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
        this.audPowerDown.play();
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
        this.audPowerUp.play();
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