import { GameScene } from '../scenes/GameScene';

export class Level1 extends GameScene{
    constructor() {
		super({
            key: 'Level1'
        });

        this.levelCt = 1;
        this.botResetTime = 10000;
        this.botSpeed = 100;
        this.botSpawnCount = 2;
        this.botSpawnRate = 5000;
	}

    createPlatforms() {

        let platforms = super.createPlatforms();

        platforms.create(100, 135, 'platform');
        platforms.create(700, 135, 'platform');
        
        platforms.create(400, 270, 'platform');

        platforms.create(50, 405, 'platform');
        platforms.create(750, 405, 'platform');

        return platforms;
    }

    createSwitches(){
        let switches = this.physics.add.staticGroup();

        let botSwitch = switches.create(75, 75, 'switch');
        botSwitch.anims.play('switchOn');

        return switches;
    }
    
}