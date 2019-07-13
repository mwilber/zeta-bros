import { GameScene } from '../scenes/GameScene';

export class Level1 extends GameScene{
    constructor() {
		super({
			key: 'Level1'
        });

        this.levelCt = 1;

	}


    createPlatforms() {

        let platforms = super.createPlatforms();

        platforms.create(100, 135, 'platform');
        platforms.create(700, 405, 'platform');

        return platforms;
    }
    
}