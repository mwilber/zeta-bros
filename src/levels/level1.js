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
        platforms.create(700, 135, 'platform');
        
        platforms.create(400, 270, 'platform');

        platforms.create(50, 405, 'platform');
        platforms.create(750, 405, 'platform');

        return platforms;
    }

    create() {
        super.create();

        this.time.addEvent({
            delay: 5000,
            callback: (event)=>{
                this.spawnBot('left');
            },
            callbackScope: this,
            repeat: 1
        });
    }
    
}