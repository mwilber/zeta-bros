import { GameScene } from '../scenes/GameScene';

export class Level2 extends GameScene{
    constructor() {
		super({
            key: 'Level2'
        });

        this.levelCt = 2;
        this.botResetTime = 5000;
        this.botSpeed = 100;
        this.botSpawnCount = 4;
        this.botSpawnRate = 2500;
	}

    createPlatforms() {

        let platforms = super.createPlatforms();

        platforms.create(400, 135, 'platform');
        platforms.create(800, 135, 'platform');
        platforms.create(100, 270, 'platform');
        platforms.create(750, 270, 'platform');
        platforms.create(400, 375, 'platform');

        return platforms;
    }

    createSwitches(){
        let switches = this.physics.add.staticGroup();

        let botSwitch = switches.create(400, 75, 'switch');
        botSwitch.anims.play('switchOn');

        return switches;
    }
    
}