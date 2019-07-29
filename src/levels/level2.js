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

        platforms.create(100, 135, 'platform');
        platforms.create(400, 270, 'platform');
        platforms.create(750, 405, 'platform');

        return platforms;
    }
    
}