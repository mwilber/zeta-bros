import { GameScene } from '../scenes/GameScene';

export class Level2 extends GameScene{
    constructor() {
		super({
            key: 'Level2',
            botResetTime: 10000,
            botSpeed: 200,
            botSpawnCount: 4,
            botSpawnRate: 2500
        });

        this.levelCt = 2;
	}

    createPlatforms() {

        let platforms = super.createPlatforms();

        platforms.create(100, 135, 'platform');
        platforms.create(400, 270, 'platform');
        platforms.create(750, 405, 'platform');

        return platforms;
    }

    createDoors(){
        let door = super.createDoors();

        // Add an exit door
        door.create(100, 84, 'door', 3);

        return door;
    }

    create() {
        super.create();

        this.time.addEvent({
            delay: 5000,
            callback: (event)=>{
                this.spawnBot('left');
            },
            callbackScope: this,
            repeat: 3
        });
    }
    
}